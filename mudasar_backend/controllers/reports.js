const pool = require("../config/pool");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const petrolDipChart = require("../sources/petrolDipChart");
const dieselDipChart = require("../sources/dieselDipChart");

// Parse VARCHAR date column to date (supports both DD-MM-YYYY and YYYY-MM-DD; invalid -> NULL)
function dateExpr(col) {
  return `(CASE WHEN ${col} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN (${col})::date WHEN ${col} ~ '^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$' THEN TO_DATE(${col}, 'DD-MM-YYYY') ELSE NULL END)`;
}

function calculateLitres(value, chart) {
  const dipValue = parseFloat(value);
  if (isNaN(dipValue)) return 0;
  const sorted = [...chart].sort((a, b) => a.dip - b.dip);
  const floor = sorted.filter((d) => d.dip <= dipValue).pop();
  const ceiling = sorted.find((d) => d.dip >= dipValue);
  if (!floor || !ceiling) return 0;
  if (floor.dip === ceiling.dip) return floor.litres;
  const extraDip = dipValue - floor.dip;
  const litresPerDip = (ceiling.litres - floor.litres) / (ceiling.dip - floor.dip);
  return floor.litres + extraDip * litresPerDip;
}

// ─── MONTHLY REPORT DATA ─────────────────────────────────────────────────────

const emptyReport = (startDate, endDate) => ({
  startDate: startDate || "",
  endDate: endDate || "",
  products: [],
  grossTotal: { quantity: 0, amount: 0, profit: 0 },
  totalExpenses: 0,
  totalCustomerDebit: 0,
  totalCustomerCredit: 0,
  totalCustomerAdvance: 0,
  totalEmployeeAdvance: 0,
  totalEmployeeAdvanceReturn: 0,
  totalSupplierPaymentAmount: 0,
  totalPOSMachineAmount: 0,
  gain: [],
  endDateProductStocks: [],
  priceChangeProfit: 0,
});

const genMonthlyReport = async (req, res) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  if (!startDate && !endDate) {
    return res.status(400).json({ errors: { msg: "startDate and endDate are required" }, success: false });
  }
  startDate = startDate || endDate;
  endDate = endDate || startDate;
  try {
    const result = await generateMonthlySalesReport(startDate, endDate);
    return res.status(200).json({ data: [result], success: true });
  } catch (error) {
    console.error("genMonthlyReport error:", error);
    return res.status(500).json({ errors: { msg: error.message || "Internal Server Error" }, success: false });
  }
};

// ─── CUSTOMER REPORT DATA ─────────────────────────────────────────────────────

const genCustomerReport = async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.query;
    if (!customerId || !startDate || !endDate)
      return res.status(400).json({ errors: [{ msg: "Missing required fields" }], success: false });

    const data = await buildCustomerReportData(customerId, startDate, endDate);
    return res.status(200).json({ success: true, data: [data] });
  } catch (error) {
    console.error("genCustomerReport error:", error);
    const msg = process.env.NODE_ENV === "production" ? "Internal Server Error" : (error.message || "Internal Server Error");
    return res.status(500).json({ errors: [{ msg }], success: false });
  }
};

// ─── PRINT MONTHLY REPORT ─────────────────────────────────────────────────────

const printMonthlyReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await generateMonthlySalesReport(startDate, endDate);

    const html = await ejs.renderFile(path.resolve(__dirname, "..", "views", "monthlyreport.ejs"), result);
    const filePath = path.join(__dirname, "..", "public", "pdfs", "monthly_report.pdf");

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "Legal", printBackground: true });
    await browser.close();

    return res.status(200).json({ success: true, url: `/public/pdfs/monthly_report.pdf` });
  } catch (error) {
    console.error("printMonthlyReport error:", error);
    const msg = process.env.NODE_ENV === "production" ? "Internal Server Error" : (error.message || "Internal Server Error");
    return res.status(500).json({ errors: { msg }, success: false });
  }
};

// ─── PRINT CUSTOMER REPORT ────────────────────────────────────────────────────

