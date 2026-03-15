const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getExpenses = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    let rows, countResult;

    if ((field === "name" || field === "description") && searchInput) {
      ({ rows } = await pool.query(
        `SELECT * FROM expenses WHERE ${field} ILIKE $1 ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(`SELECT COUNT(*) FROM expenses WHERE ${field} ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `SELECT * FROM expenses
         WHERE TO_DATE(date, 'DD-MM-YYYY') BETWEEN $1::date AND $2::date
         ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM expenses WHERE TO_DATE(date, 'DD-MM-YYYY') BETWEEN $1::date AND $2::date`,
        [start, end]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT * FROM expenses ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM expenses");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { userId, name, description, amount, date } = req.body;

    await pool.query(
      `UPDATE expenses SET status = 'locked' WHERE id = (SELECT id FROM expenses ORDER BY created_on DESC LIMIT 1)`
    );

    const { rows } = await pool.query(
      `INSERT INTO expenses (user_id, name, description, amount, date) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [userId, name, description || null, amount, date]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM expenses");
    return res.status(201).json({
      msg: "Expense added successfully",
      expense: rows[0],
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, description, amount, date } = req.body;

    const { rows } = await pool.query(
      `UPDATE expenses SET name=$1, description=$2, amount=$3, date=$4 WHERE id=$5 RETURNING *`,
      [name, description || null, amount, date, id]
    );

    return res.status(201).json({ msg: "Expense updated successfully", updated: rows[0], success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM expenses WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query("SELECT * FROM expenses WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Expense not found", success: false }] });

    if (existing.rows[0].status === "locked")
      return res.status(200).json({ errors: [{ msg: "Expense is locked", success: false }] });

    await pool.query("DELETE FROM expenses WHERE id = $1", [id]);

    await pool.query(
      `UPDATE expenses SET status = 'open' WHERE id = (SELECT id FROM expenses ORDER BY created_on DESC LIMIT 1)`
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM expenses");
    return res.status(200).json({
      msg: "Expense deleted successfully",
      id,
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { getExpenses, getSingleExpense, addExpense, updateExpense, deleteExpense };
