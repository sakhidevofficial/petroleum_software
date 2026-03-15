const { validationResult } = require("express-validator");
const pool = require("../config/pool");
const fs = require("fs");

const getEmployees = async (req, res) => {
  try {
    const { field, operator, searchInput, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const searchableFields = ["name", "email", "contact", "designation", "advance", "address", "status"];

    let rows, countResult;
    if (searchableFields.includes(field) && searchInput) {
      ({ rows } = await pool.query(
        `SELECT e.*, COALESCE(SUM(ea.amount),0) AS remaining_advance
         FROM employees e
         LEFT JOIN employee_advances ea ON ea.employee_id = e.id
         WHERE e.${field}::text ILIKE $1
         GROUP BY e.id
         ORDER BY e.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM employees WHERE ${field}::text ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT e.*, COALESCE(SUM(ea.amount),0) AS remaining_advance
         FROM employees e
         LEFT JOIN employee_advances ea ON ea.employee_id = e.id
         GROUP BY e.id
         ORDER BY e.created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM employees");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT e.*, COALESCE(SUM(ea.amount),0) AS remaining_advance
       FROM employees e
       LEFT JOIN employee_advances ea ON ea.employee_id = e.id
       WHERE e.status = 'active'
       GROUP BY e.id`
    );
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const addEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { name, email, contact, designation, address, salary, advance, status, pic } = req.body;

    if (pic) {
      fs.copyFile(`./public/temp/${pic}`, `./public/employees/images/${pic}`, (err) => {
        if (err) console.error(`Error moving file: ${err}`);
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO employees (name, email, contact, address, designation, status, salary, advance, pic)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, email || null, contact || null, address, designation, status, salary, advance, pic || null]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM employees");
    return res.status(201).json({
      msg: "Employee added successfully",
      employee: rows[0],
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, email, contact, address, designation, salary, advance, status, pic } = req.body;

    const existing = await pool.query("SELECT * FROM employees WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Employee not found", success: false }] });

    const employee = existing.rows[0];

    if (pic && employee.pic !== pic) {
      if (employee.pic) fs.unlink(`./public/employees/images/${employee.pic}`, () => {});
      fs.copyFile(`./public/temp/${pic}`, `./public/employees/images/${pic}`, (err) => {
        if (err) console.error(err);
      });
    }

    const { rows } = await pool.query(
      `UPDATE employees SET name=$1, email=$2, contact=$3, designation=$4, address=$5, salary=$6, advance=$7, status=$8, pic=$9
       WHERE id=$10 RETURNING *`,
      [name, email || null, contact || null, designation, address, salary, advance, status, pic || employee.pic, id]
    );

    return res.status(201).json({ msg: "Employee updated successfully", employee: rows[0], success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM employees WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM employees WHERE id = $1", [id]);
    const countResult = await pool.query("SELECT COUNT(*) FROM employees");
    return res.status(200).json({
      msg: "Employee deleted successfully",
      id,
      totalRecords: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addEmployee, updateEmployee, getEmployees, getAllEmployees, getSingleEmployee, deleteEmployee };
