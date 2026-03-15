const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getPrices = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    const baseSelect = `SELECT pr.*, p.name AS product_name, p.type AS product_type, p.pic AS product_pic FROM prices pr JOIN products p ON p.id = pr.product_id`;

    let rows, countResult;

    if (field === "product" && searchInput) {
      ({ rows } = await pool.query(
        `${baseSelect} WHERE p.name ILIKE $1 ORDER BY pr.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM prices pr JOIN products p ON p.id = pr.product_id WHERE p.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `${baseSelect} WHERE TO_DATE(pr.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date
         ORDER BY pr.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM prices WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`,
        [start, end]
      );
    } else {
      ({ rows } = await pool.query(`${baseSelect} ORDER BY pr.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM prices");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addPrice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { productId, costPrice, sellingPrice, date } = req.body;

    const lastPriceResult = await pool.query(
      "SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [productId]
    );
    const lastPrice = lastPriceResult.rows[0];

    const stockResult = await pool.query("SELECT * FROM stocks WHERE product_id = $1", [productId]);
    const stock = stockResult.rows[0]?.stock || 0;

    const priceDifference = lastPrice ? costPrice - lastPrice.cost_price : 0;
    const differenceValue = stock * priceDifference;

    if (lastPrice) {
      await pool.query("UPDATE prices SET status = 'locked' WHERE id = $1", [lastPrice.id]);
    }

    const { rows } = await pool.query(
      `INSERT INTO prices (product_id, remaining_stock, cost_price, old_selling_price, new_selling_price, price_difference, difference_value, date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [productId, stock, costPrice, lastPrice?.new_selling_price || 0, sellingPrice, priceDifference, differenceValue, date]
    );

    const withProduct = await pool.query(
      `SELECT pr.*, p.name AS product_name, p.type AS product_type, p.pic AS product_pic
       FROM prices pr JOIN products p ON p.id = pr.product_id WHERE pr.id = $1`,
      [rows[0].id]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM prices");
    return res.status(201).json({
      msg: "Price updated successfully",
      price: withProduct.rows,
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSinglePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT pr.*, p.name AS product_name, p.type AS product_type, p.pic AS product_pic
       FROM prices pr JOIN products p ON p.id = pr.product_id WHERE pr.id = $1`,
      [id]
    );
    return res.status(201).json({ msg: "Price found", price: rows, success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

const currentPrices = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (product_id) product_id, id, cost_price, new_selling_price, date, created_on
      FROM prices ORDER BY product_id, created_on DESC
    `);
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: true }] });
  }
};

const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM prices WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Price not found", success: false }] });

    if (existing.rows[0].status === "locked")
      return res.status(200).json({ errors: [{ msg: "Price is locked", success: false }] });

    await pool.query("DELETE FROM prices WHERE id = $1", [id]);

    await pool.query(
      `UPDATE prices SET status = 'open'
       WHERE id = (SELECT id FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [existing.rows[0].product_id]
    );

    return res.status(200).json({ msg: "Price deleted successfully", id, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { getPrices, getSinglePrice, addPrice, currentPrices, deletePrice };
