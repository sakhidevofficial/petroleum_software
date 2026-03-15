const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getReadings = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    let rows, countResult;

    if (["name", "type", "status"].includes(field) && searchInput) {
      ({ rows } = await pool.query(
        `SELECT r.*, m.name AS machine_name, m.type AS machine_type, m.status AS machine_status
         FROM readings r JOIN machines m ON m.id = r.machine_id
         WHERE m.${field} ILIKE $1
         ORDER BY r.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM readings r JOIN machines m ON m.id = r.machine_id WHERE m.${field} ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "date" && startDate && endDate) {
      ({ rows } = await pool.query(
        `SELECT r.*, m.name AS machine_name, m.type AS machine_type, m.status AS machine_status
         FROM readings r JOIN machines m ON m.id = r.machine_id
         WHERE r.date BETWEEN $1 AND $2
         ORDER BY r.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [startDate, endDate, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM readings WHERE date BETWEEN $1 AND $2`, [startDate, endDate]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT r.*, m.name AS machine_name, m.type AS machine_type, m.status AS machine_status
         FROM readings r JOIN machines m ON m.id = r.machine_id
         ORDER BY r.created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM readings");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const currentReadings = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (r.machine_id)
        r.machine_id, r.product_id, r.new_reading, r.prev_reading, r.date, r.created_on,
        m.name AS machine, p.name AS product,
        s.stock,
        pr.new_selling_price AS price
      FROM readings r
      JOIN machines m ON m.id = r.machine_id AND m.status = 'active'
      JOIN products p ON p.id = r.product_id
      JOIN prices pr ON pr.product_id = r.product_id
      LEFT JOIN stocks s ON s.product_id = r.product_id
      ORDER BY r.machine_id, r.created_on DESC, pr.created_on DESC
    `);
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: true }] });
  }
};

const addReading = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { machineId, reading, prevReading, date } = req.body;

    const machineResult = await pool.query("SELECT * FROM machines WHERE id = $1", [machineId]);
    if (machineResult.rows.length === 0)
      return res.status(400).json({ errors: [{ msg: "Machine not found", success: false }] });

    const machine = machineResult.rows[0];

    const productResult = await pool.query("SELECT * FROM products WHERE type = $1 LIMIT 1", [machine.type]);
    const product = productResult.rows[0];

    const priceResult = await pool.query(
      "SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [product?.id]
    );
    const price = priceResult.rows[0];

    const lastReading = await pool.query(
      "SELECT * FROM readings WHERE machine_id = $1 ORDER BY created_on DESC LIMIT 1", [machineId]
    );
    if (lastReading.rows.length > 0) {
      await pool.query("UPDATE readings SET status = 'locked' WHERE id = $1", [lastReading.rows[0].id]);
    }

    const { rows } = await pool.query(
      `INSERT INTO readings (machine_id, product_id, price_id, new_reading, prev_reading, date)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [machineId, product?.id || null, price?.id || null, reading, prevReading, date]
    );

    const withMachine = await pool.query(
      `SELECT r.*, m.name AS machine_name, m.type AS machine_type
       FROM readings r JOIN machines m ON m.id = r.machine_id WHERE r.id = $1`,
      [rows[0].id]
    );

    return res.status(201).json({ msg: "Reading added successfully", reading: withMachine.rows, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateReading = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { machineId, reading, date } = req.body;

    const existing = await pool.query("SELECT * FROM readings WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Reading not found", success: false }] });

    const { rows } = await pool.query(
      "UPDATE readings SET new_reading=$1, date=$2 WHERE id=$3 RETURNING *",
      [reading, date, id]
    );

    return res.status(201).json({ msg: "Reading updated successfully", success: true, updated: rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const deleteReading = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM readings WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Reading not found", success: false }] });

    await pool.query("DELETE FROM readings WHERE id = $1", [id]);

    const prevReading = await pool.query(
      "SELECT * FROM readings WHERE machine_id = $1 ORDER BY created_on DESC LIMIT 1",
      [existing.rows[0].machine_id]
    );
    if (prevReading.rows.length > 0) {
      await pool.query("UPDATE readings SET status = 'open' WHERE id = $1", [prevReading.rows[0].id]);
    }

    return res.status(200).json({ msg: "Reading deleted successfully", id, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addReading, updateReading, currentReadings, getReadings, deleteReading };
