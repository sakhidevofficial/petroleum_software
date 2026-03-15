const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getWastages = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    let rows, countResult;

    if (field === "product" && searchInput) {
      ({ rows } = await pool.query(
        `SELECT w.*, p.name AS product_name, p.type AS product_type, p.pic AS product_pic
         FROM wastages w JOIN products p ON p.id = w.product_id
         WHERE p.name ILIKE $1
         ORDER BY w.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM wastages w JOIN products p ON p.id = w.product_id WHERE p.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `SELECT w.*, p.name AS product_name, p.type AS product_type, p.pic AS product_pic
         FROM wastages w JOIN products p ON p.id = w.product_id
         WHERE TO_DATE(w.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date
         ORDER BY w.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM wastages w WHERE TO_DATE(w.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`,
        [start, end]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT w.*, p.name AS product_name, p.type AS product_type, p.pic AS product_pic
         FROM wastages w JOIN products p ON p.id = w.product_id
         ORDER BY w.created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM wastages");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addWastage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { productId, quantity, date } = req.body;

    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (productResult.rows.length === 0)
      return res.status(400).json({ errors: [{ msg: "Product not found", success: false }] });

    const product = productResult.rows[0];
    if (!["petrol", "diesel"].includes(product.type.toLowerCase()))
      return res.status(400).json({ errors: [{ msg: "Wastage can only be added for petrol or diesel", success: false }] });

    await pool.query("UPDATE stocks SET stock = stock - $1 WHERE product_id = $2", [quantity, productId]);

    await pool.query(
      `UPDATE wastages SET status = 'locked'
       WHERE id = (SELECT id FROM wastages WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [productId]
    );

    const { rows } = await pool.query(
      `INSERT INTO wastages (product_id, quantity, date) VALUES ($1,$2,$3) RETURNING *`,
      [productId, quantity, date]
    );

    const withProduct = await pool.query(
      `SELECT w.*, p.name AS product_name, p.type AS product_type
       FROM wastages w JOIN products p ON p.id = w.product_id WHERE w.id = $1`,
      [rows[0].id]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM wastages");
    return res.status(201).json({
      msg: "Wastage added successfully",
      wastage: withProduct.rows[0],
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateWastage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { productId, quantity, date } = req.body;

    const existing = await pool.query("SELECT * FROM wastages WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Wastage not found", success: false }] });

    const diff = quantity - existing.rows[0].quantity;
    await pool.query("UPDATE stocks SET stock = stock - $1 WHERE product_id = $2", [diff, productId]);

    const { rows } = await pool.query(
      `UPDATE wastages SET product_id=$1, quantity=$2, date=$3 WHERE id=$4 RETURNING *`,
      [productId, quantity, date, id]
    );

    const withProduct = await pool.query(
      `SELECT w.*, p.name AS product_name, p.type AS product_type
       FROM wastages w JOIN products p ON p.id = w.product_id WHERE w.id = $1`,
      [id]
    );

    return res.status(201).json({ msg: "Wastage updated successfully", updated: withProduct.rows[0], success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

const getSingleWastage = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM wastages WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteWastage = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query("SELECT * FROM wastages WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Wastage not found", success: false }] });

    const wastage = existing.rows[0];
    if (wastage.status === "locked")
      return res.status(200).json({ errors: [{ msg: "Wastage is locked", success: false }] });

    await pool.query("UPDATE stocks SET stock = stock + $1 WHERE product_id = $2", [wastage.quantity, wastage.product_id]);
    await pool.query("DELETE FROM wastages WHERE id = $1", [id]);

    await pool.query(
      `UPDATE wastages SET status = 'open'
       WHERE id = (SELECT id FROM wastages WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [wastage.product_id]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM wastages");
    return res.status(200).json({
      msg: "Wastage deleted successfully",
      id,
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addWastage, getSingleWastage, updateWastage, getWastages, deleteWastage };
