const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const round = (num) => Math.round(num * 100) / 100;

const getSales = async (req, res) => {
  try {
    const { field, operator, searchInput, page, sort, startDate, endDate } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    const baseSelect = `
      SELECT s.id, s.receipt_no, s.date, s.status, s.created_on,
             c.name, c.pic,
             COALESCE(SUM(si.amount),0) AS total_amount,
             JSON_AGG(
               JSON_BUILD_OBJECT('product_name', p.name, 'selling_price', pr.new_selling_price,
                 'amount', si.amount, 'id', si.id,
                 'quantity', CASE WHEN pr.new_selling_price > 0 THEN si.amount / pr.new_selling_price ELSE 0 END)
             ) AS items
      FROM sales s
      JOIN customers c ON c.id = s.customer_id
      JOIN sale_items si ON si.sale_id = s.id
      JOIN products p ON p.id = si.product_id
      JOIN prices pr ON pr.id = si.price_id
    `;
    const groupBy = `GROUP BY s.id, c.name, c.pic`;

    let rows, countResult;

    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(
        `${baseSelect} WHERE c.name ILIKE $1 ${groupBy} ORDER BY s.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(DISTINCT s.id) FROM sales s JOIN customers c ON c.id = s.customer_id WHERE c.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "receiptNo" && searchInput) {
      ({ rows } = await pool.query(
        `${baseSelect} WHERE s.receipt_no = $1 ${groupBy} ORDER BY s.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [parseInt(searchInput), offset]
      ));
      countResult = await pool.query(`SELECT COUNT(*) FROM sales WHERE receipt_no = $1`, [parseInt(searchInput)]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `${baseSelect} WHERE TO_DATE(s.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ${groupBy} ORDER BY s.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM sales WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]
      );
    } else {
      ({ rows } = await pool.query(
        `${baseSelect} ${groupBy} ORDER BY s.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM sales");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.error("getSales error:", error.message || error);
    const msg = process.env.NODE_ENV === "production" ? "Internal Server Error" : (error.message || "Internal Server Error");
    return res.status(500).json({ errors: { msg }, success: false });
  }
};

const addSale = async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { cashierId, customerId, items, date } = req.body;

    const lastSaleResult = await pool.query("SELECT receipt_no FROM sales ORDER BY id DESC LIMIT 1");
    const newReceiptNo = lastSaleResult.rows.length > 0 ? (lastSaleResult.rows[0].receipt_no + 1) : 1;

    const quantityErrors = [];
    for (const item of items) {
      const stockResult = await pool.query("SELECT * FROM stocks WHERE product_id = $1", [item.productId]);
      const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [item.productId]);
      if (stockResult.rows[0]?.stock < item.quantity) {
        quantityErrors.push({ msg: `${productResult.rows[0]?.name} is out of desired stock`, success: false });
      }
    }
    if (quantityErrors.length > 0) return res.status(403).json({ errors: quantityErrors });

    await client.query("BEGIN");
    const saleResult = await client.query(
      `INSERT INTO sales (user_id, receipt_no, customer_id, date) VALUES ($1,$2,$3,$4) RETURNING *`,
      [cashierId, newReceiptNo, customerId, date]
    );
    const sale = saleResult.rows[0];

    for (const item of items) {
      const priceResult = await client.query(
        "SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [item.productId]
      );
      const price = priceResult.rows[0];
      const amount = round(item.quantity * price.new_selling_price);

      await client.query(
        `INSERT INTO sale_items (sale_id, product_id, price_id, amount) VALUES ($1,$2,$3,$4)`,
        [sale.id, item.productId, price.id, amount]
      );

      const productResult = await client.query("SELECT * FROM products WHERE id = $1", [item.productId]);
      if (!["petrol","diesel"].includes(productResult.rows[0]?.name.toLowerCase())) {
        await client.query("UPDATE stocks SET stock = stock - $1 WHERE product_id = $2", [item.quantity, item.productId]);
      }
    }
    await client.query("COMMIT");

    return res.status(201).json({ msg: "Sale added successfully", success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const updateSale = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { customerId, items, date } = req.body;

    await pool.query("UPDATE sales SET customer_id=$1, date=$2 WHERE id=$3", [customerId, date, id]);
    await pool.query("DELETE FROM sale_items WHERE sale_id = $1", [id]);

    for (const item of items) {
      const priceResult = await pool.query(
        "SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [item.productId]
      );
      const price = priceResult.rows[0];
      const amount = round(item.quantity * price.new_selling_price);
      await pool.query(
        `INSERT INTO sale_items (sale_id, product_id, price_id, amount) VALUES ($1,$2,$3,$4)`,
        [id, item.productId, price.id, amount]
      );
    }

    return res.status(201).json({ msg: "Sale updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

const getSingleSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT s.*, c.name AS customer_name, c.pic AS customer_pic,
              JSON_AGG(JSON_BUILD_OBJECT('product_name', p.name, 'amount', si.amount, 'price', pr.new_selling_price)) AS items
       FROM sales s
       JOIN customers c ON c.id = s.customer_id
       JOIN sale_items si ON si.sale_id = s.id
       JOIN products p ON p.id = si.product_id
       JOIN prices pr ON pr.id = si.price_id
       WHERE s.id = $1
       GROUP BY s.id, c.name, c.pic`,
      [id]
    );
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteSale = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const saleResult = await client.query("SELECT * FROM sales WHERE id = $1", [id]);
    if (saleResult.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Sale not found", success: false }] });

    const items = await client.query("SELECT * FROM sale_items WHERE sale_id = $1", [id]);
    await client.query("BEGIN");

    for (const item of items.rows) {
      const product = await client.query("SELECT * FROM products WHERE id = $1", [item.product_id]);
      if (!["petrol","diesel"].includes(product.rows[0]?.name.toLowerCase())) {
        const price = await client.query("SELECT * FROM prices WHERE id = $1", [item.price_id]);
        const qty = price.rows[0] ? round(item.amount / price.rows[0].new_selling_price) : 0;
        await client.query("UPDATE stocks SET stock = stock + $1 WHERE product_id = $2", [qty, item.product_id]);
      }
    }

    await client.query("DELETE FROM sale_items WHERE sale_id = $1", [id]);
    await client.query("DELETE FROM sales WHERE id = $1", [id]);
    await client.query("COMMIT");

    return res.status(200).json({ msg: "Sale deleted successfully", success: true, id });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

module.exports = { addSale, updateSale, getSales, getSingleSale, deleteSale };