const printCustomerReport = async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.query;
    if (!customerId || !startDate || !endDate)
      return res.status(400).json({ errors: [{ msg: "Missing required fields" }], success: false });

    const data = await buildCustomerReportData(customerId, startDate, endDate);

    const html = await ejs.renderFile(path.resolve(__dirname, "..", "views", "customerreport.ejs"), data);
    const filePath = path.join(__dirname, "..", "public", "pdfs", "customer_report.pdf");

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "Legal", printBackground: true });
    await browser.close();

    return res.status(200).json({ success: true, url: `/public/pdfs/customer_report.pdf` });
  } catch (error) {
    console.error("printCustomerReport error:", error);
    const msg = process.env.NODE_ENV === "production" ? "Internal Server Error" : (error.message || "Internal Server Error");
    return res.status(500).json({ errors: { msg }, success: false });
  }
};

// ─── SUPPORTING: CUSTOMER REPORT DATA ────────────────────────────────────────

async function buildCustomerReportData(customerId, startDate, endDate) {
  const customerResult = await pool.query("SELECT id, name, contact, balance FROM customers WHERE id = $1", [customerId]);
  const customer = customerResult.rows[0] || {};

  const lastPaymentResult = await pool.query(
    `SELECT rem_amount FROM customer_payments WHERE customer_id = $1 AND ${dateExpr("date")} < $2::date ORDER BY ${dateExpr("date")} DESC LIMIT 1`,
    [customerId, startDate]
  );
  const setLastAmount = lastPaymentResult.rows[0]?.rem_amount || 0;

  const saleItemsResult = await pool.query(
    `SELECT si.amount, si.description, p.name AS product_name, pr.new_selling_price,
            CASE WHEN pr.new_selling_price > 0 THEN ROUND(si.amount / pr.new_selling_price, 2) ELSE 0 END AS quantity,
            s.date
     FROM sales s
     JOIN sale_items si ON si.sale_id = s.id
     JOIN products p ON p.id = si.product_id
     LEFT JOIN prices pr ON pr.id = si.price_id
     WHERE s.customer_id = $1 AND ${dateExpr("s.date")} BETWEEN $2::date AND $3::date
     ORDER BY ${dateExpr("s.date")}`,
    [customerId, startDate, endDate]
  );

  const saleRecords = saleItemsResult.rows;
  const saleGrandTotal = saleRecords.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

  const advancesResult = await pool.query(
    `SELECT date, description, amount FROM customer_advances WHERE customer_id = $1 AND ${dateExpr("date")} BETWEEN $2::date AND $3::date`,
    [customerId, startDate, endDate]
  );
  const advanceRecords = advancesResult.rows;
  const advanceGrandTotal = advanceRecords.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

  const paymentsResult = await pool.query(
    `SELECT date, paying_amount FROM customer_payments WHERE customer_id = $1 AND ${dateExpr("date")} BETWEEN $2::date AND $3::date`,
    [customerId, startDate, endDate]
  );
  const paymentRecords = paymentsResult.rows;
  const paymentGrandTotal = paymentRecords.reduce((sum, r) => sum + parseFloat(r.paying_amount || 0), 0);

  return {
    lastAmount: setLastAmount,
    customer,
    credits: { records: saleRecords, grandTotal: parseFloat(saleGrandTotal.toFixed(2)) },
    advances: { records: advanceRecords, grandTotal: parseFloat(advanceGrandTotal.toFixed(2)) },
    payments: { records: paymentRecords, grandTotal: parseFloat(paymentGrandTotal.toFixed(2)) },
  };
}

// ─── SUPPORTING: MONTHLY REPORT DATA ─────────────────────────────────────────

