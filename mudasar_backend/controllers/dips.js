const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getDips = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    let rows, countResult;

    if (field === "product" && searchInput) {
      ({ rows } = await pool.query(
        `SELECT d.*, p.name AS product_name, p.type AS product_type
         FROM dips d JOIN products p ON p.id = d.product_id
         WHERE p.name ILIKE $1
         ORDER BY d.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM dips d JOIN products p ON p.id = d.product_id WHERE p.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `SELECT d.*, p.name AS product_name, p.type AS product_type
         FROM dips d JOIN products p ON p.id = d.product_id
         WHERE TO_DATE(d.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date
         ORDER BY d.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM dips WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`,
        [start, end]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT d.*, p.name AS product_name, p.type AS product_type
         FROM dips d JOIN products p ON p.id = d.product_id
         ORDER BY d.created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM dips");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addDip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { userId, productId, dip, date } = req.body;

    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (productResult.rows.length === 0)
      return res.status(400).json({ errors: [{ msg: "Product not found", success: false }] });

    const product = productResult.rows[0];
    if (!["petrol", "diesel"].includes(product.type.toLowerCase()))
      return res.status(403).json({ errors: [{ msg: "Dips can be added for petrol or diesel", success: false }] });

    const lastDip = await pool.query(
      "SELECT * FROM dips WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1",
      [productId]
    );
    const prevDip = lastDip.rows.length > 0 ? lastDip.rows[0].dip : dip;

    if (lastDip.rows.length > 0) {
      await pool.query("UPDATE dips SET status = 'locked' WHERE id = $1", [lastDip.rows[0].id]);
    }

    const { rows } = await pool.query(
      `INSERT INTO dips (user_id, product_id, prev_dip, dip, date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, productId, prevDip, dip, date]
    );

    const withProduct = await pool.query(
      `SELECT d.*, p.name AS product_name, p.type AS product_type
       FROM dips d JOIN products p ON p.id = d.product_id WHERE d.id = $1`,
      [rows[0].id]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM dips");
    return res.status(201).json({
      msg: "Dip added successfully",
      dip: withProduct.rows[0],
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateDip = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { productId, dip, date } = req.body;

    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (productResult.rows.length === 0 || !["petrol", "diesel"].includes(productResult.rows[0].type.toLowerCase()))
      return res.status(403).json({ errors: [{ msg: "Dips can be added for petrol or diesel", success: false }] });

    const { rows } = await pool.query(
      `UPDATE dips SET product_id=$1, dip=$2, date=$3 WHERE id=$4 RETURNING *`,
      [productId, dip, date, id]
    );

    const withProduct = await pool.query(
      `SELECT d.*, p.name AS product_name, p.type AS product_type
       FROM dips d JOIN products p ON p.id = d.product_id WHERE d.id = $1`,
      [id]
    );

    return res.status(201).json({ msg: "Dip updated successfully", updated: withProduct.rows, success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleDip = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM dips WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteDip = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM dips WHERE id = $1", [id]);

    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Dip not found", success: false }] });

    const dipRow = existing.rows[0];
    if (dipRow.status === "locked")
      return res.status(200).json({ errors: [{ msg: "Dip is locked", success: false }] });

    await pool.query("DELETE FROM dips WHERE id = $1", [id]);

    await pool.query(
      `UPDATE dips SET status = 'open'
       WHERE id = (SELECT id FROM dips WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [dipRow.product_id]
    );

    return res.status(200).json({ msg: "Dip deleted successfully", id, success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addDip, updateDip, getSingleDip, getDips, deleteDip };
