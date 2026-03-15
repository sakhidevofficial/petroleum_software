require("dotenv").config();
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const QRCode = require("qrcode");
const puppeteer = require("puppeteer");
const FormData = require("form-data");
const axios = require("axios");
const moment = require("moment-timezone");
const pool = require("../config/pool");
const petrolDipChart = require("../sources/petrolDipChart");
const dieselDipChart = require("../sources/dieselDipChart");

const round = (num) => Math.round(num * 100) / 100;

// ======================== FETCH / LIST ========================

const getSaleClosings = async (req, res) => {
  try {
    const { field, searchInput, page, sort, startDate, endDate } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT cc.id, cc.date, cc.status, cc.created_on, u.name AS cashier_name, u.id AS cashier_id, u.pic AS cashier_pic FROM cashier_closings cc JOIN users u ON u.id = cc.user_id`;

    let rows, countResult;

    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(
        `${base} WHERE u.name ILIKE $1 ORDER BY cc.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM cashier_closings cc JOIN users u ON u.id = cc.user_id WHERE u.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `${base} WHERE TO_DATE(cc.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY cc.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM cashier_closings WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`,
        [start, end]
      );
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY cc.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM cashier_closings");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getLastClosing = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM cashier_closings ORDER BY created_on DESC LIMIT 1");
    return res.status(200).json({ data: rows[0] || {}, success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

const getTodaysClosing = async (req, res) => {
  try {
    const { rows: userRows } = await pool.query("SELECT shift FROM users WHERE id = $1", [req.user.id]);
    if (userRows.length === 0) return res.status(200).json({ data: false, success: false });

    const shift = userRows[0].shift;
    let openingTime, closingTime;

    if (shift === "night") {
      openingTime = moment.tz("Asia/Karachi").set({ hour: 18, minute: 0, second: 0 }).utc().toDate();
      closingTime = moment.tz("Asia/Karachi").set({ hour: 6, minute: 0, second: 0 }).utc().toDate();
    } else {
      openingTime = moment.tz("Asia/Karachi").set({ hour: 6, minute: 0, second: 0 }).utc().toDate();
      closingTime = moment.tz("Asia/Karachi").set({ hour: 18, minute: 0, second: 0 }).utc().toDate();
    }

    const { rows } = await pool.query(
      "SELECT id FROM cashier_closings WHERE user_id = $1 AND created_on > $2 AND created_on < $3 LIMIT 1",
      [req.user.id, openingTime, closingTime]
    );

    return res.status(200).json({ data: rows.length > 0, success: rows.length > 0 });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

// ======================== ADD CASHIER CLOSING ========================

const addCashierClosing = async (req, res) => {
  const client = await pool.connect();
  const rollbackTracker = {
    readingIds: [], stockUpdates: [], machineIds: [], dipIds: [], saleIds: [],
    customerAdvanceIds: [], customerPaymentIds: [], employeeAdvanceIds: [],
    employeePaymentIds: [], expenseIds: [], cashId: null, closingId: null,
  };

  try {
    const { userId, date, bankAmount, dips, products, customer, employees, expenses, cashInHand } = req.body;

    const alreadyClosed = await pool.query("SELECT id FROM cashier_closings WHERE user_id = $1 AND date = $2", [userId, date]);
    if (alreadyClosed.rows.length > 0) {
      return res.status(200).json({ errors: [{ msg: "You have already closed sale", success: false }] });
    }

    const lastClosing = await pool.query("SELECT * FROM cashier_closings ORDER BY created_on DESC LIMIT 1");
    if (lastClosing.rows.length > 0) {
      const lastDate = moment(lastClosing.rows[0].date, "DD-MM-YYYY");
      const inputDate = moment(date, "DD-MM-YYYY");
      if (lastDate.isAfter(inputDate)) {
        return res.status(200).json({ errors: [{ msg: "You can not add sale before last sale closed. Change date.", success: false }] });
      }
    }

    await client.query("BEGIN");

    const processedProducts = await processRealProducts(client, products, date, rollbackTracker);
    const savedDipIds = await storeDipEntries(client, { dips, userId, date, processedProducts }, rollbackTracker);
    rollbackTracker.dipIds.push(...savedDipIds);

    const customerCreditIds = await processCustomerCredits(client, { customer, userId, date }, rollbackTracker);
    rollbackTracker.saleIds.push(...customerCreditIds);

    const customerAdvanceIds = await processCustomerAdvances(client, { customer, userId, date }, rollbackTracker);
    rollbackTracker.customerAdvanceIds.push(...customerAdvanceIds);

    const customerPaymentIds = await processCustomerDebits(client, { customer, userId, date }, rollbackTracker);
    rollbackTracker.customerPaymentIds.push(...customerPaymentIds);

    const employeeAdvanceIds = await processEmployeeAdvances(client, { employees, userId, date }, rollbackTracker);
    rollbackTracker.employeeAdvanceIds.push(...employeeAdvanceIds);

    const employeePaymentIds = await processEmployeeDebits(client, { employees, userId, date }, rollbackTracker);
    rollbackTracker.employeePaymentIds.push(...employeePaymentIds);

    const expenseIds = await processExpenses(client, { expenses, userId, date }, rollbackTracker);
    rollbackTracker.expenseIds.push(...expenseIds);

    await client.query(`UPDATE cashier_closings SET status='locked' WHERE id=(SELECT id FROM cashier_closings ORDER BY created_on DESC LIMIT 1)`);

    const { rows: closingRows } = await client.query(
      `INSERT INTO cashier_closings (user_id, bank_amount, status, date, items, customer_debit_ids, customer_credit_ids,
       customer_advance_ids, employee_debit_ids, employee_credit_ids, expenses_ids, stock_dip_ids)
       VALUES ($1,$2,'open',$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [userId, bankAmount, date,
        JSON.stringify(processedProducts),
        JSON.stringify(customerPaymentIds),
        JSON.stringify(customerCreditIds),
        JSON.stringify(customerAdvanceIds),
        JSON.stringify(employeePaymentIds),
        JSON.stringify(employeeAdvanceIds),
        JSON.stringify(expenseIds),
        JSON.stringify(savedDipIds)]
    );
    const savedClosing = closingRows[0];
    rollbackTracker.closingId = savedClosing.id;

    await client.query(
      "INSERT INTO cashes (user_id, closing_id, cash, description, status, date) VALUES ($1,$2,$3,'','pending',$4)",
      [userId, savedClosing.id, cashInHand, date]
    );
    rollbackTracker.cashId = savedClosing.id;

    await client.query("COMMIT");
    return res.status(201).json({ msg: "Shift Closed Successfully", success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cashier closing error:", error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  } finally {
    client.release();
  }
};

// ======================== DELETE CASHIER CLOSING ========================

const deleteCashierClosing = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    const closingResult = await client.query("SELECT * FROM cashier_closings WHERE id = $1", [id]);
    if (closingResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Closing entry not found", success: false }] });

    const closing = closingResult.rows[0];

    await client.query("BEGIN");

    const items = typeof closing.items === "string" ? JSON.parse(closing.items) : (closing.items || []);
    await reverseRealProducts(client, items, closing.date);

    const dipIds = typeof closing.stock_dip_ids === "string" ? JSON.parse(closing.stock_dip_ids) : (closing.stock_dip_ids || []);
    if (dipIds.length > 0) await client.query("DELETE FROM dips WHERE id = ANY($1)", [dipIds]);

    const creditIds = typeof closing.customer_credit_ids === "string" ? JSON.parse(closing.customer_credit_ids) : (closing.customer_credit_ids || []);
    await reverseCustomerCredits(client, creditIds);

    const advanceIds = typeof closing.customer_advance_ids === "string" ? JSON.parse(closing.customer_advance_ids) : (closing.customer_advance_ids || []);
    await reverseCustomerAdvances(client, advanceIds);

    const debitIds = typeof closing.customer_debit_ids === "string" ? JSON.parse(closing.customer_debit_ids) : (closing.customer_debit_ids || []);
    await reverseCustomerDebits(client, debitIds);

    const empAdvIds = typeof closing.employee_credit_ids === "string" ? JSON.parse(closing.employee_credit_ids) : (closing.employee_credit_ids || []);
    await reverseEmployeeAdvances(client, empAdvIds);

    const empPayIds = typeof closing.employee_debit_ids === "string" ? JSON.parse(closing.employee_debit_ids) : (closing.employee_debit_ids || []);
    await reverseEmployeeDebits(client, empPayIds);

    const expIds = typeof closing.expenses_ids === "string" ? JSON.parse(closing.expenses_ids) : (closing.expenses_ids || []);
    if (expIds.length > 0) await client.query("DELETE FROM expenses WHERE id = ANY($1)", [expIds]);

    await reverseCashEntry(client, closing.id);

    const previousClosing = await client.query(
      "SELECT id FROM cashier_closings WHERE created_on < $1 ORDER BY created_on DESC LIMIT 1",
      [closing.created_on]
    );
    if (previousClosing.rows.length > 0) {
      await client.query("UPDATE cashier_closings SET status='open' WHERE id=$1", [previousClosing.rows[0].id]);
    }

    await client.query("DELETE FROM cashier_closings WHERE id = $1", [id]);
    await client.query("COMMIT");

    return res.status(200).json({ msg: "Closing entry deleted and reversed successfully", success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete closing error:", error.message);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  } finally {
    client.release();
  }
};

// ======================== GENERATE CLOSING REPORT ========================

const genClosingReport = async (req, res) => {
  try {
    const { id } = req.params;
    const closingResult = await pool.query("SELECT * FROM cashier_closings WHERE id = $1", [id]);
    if (closingResult.rows.length === 0) return res.status(400).json({ errors: [{ msg: "Please reload to refresh records!", success: false }] });

    const getClosing = closingResult.rows[0];
    const userResult = await pool.query("SELECT name, shift FROM users WHERE id = $1", [getClosing.user_id]);
    const getUser = userResult.rows[0] || {};

    const items = typeof getClosing.items === "string" ? JSON.parse(getClosing.items) : (getClosing.items || []);

    let allreadings = [];
    let mobileOilProducts = [];

    for (const item of items) {
      const readingIds = item.readings || [];
      if (readingIds.length > 0) {
        for (const readingId of readingIds) {
          const { rows } = await pool.query(
            `SELECT r.*, p.name AS product_name, p.type AS product_type, m.name AS machine_name, pr.new_selling_price
             FROM readings r
             JOIN products p ON p.id = r.product_id
             JOIN machines m ON m.id = r.machine_id
             LEFT JOIN prices pr ON pr.id = r.price_id
             WHERE r.id = $1`, [readingId]
          );
          if (rows.length > 0) allreadings.push({ ...rows[0], testEntry: item.test_entry || 0 });
        }
      } else {
        const { rows } = await pool.query(
          `SELECT p.name AS product_name, p.id AS product_id, pr.new_selling_price
           FROM products p
           LEFT JOIN LATERAL (SELECT new_selling_price FROM prices WHERE product_id = p.id ORDER BY created_on DESC LIMIT 1) pr ON true
           WHERE p.id = $1`, [item.product_id]
        );
        if (rows.length > 0) mobileOilProducts.push({ ...rows[0], items: item, testEntry: item.test_entry || 0 });
      }
    }

    const expIds = typeof getClosing.expenses_ids === "string" ? JSON.parse(getClosing.expenses_ids) : (getClosing.expenses_ids || []);
    const getExpenses = expIds.length > 0 ? (await pool.query("SELECT * FROM expenses WHERE id = ANY($1)", [expIds])).rows : [];

    const creditIds = typeof getClosing.customer_credit_ids === "string" ? JSON.parse(getClosing.customer_credit_ids) : (getClosing.customer_credit_ids || []);
    const sales = creditIds.length > 0 ? (await pool.query(
      `SELECT s.id, s.date, c.name AS customer_name, SUM(si.amount) AS total_amount
       FROM sales s
       JOIN customers c ON c.id = s.customer_id
       JOIN sale_items si ON si.sale_id = s.id
       WHERE s.id = ANY($1)
       GROUP BY s.id, c.name, s.date`, [creditIds]
    )).rows : [];

    const debitIds = typeof getClosing.customer_debit_ids === "string" ? JSON.parse(getClosing.customer_debit_ids) : (getClosing.customer_debit_ids || []);
    const getDebitCustomers = debitIds.length > 0 ? (await pool.query(
      `SELECT cp.*, c.name AS customer_name FROM customer_payments cp JOIN customers c ON c.id = cp.customer_id WHERE cp.id = ANY($1)`,
      [debitIds]
    )).rows : [];

    const empCreditIds = typeof getClosing.employee_credit_ids === "string" ? JSON.parse(getClosing.employee_credit_ids) : (getClosing.employee_credit_ids || []);
    const getEmployeeAdvance = empCreditIds.length > 0 ? (await pool.query(
      `SELECT ea.amount, ea.description, e.name AS employee_name FROM employee_advances ea JOIN employees e ON e.id = ea.employee_id WHERE ea.id = ANY($1)`,
      [empCreditIds]
    )).rows : [];

    const empDebitIds = typeof getClosing.employee_debit_ids === "string" ? JSON.parse(getClosing.employee_debit_ids) : (getClosing.employee_debit_ids || []);
    const getEmployeeAdvanceReturn = empDebitIds.length > 0 ? (await pool.query(
      `SELECT ep.amount, e.name AS employee_name FROM employee_payments ep JOIN employees e ON e.id = ep.employee_id WHERE ep.id = ANY($1)`,
      [empDebitIds]
    )).rows : [];

    const custAdvIds = typeof getClosing.customer_advance_ids === "string" ? JSON.parse(getClosing.customer_advance_ids) : (getClosing.customer_advance_ids || []);
    const getCustomerAdvance = custAdvIds.length > 0 ? (await pool.query(
      `SELECT ca.amount, ca.description, c.name AS customer_name FROM customer_advances ca JOIN customers c ON c.id = ca.customer_id WHERE ca.id = ANY($1)`,
      [custAdvIds]
    )).rows : [];

    const dipsRecord = (await pool.query(
      `SELECT d.*, p.name AS product_name FROM dips d JOIN products p ON p.id = d.product_id WHERE d.user_id = $1 AND d.date = $2`,
      [getClosing.user_id, getClosing.date]
    )).rows;

    const processedDipRecord = await getStockReport(dipsRecord);

    const dynamicData = {
      title: "Sales Report",
      cashier: getUser.name,
      shift: getUser.shift || "Day",
      date: getClosing.date,
      closing: getClosing,
      products: allreadings,
      mobileProducts: mobileOilProducts,
      expenses: getExpenses,
      stocks: [],
      dips: processedDipRecord,
      sales,
      posMachine: getClosing.bank_amount,
      employeeDebit: getEmployeeAdvanceReturn,
      employeeCredit: getEmployeeAdvance,
      petrolDipChart,
      dieselDipChart,
      customerAdvance: getCustomerAdvance,
      payments: getDebitCustomers,
    };

    const html = await ejs.renderFile(path.resolve(__dirname, "..", "views", "closingreport.ejs"), dynamicData);
    const filePath = path.join(__dirname, "..", "public", "pdfs", "daily_report.pdf");

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: filePath, format: "Legal", printBackground: true });
    await browser.close();

    return res.status(200).json({ success: true, url: `/public/pdfs/daily_report.pdf` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

// ======================== SUPPORTING FUNCTIONS ========================

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

async function getStockReport(dipsRecord) {
  const report = [];
  for (const entry of dipsRecord) {
    const { product_name, prev_dip, dip, gain } = entry;
    const dipChart = (product_name?.toLowerCase() === "petrol" && petrolDipChart) || (product_name?.toLowerCase() === "diesel" && dieselDipChart);
    if (!dipChart) continue;

    const lastStock = calculateLitres(prev_dip, dipChart);
    const currentStock = calculateLitres(dip, dipChart);

    const productResult = await pool.query("SELECT id FROM products WHERE type = $1 LIMIT 1", [product_name?.toLowerCase()]);
    const productId = productResult.rows[0]?.id;

    let sellingPrice = 0;
    if (productId) {
      const priceResult = await pool.query("SELECT new_selling_price FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [productId]);
      sellingPrice = priceResult.rows[0]?.new_selling_price || 0;
    }

    report.push({
      productName: product_name,
      lastDip: prev_dip,
      lastStock: lastStock.toFixed(2),
      currentDip: dip,
      currentStock: currentStock.toFixed(2),
      dipDifference: (dip - prev_dip).toFixed(2),
      stockDifference: (currentStock - lastStock).toFixed(2),
      sellingPrice,
      gain,
      totalAmount: (gain * sellingPrice).toFixed(2),
    });
  }
  return report;
}

async function processRealProducts(client, products, date, rollbackTracker) {
  const result = [];
  rollbackTracker.readings = [];

  for (const entry of products) {
    const testEntries = {
      petrol: round(entry.petrolTestEntry || 0),
      diesel: round(entry.dieselTestEntry || 0),
    };

    for (const type of ["petrol", "diesel"]) {
      const items = entry?.[type] || [];
      for (let i = 0; i < items.length; i++) {
        const { machineId, newReading } = items[i];
        const isLastMachine = i === items.length - 1;

        const machineResult = await client.query("SELECT * FROM machines WHERE id = $1", [machineId]);
        if (machineResult.rows.length === 0) continue;

        const productResult = await client.query("SELECT * FROM products WHERE type = $1 LIMIT 1", [type]);
        if (productResult.rows.length === 0) continue;
        const product = productResult.rows[0];

        const priceResult = await client.query("SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [product.id]);
        const price = priceResult.rows[0];

        const lastReadingResult = await client.query("SELECT * FROM readings WHERE machine_id = $1 ORDER BY created_on DESC LIMIT 1", [machineId]);
        const lastReading = lastReadingResult.rows[0];

        const prevReading = round(lastReading?.new_reading || 0);
        const currentReading = round(newReading);
        const totalSale = round(currentReading - prevReading);
        const testEntry = isLastMachine ? testEntries[type] : 0;
        const actualSale = round(totalSale - testEntry);

        const { rows: readingRows } = await client.query(
          "INSERT INTO readings (product_id, machine_id, price_id, new_reading, prev_reading, test_entry, date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
          [product.id, machineId, price?.id || null, currentReading, prevReading, testEntry || 0, date]
        );
        rollbackTracker.readings.push(readingRows[0].id);

        await client.query("UPDATE machines SET lock_status='locked' WHERE id=$1", [machineId]);

        const stockResult = await client.query("SELECT * FROM stocks WHERE product_id = $1", [product.id]);
        const lastStock = stockResult.rows[0];
        const prevStock = lastStock ? round(lastStock.stock) : actualSale;
        const newStock = round(prevStock - actualSale);

        if (lastStock) {
          await client.query("UPDATE stocks SET stock=$1 WHERE product_id=$2", [newStock, product.id]);
        } else {
          await client.query("INSERT INTO stocks (product_id, stock) VALUES ($1,$2)", [product.id, newStock]);
        }

        const existing = result.find((r) => r.product_id == product.id);
        if (existing) {
          existing.readings.push(readingRows[0].id);
          existing.new_stock = newStock;
        } else {
          result.push({
            product_id: product.id,
            price_id: price?.id || null,
            prev_stock: prevStock,
            new_stock: newStock,
            test_entry: product.type === "petrol" ? testEntries.petrol : testEntries.diesel,
            readings: [readingRows[0].id],
          });
        }
      }
    }

    const lubricants = entry?.lubricant || [];
    for (const { productId, quantity } of lubricants) {
      const qty = round(quantity);
      const priceResult = await client.query("SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [productId]);
      const stockResult = await client.query("SELECT * FROM stocks WHERE product_id = $1", [productId]);
      const lastStock = stockResult.rows[0];
      const prevStock = lastStock ? round(lastStock.stock) : qty;
      const newStock = round(prevStock - qty);

      if (lastStock) await client.query("UPDATE stocks SET stock=$1 WHERE product_id=$2", [newStock, productId]);

      const existing = result.find((r) => r.product_id == productId);
      if (!existing) {
        result.push({ product_id: productId, price_id: priceResult.rows[0]?.id || null, quantity: qty, prev_stock: prevStock, new_stock: newStock, readings: [] });
      }
    }
  }

  return result;
}

async function processCustomerCredits(client, { customer, userId, date }, rollbackTracker) {
  const savedSaleIds = [];
  const lastSale = await client.query("SELECT receipt_no FROM sales ORDER BY receipt_no DESC LIMIT 1");
  let nextReceiptNo = lastSale.rows[0]?.receipt_no ? lastSale.rows[0].receipt_no + 1 : 1;

  for (const entry of customer) {
    for (const credit of (entry.credits || [])) {
      const saleItems = [];
      let totalAmount = 0;

      for (const { productId, amount, description } of (credit.products || [])) {
        const numericAmount = round(parseFloat(amount));
        if (!productId || isNaN(numericAmount) || numericAmount <= 0) continue;
        const priceResult = await client.query("SELECT id FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [productId]);
        if (!priceResult.rows[0]) continue;
        totalAmount += numericAmount;
        saleItems.push({ productId, priceId: priceResult.rows[0].id, amount: numericAmount, description });
      }

      if (saleItems.length === 0) continue;

      await client.query("UPDATE customers SET balance = balance + $1 WHERE id = $2", [totalAmount, credit.customerId]);

      const { rows: saleRows } = await client.query(
        "INSERT INTO sales (user_id, customer_id, receipt_no, status, date) VALUES ($1,$2,$3,'locked',$4) RETURNING id",
        [userId, credit.customerId, nextReceiptNo++, date]
      );
      const saleId = saleRows[0].id;

      for (const item of saleItems) {
        await client.query(
          "INSERT INTO sale_items (sale_id, product_id, price_id, amount, description) VALUES ($1,$2,$3,$4,$5)",
          [saleId, item.productId, item.priceId, item.amount, item.description || ""]
        );
      }

      savedSaleIds.push(saleId);
    }
  }
  return savedSaleIds;
}

async function processCustomerAdvances(client, { customer, userId, date }, rollbackTracker) {
  const savedIds = [];
  for (const entry of customer) {
    for (const advance of (entry.advances || [])) {
      const { customerId, amount, description } = advance;
      const numericAmount = round(parseFloat(amount));
      if (!customerId || isNaN(numericAmount) || numericAmount <= 0) continue;

      const custResult = await client.query("SELECT id FROM customers WHERE id = $1", [customerId]);
      if (custResult.rows.length === 0) continue;

      await client.query("UPDATE customers SET balance = balance + $1 WHERE id = $2", [numericAmount, customerId]);
      const { rows } = await client.query(
        "INSERT INTO customer_advances (user_id, customer_id, description, amount, date, status) VALUES ($1,$2,$3,$4,$5,'locked') RETURNING id",
        [userId, customerId, description || "", numericAmount, date]
      );
      savedIds.push(rows[0].id);
    }
  }
  return savedIds;
}

async function processCustomerDebits(client, { customer, userId, date }, rollbackTracker) {
  const savedIds = [];
  for (const entry of customer) {
    const debitMap = new Map();
    for (const { customerId, amount } of (entry.debits || [])) {
      const num = round(parseFloat(amount));
      if (!customerId || isNaN(num) || num <= 0) continue;
      debitMap.set(customerId, round((debitMap.get(customerId) || 0) + num));
    }
    for (const [customerId, totalAmount] of debitMap.entries()) {
      const custResult = await client.query("SELECT balance FROM customers WHERE id = $1", [customerId]);
      if (custResult.rows.length === 0) continue;
      const prevBalance = round(custResult.rows[0].balance);
      const remBalance = round(prevBalance - totalAmount);
      await client.query("UPDATE customers SET balance = $1 WHERE id = $2", [remBalance, customerId]);
      const { rows } = await client.query(
        "INSERT INTO customer_payments (user_id, customer_id, prev_amount, paying_amount, rem_amount, date, status) VALUES ($1,$2,$3,$4,$5,$6,'locked') RETURNING id",
        [userId, customerId, prevBalance, totalAmount, remBalance, date]
      );
      savedIds.push(rows[0].id);
    }
  }
  return savedIds;
}

async function processEmployeeAdvances(client, { employees, userId, date }, rollbackTracker) {
  const savedIds = [];
  for (const entry of employees) {
    for (const credit of (entry.credits || [])) {
      const { employeeId, amount, description } = credit;
      const num = round(parseFloat(amount));
      if (!employeeId || isNaN(num) || num <= 0) continue;
      const empResult = await client.query("SELECT id FROM employees WHERE id = $1", [employeeId]);
      if (empResult.rows.length === 0) continue;
      await client.query("UPDATE employees SET advance = advance + $1 WHERE id = $2", [num, employeeId]);
      const { rows } = await client.query(
        "INSERT INTO employee_advances (user_id, employee_id, amount, remaining_advance, description, date, status) VALUES ($1,$2,$3,$3,$4,$5,'locked') RETURNING id",
        [userId, employeeId, num, description || "", date]
      );
      savedIds.push(rows[0].id);
    }
  }
  return savedIds;
}

async function processEmployeeDebits(client, { employees, userId, date }, rollbackTracker) {
  const savedIds = [];
  for (const entry of employees) {
    const debitMap = new Map();
    for (const { employeeId, amount } of (entry.debits || [])) {
      const num = round(parseFloat(amount));
      if (!employeeId || isNaN(num) || num <= 0) continue;
      debitMap.set(employeeId, round((debitMap.get(employeeId) || 0) + num));
    }
    for (const [employeeId, totalAmount] of debitMap.entries()) {
      const empResult = await client.query("SELECT advance FROM employees WHERE id = $1", [employeeId]);
      if (empResult.rows.length === 0) continue;
      const prevAdvance = round(empResult.rows[0].advance);
      const remAdvance = round(prevAdvance - totalAmount);
      await client.query("UPDATE employees SET advance = $1 WHERE id = $2", [remAdvance, employeeId]);
      const { rows } = await client.query(
        "INSERT INTO employee_payments (user_id, employee_id, amount, date, prev_advance, rem_advance, status) VALUES ($1,$2,$3,$4,$5,$6,'locked') RETURNING id",
        [userId, employeeId, totalAmount, date, prevAdvance, remAdvance]
      );
      savedIds.push(rows[0].id);
    }
  }
  return savedIds;
}

async function storeDipEntries(client, { dips, userId, date, processedProducts }, rollbackTracker) {
  if (!Array.isArray(dips) || dips.length === 0) return [];
  const dipEntry = dips[0];
  const savedDipIds = [];

  for (const productType of ["petrol", "diesel"]) {
    const currentDip = dipEntry[productType];
    if (!currentDip || isNaN(currentDip.dip)) continue;

    const productResult = await client.query("SELECT id FROM products WHERE type = $1 LIMIT 1", [productType]);
    if (productResult.rows.length === 0) continue;
    const productId = productResult.rows[0].id;

    const lastDipResult = await client.query("SELECT dip FROM dips WHERE product_id = $1 ORDER BY date DESC LIMIT 1", [productId]);
    const prevDip = lastDipResult.rows[0] ? lastDipResult.rows[0].dip : currentDip.dip;

    const chart = productType === "petrol" ? petrolDipChart : dieselDipChart;
    const readingDiff = getStockDifferenceByProduct(processedProducts, productId);
    const prevDipStock = calculateLitres(prevDip, chart);
    const currentDipStock = calculateLitres(currentDip.dip, chart);
    const dipDiff = parseFloat(prevDipStock) - parseFloat(currentDipStock);
    const gain = parseFloat((readingDiff - dipDiff).toFixed(2));

    const { rows } = await client.query(
      "INSERT INTO dips (user_id, product_id, prev_dip, dip, gain, date, status) VALUES ($1,$2,$3,$4,$5,$6,'locked') RETURNING id",
      [userId, productId, prevDip, currentDip.dip, gain, date]
    );
    savedDipIds.push(rows[0].id);
  }
  return savedDipIds;
}

async function processExpenses(client, { expenses, userId, date }, rollbackTracker) {
  const savedIds = [];
  for (const expense of (expenses || [])) {
    const { name, amount, description } = expense;
    const num = round(parseFloat(amount));
    if (!name || isNaN(num) || num <= 0) continue;
    const { rows } = await client.query(
      "INSERT INTO expenses (user_id, name, amount, description, date, status) VALUES ($1,$2,$3,$4,$5,'locked') RETURNING id",
      [userId, name, num, description || "", date]
    );
    savedIds.push(rows[0].id);
  }
  return savedIds;
}

async function reverseRealProducts(client, products, date) {
  for (const item of products) {
    const { product_id, readings = [], prev_stock, new_stock } = item;
    const diffStock = round(prev_stock - new_stock);

    if (readings.length > 0) {
      await client.query("DELETE FROM readings WHERE id = ANY($1)", [readings]);
    }

    await client.query("UPDATE stocks SET stock = stock + $1 WHERE product_id = $2", [diffStock, product_id]);
    await client.query("UPDATE machines SET lock_status='unlocked' WHERE id IN (SELECT machine_id FROM readings WHERE product_id=$1)", [product_id]);
  }
}

async function reverseCustomerCredits(client, creditSaleIds) {
  for (const saleId of creditSaleIds) {
    const saleResult = await client.query("SELECT * FROM sales WHERE id = $1", [saleId]);
    if (saleResult.rows.length === 0) continue;
    const sale = saleResult.rows[0];

    const totalResult = await client.query("SELECT COALESCE(SUM(amount),0) AS total FROM sale_items WHERE sale_id = $1", [saleId]);
    const refundTotal = round(totalResult.rows[0].total);

    await client.query("UPDATE customers SET balance = balance - $1 WHERE id = $2", [refundTotal, sale.customer_id]);
    await client.query("DELETE FROM sale_items WHERE sale_id = $1", [saleId]);
    await client.query("DELETE FROM sales WHERE id = $1", [saleId]);
  }
}

async function reverseCustomerAdvances(client, advanceIds) {
  for (const advId of advanceIds) {
    const result = await client.query("SELECT * FROM customer_advances WHERE id = $1", [advId]);
    if (result.rows.length === 0) continue;
    const adv = result.rows[0];
    await client.query("UPDATE customers SET balance = balance - $1 WHERE id = $2", [adv.amount, adv.customer_id]);
    await client.query("DELETE FROM customer_advances WHERE id = $1", [advId]);
  }
}

async function reverseCustomerDebits(client, paymentIds) {
  for (const payId of paymentIds) {
    const result = await client.query("SELECT * FROM customer_payments WHERE id = $1", [payId]);
    if (result.rows.length === 0) continue;
    const pay = result.rows[0];
    await client.query("UPDATE customers SET balance = balance + $1 WHERE id = $2", [pay.paying_amount, pay.customer_id]);
    await client.query("DELETE FROM customer_payments WHERE id = $1", [payId]);
  }
}

async function reverseEmployeeAdvances(client, advanceIds) {
  for (const advId of advanceIds) {
    const result = await client.query("SELECT * FROM employee_advances WHERE id = $1", [advId]);
    if (result.rows.length === 0) continue;
    const adv = result.rows[0];
    await client.query("UPDATE employees SET advance = advance - $1 WHERE id = $2", [adv.amount, adv.employee_id]);
    await client.query("DELETE FROM employee_advances WHERE id = $1", [advId]);
  }
}

async function reverseEmployeeDebits(client, installmentIds) {
  for (const instId of installmentIds) {
    const result = await client.query("SELECT * FROM employee_payments WHERE id = $1", [instId]);
    if (result.rows.length === 0) continue;
    const inst = result.rows[0];
    await client.query("UPDATE employees SET advance = advance + $1 WHERE id = $2", [inst.amount, inst.employee_id]);
    await client.query("DELETE FROM employee_payments WHERE id = $1", [instId]);
  }
}

async function reverseCashEntry(client, closingId) {
  const cashResult = await client.query("SELECT * FROM cashes WHERE closing_id = $1", [closingId]);
  if (cashResult.rows.length === 0) return;
  const cashEntry = cashResult.rows[0];

  const bankEntry = await client.query("SELECT * FROM bank WHERE date = $1", [cashEntry.date]);
  if (bankEntry.rows.length > 0) {
    const bank = bankEntry.rows[0];
    if (bank.total_cash > cashEntry.cash) {
      await client.query("UPDATE bank SET total_cash = total_cash - $1, status='pending' WHERE id=$2", [cashEntry.cash, bank.id]);
    } else {
      await client.query("DELETE FROM bank WHERE id = $1", [bank.id]);
    }
  }
  await client.query("DELETE FROM cashes WHERE closing_id = $1", [closingId]);
}

function getStockDifferenceByProduct(processedProducts, productId) {
  const item = processedProducts.find((r) => r.product_id == productId);
  if (!item) return 0;
  return round(item.prev_stock - item.new_stock);
}

module.exports = {
  addCashierClosing,
  getSaleClosings,
  getLastClosing,
  getTodaysClosing,
  genClosingReport,
  deleteCashierClosing,
};