async function generateMonthlySalesReport(startDate, endDate) {
  // Dates from frontend are YYYY-MM-DD; DB stores dates as DD-MM-YYYY in VARCHAR columns
  if (!startDate || !endDate) {
    startDate = startDate || endDate;
    endDate = endDate || startDate;
  }
  const dc = (c) => dateExpr(`cc.${c}`);
  // Get all closings in range (compare as dates)
  const closingsResult = await pool.query(
    `SELECT cc.* FROM cashier_closings cc WHERE ${dc("date")} BETWEEN $1::date AND $2::date ORDER BY cc.created_on ASC`,
    [startDate, endDate]
  );
  const allClosings = closingsResult.rows;

  const startClosingResult = await pool.query(
    `SELECT cc.* FROM cashier_closings cc WHERE ${dc("date")} >= $1::date ORDER BY ${dc("date")} ASC, cc.created_on ASC LIMIT 1`,
    [startDate]
  );
  const endClosingResult = await pool.query(
    `SELECT cc.* FROM cashier_closings cc WHERE ${dc("date")} <= $1::date ORDER BY ${dc("date")} DESC, cc.created_on DESC LIMIT 1`,
    [endDate]
  );
  const startClosing = startClosingResult.rows[0];
  const endClosing = endClosingResult.rows[0];

  // Get dips for start/end closing
  const startDipIds = startClosing ? (typeof startClosing.stock_dip_ids === "string" ? JSON.parse(startClosing.stock_dip_ids) : startClosing.stock_dip_ids || []) : [];
  const endDipIds = endClosing ? (typeof endClosing.stock_dip_ids === "string" ? JSON.parse(endClosing.stock_dip_ids) : endClosing.stock_dip_ids || []) : [];

  const startDipReadings = startDipIds.length > 0 ? (await pool.query("SELECT d.*, p.name AS product_name FROM dips d JOIN products p ON p.id = d.product_id WHERE d.id = ANY($1)", [startDipIds])).rows : [];
  const endDipReadings = endDipIds.length > 0 ? (await pool.query("SELECT d.*, p.name AS product_name FROM dips d JOIN products p ON p.id = d.product_id WHERE d.id = ANY($1)", [endDipIds])).rows : [];

  // POS machine total
  const totalPOSMachineAmount = allClosings.reduce((sum, c) => sum + parseFloat(c.bank_amount || 0), 0);

  // Build product sales: prefer cashier_closing_items table; fallback to closing.items JSON
  const productMap = new Map();
  const closingIds = allClosings.map((c) => c.id).filter(Boolean);
  if (closingIds.length > 0) {
    try {
      const itemsResult = await pool.query(
        `SELECT closing_id, product_id, price_id, prev_stock, new_stock, quantity, test_entry
         FROM cashier_closing_items WHERE closing_id = ANY($1)`,
        [closingIds]
      );
      for (const row of itemsResult.rows) {
        const key = `${row.product_id}_${row.price_id}`;
        const existing = productMap.get(key) || { product_id: row.product_id, price_id: row.price_id, totalQuantity: 0, testEntry: 0 };
        const qty = parseFloat(row.quantity ?? (parseFloat(row.prev_stock || 0) - parseFloat(row.new_stock || 0)));
        productMap.set(key, {
          ...existing,
          totalQuantity: existing.totalQuantity + qty,
          testEntry: existing.testEntry + parseFloat(row.test_entry || 0),
        });
      }
    } catch (_) {
      // table might not exist; fall through to items JSON
    }
  }
  if (productMap.size === 0) {
    for (const closing of allClosings) {
      const items = typeof closing.items === "string" ? JSON.parse(closing.items || "[]") : (closing.items || []);
      for (const item of items) {
        const key = `${item.product_id}_${item.price_id}`;
        const existing = productMap.get(key) || { product_id: item.product_id, price_id: item.price_id, totalQuantity: 0, testEntry: 0 };
        const qty = parseFloat(item.prev_stock || 0) - parseFloat(item.new_stock || 0);
        productMap.set(key, { ...existing, totalQuantity: existing.totalQuantity + qty, testEntry: existing.testEntry + (item.test_entry || 0) });
      }
    }
  }

  // Fallback: if still no product data (e.g. no cashier closings), derive from sales/sale_items
  if (productMap.size === 0) {
    const salesByProduct = await pool.query(
      `SELECT si.product_id, si.price_id,
              SUM(CASE WHEN pr.new_selling_price > 0 THEN si.amount / pr.new_selling_price ELSE 0 END) AS total_quantity,
              SUM(si.amount) AS total_amount
       FROM sales s
       JOIN sale_items si ON si.sale_id = s.id
       JOIN prices pr ON pr.id = si.price_id
       WHERE ${dateExpr("s.date")} BETWEEN $1::date AND $2::date
       GROUP BY si.product_id, si.price_id`,
      [startDate, endDate]
    );
    for (const row of salesByProduct.rows) {
      const key = `${row.product_id}_${row.price_id}`;
      productMap.set(key, {
        product_id: row.product_id,
        price_id: row.price_id,
        totalQuantity: parseFloat(row.total_quantity || 0),
        testEntry: 0,
      });
    }
  }

  const reportData = [];
  let totalProfit = 0;
  for (const { product_id, price_id, totalQuantity, testEntry } of productMap.values()) {
    const pResult = await pool.query("SELECT name FROM products WHERE id = $1", [product_id]);
    const prResult = await pool.query("SELECT new_selling_price, cost_price FROM prices WHERE id = $1", [price_id]);
    if (!pResult.rows[0] || !prResult.rows[0]) continue;
    const product = pResult.rows[0];
    const price = prResult.rows[0];
    const amount = totalQuantity * parseFloat(price.new_selling_price);
    const profit = (parseFloat(price.new_selling_price) - parseFloat(price.cost_price)) * totalQuantity;
    totalProfit += profit;
    reportData.push({ productName: product.name, quantity: totalQuantity, sellingPrice: price.new_selling_price, costPrice: price.cost_price, amount, testEntry, profit });
  }

  const grossTotal = {
    quantity: reportData.reduce((s, i) => s + i.quantity, 0),
    amount: reportData.reduce((s, i) => s + i.amount, 0),
    profit: totalProfit,
  };

  // Financial summaries (support both DD-MM-YYYY and YYYY-MM-DD in DB)
  const [expenseResult, debitResult, creditResult, advanceResult, empAdvResult, empPayResult, supPayResult] = await Promise.all([
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
    pool.query(`SELECT COALESCE(SUM(paying_amount),0) AS total FROM customer_payments WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
    pool.query(`SELECT COALESCE(SUM(si.amount),0) AS total FROM sales s JOIN sale_items si ON si.sale_id = s.id WHERE ${dateExpr("s.date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM customer_advances WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM employee_advances WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM employee_payments WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
    pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM supplier_payments WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]),
  ]);

  const priceChangeResult = await pool.query(`SELECT COALESCE(SUM(difference_value),0) AS total FROM prices WHERE ${dateExpr("date")} BETWEEN $1::date AND $2::date`, [startDate, endDate]);

  const gainResult = await pool.query(
    `SELECT d.product_id, p.name AS product_name, SUM(d.gain) AS total_gain,
            SUM(d.gain * COALESCE(pr.cost_price, 0)) AS total_amount, COUNT(*) AS dip_count
     FROM dips d
     JOIN products p ON p.id = d.product_id
     LEFT JOIN LATERAL (SELECT cost_price FROM prices WHERE product_id = d.product_id ORDER BY created_on DESC LIMIT 1) pr ON true
     WHERE ${dateExpr("d.date")} BETWEEN $1::date AND $2::date
     GROUP BY d.product_id, p.name`,
    [startDate, endDate]
  );

  // End-of-period stock (from end closing items or cashier_closing_items)
  const lastStock = endClosing;
  const endDateProductStocks = [];
  if (lastStock) {
    let lastItems = typeof lastStock.items === "string" ? JSON.parse(lastStock.items || "[]") : (lastStock.items || []);
    if (lastItems.length === 0 && lastStock.id) {
      const ciRows = await pool.query("SELECT product_id, price_id, new_stock FROM cashier_closing_items WHERE closing_id = $1", [lastStock.id]);
      lastItems = ciRows.rows.map((r) => ({ product_id: r.product_id, price_id: r.price_id, new_stock: r.new_stock }));
    }
    for (const item of lastItems) {
      const pRes = await pool.query("SELECT name FROM products WHERE id = $1", [item.product_id]);
      const prRes = await pool.query("SELECT new_selling_price FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [item.product_id]);
      const newStock = parseFloat(item.new_stock || 0);
      const sellingPrice = parseFloat(prRes.rows[0]?.new_selling_price || 0);
      endDateProductStocks.push({
        productId: item.product_id,
        productName: pRes.rows[0]?.name || "Unknown",
        newStock,
        sellingPrice,
        amount: newStock * sellingPrice,
      });
    }
  }

  return {
    startDate,
    endDate,
    products: reportData,
    grossTotal,
    totalExpenses: parseFloat(expenseResult.rows[0].total),
    totalCustomerDebit: parseFloat(debitResult.rows[0].total),
    totalCustomerCredit: parseFloat(creditResult.rows[0].total),
    totalCustomerAdvance: parseFloat(advanceResult.rows[0].total),
    totalEmployeeAdvance: parseFloat(empAdvResult.rows[0].total),
    totalEmployeeAdvanceReturn: parseFloat(empPayResult.rows[0].total),
    totalSupplierPaymentAmount: parseFloat(supPayResult.rows[0].total),
    totalPOSMachineAmount,
    gain: gainResult.rows,
    endDateProductStocks,
    priceChangeProfit: parseFloat(priceChangeResult.rows[0].total),
  };
}

module.exports = { genMonthlyReport, genCustomerReport, printMonthlyReport, printCustomerReport };
