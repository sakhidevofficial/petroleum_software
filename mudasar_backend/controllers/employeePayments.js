const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const round = (v) => Math.round((parseFloat(v) + Number.EPSILON) * 100) / 100;

const getEmployeePayments = async (req, res) => {
  try {
    const { field, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT ep.*, e.name AS employee_name, e.pic AS employee_pic FROM employee_payments ep JOIN employees e ON e.id = ep.employee_id`;

    let rows, countResult;
    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE e.name ILIKE $1 ORDER BY ep.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_payments ep JOIN employees e ON e.id = ep.employee_id WHERE e.name ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(ep.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY ep.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_payments WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY ep.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM employee_payments");
    }
    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addEmployeePayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { userId, employeeId, amount, date } = req.body;
    const empResult = await client.query("SELECT * FROM employees WHERE id = $1", [employeeId]);
    if (empResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Employee not found" }] });

    const employee = empResult.rows[0];
    const prevAdvance = round(employee.advance);
    const remAdvance = round(prevAdvance - amount);

    await client.query("BEGIN");
    await client.query(`UPDATE employee_payments SET status='locked' WHERE status='open' AND id=(SELECT id FROM employee_payments WHERE status='open' ORDER BY created_on DESC LIMIT 1)`);
    const { rows } = await client.query(
      `INSERT INTO employee_payments (user_id, employee_id, amount, date, prev_advance, rem_advance, status)
       VALUES ($1,$2,$3,$4,$5,$6,'open') RETURNING *`,
      [userId, employeeId, amount, date, prevAdvance, remAdvance]
    );
    await client.query("UPDATE employees SET advance = $1 WHERE id = $2", [remAdvance, employeeId]);
    await client.query("COMMIT");

    const withEmployee = await pool.query(`SELECT ep.*, e.name AS employee_name FROM employee_payments ep JOIN employees e ON e.id = ep.employee_id WHERE ep.id = $1`, [rows[0].id]);
    const totalRecord = await pool.query("SELECT COUNT(*) FROM employee_payments");

    return res.status(201).json({ msg: "Employee Payment added successfully", employeepayment: withEmployee.rows, totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

const getSingleEmployeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT ep.*, e.name AS employee_name FROM employee_payments ep LEFT JOIN employees e ON e.id = ep.employee_id WHERE ep.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const updateEmployeePayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { employeeId, amount, date } = req.body;

    const payResult = await client.query("SELECT * FROM employee_payments WHERE id = $1", [id]);
    if (payResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Payment not found" }] });
    const payment = payResult.rows[0];
    if (payment.status === "locked") return res.status(403).json({ errors: [{ msg: "Payment is locked!" }], success: false });

    await client.query("BEGIN");
    if (payment.amount !== amount) {
      const diff = round(amount - payment.amount);
      await client.query("UPDATE employees SET advance = advance - $1 WHERE id = $2", [diff, employeeId]);
      const empResult = await client.query("SELECT advance FROM employees WHERE id = $1", [employeeId]);
      await client.query("UPDATE employee_payments SET amount=$1, rem_advance=$2, date=$3 WHERE id=$4", [amount, empResult.rows[0].advance, date, id]);
    } else {
      await client.query("UPDATE employee_payments SET date=$1 WHERE id=$2", [date, id]);
    }
    await client.query("COMMIT");

    const result = await pool.query(`SELECT ep.*, e.name AS employee_name FROM employee_payments ep JOIN employees e ON e.id = ep.employee_id WHERE ep.id = $1`, [id]);
    return res.status(201).json({ msg: "Employee payment updated successfully", updated: result.rows, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

const deleteEmployeePayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const existing = await client.query("SELECT * FROM employee_payments WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found." }], success: false });
    const payment = existing.rows[0];
    if (payment.status === "locked") return res.status(403).json({ errors: [{ msg: "Payment is locked and cannot be deleted." }], success: false });

    await client.query("BEGIN");
    await client.query("DELETE FROM employee_payments WHERE id = $1", [id]);
    if (payment.status === "open") await client.query("UPDATE employees SET advance = advance + $1 WHERE id = $2", [payment.amount, payment.employee_id]);
    await client.query(`UPDATE employee_payments SET status='open' WHERE id=(SELECT id FROM employee_payments ORDER BY created_on DESC LIMIT 1)`);
    await client.query("COMMIT");

    const totalRecords = await pool.query("SELECT COUNT(*) FROM employee_payments");
    return res.status(200).json({ msg: "Employee payment deleted successfully.", id, totalRecords: parseInt(totalRecords.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

module.exports = { getEmployeePayments, addEmployeePayment, getSingleEmployeePayment, updateEmployeePayment, deleteEmployeePayment };
