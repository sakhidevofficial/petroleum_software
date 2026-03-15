const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const round = (v) => Math.round((parseFloat(v) + Number.EPSILON) * 100) / 100;

const getEmployeeAdvances = async (req, res) => {
  try {
    const { field, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `
      SELECT ea.*, e.name AS employee_name, e.pic AS employee_pic,
             COALESCE(SUM(ai.amount),0) AS tot_advance_returned
      FROM employee_advances ea
      JOIN employees e ON e.id = ea.employee_id
      LEFT JOIN advance_installments ai ON ai.advance_id = ea.id`;
      const groupBy = `GROUP BY ea.id, e.name, e.pic, e.id`;

    let rows, countResult;

    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE e.name ILIKE $1 ${groupBy} ORDER BY ea.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_advances ea JOIN employees e ON e.id = ea.employee_id WHERE e.name ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(ea.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ${groupBy} ORDER BY ea.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_advances WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ${groupBy} ORDER BY ea.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM employee_advances");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getAllActiveAdvances = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ea.*, e.name AS employee_name FROM employee_advances ea JOIN employees e ON e.id = ea.employee_id WHERE ea.status != 'paid'`
    );
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const addEmployeeAdvance = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, employeeId, description, amount, date } = req.body;
    if (!userId || !employeeId || !description || !amount || !date)
      return res.status(400).json({ errors: [{ msg: "Missing required fields." }], success: false });

    const empResult = await client.query("SELECT * FROM employees WHERE id = $1", [employeeId]);
    if (empResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Employee not found." }], success: false });

    await client.query("BEGIN");
    await client.query(`UPDATE employee_advances SET status='locked' WHERE status='open' AND id=(SELECT id FROM employee_advances WHERE status='open' ORDER BY created_on DESC LIMIT 1)`);
    const { rows } = await client.query(
      `INSERT INTO employee_advances (user_id, employee_id, description, amount, remaining_advance, date, status)
       VALUES ($1,$2,$3,$4,$4,$5,'open') RETURNING *`,
      [userId, employeeId, description, amount, date]
    );
    await client.query("UPDATE employees SET advance = advance + $1 WHERE id = $2", [amount, employeeId]);
    await client.query("COMMIT");

    const withEmployee = await pool.query(
      `SELECT ea.*, e.name AS employee_name FROM employee_advances ea JOIN employees e ON e.id = ea.employee_id WHERE ea.id = $1`, [rows[0].id]
    );
    const totalRecord = await pool.query("SELECT COUNT(*) FROM employee_advances");

    return res.status(201).json({ msg: "Employee advance added successfully.", advance: withEmployee.rows[0], totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

const getSingleEmployeeAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT ea.id, ea.amount, ea.employee_id, ea.date, ea.description, ea.status, ea.created_on, e.name AS employee_name, e.pic
       FROM employee_advances ea LEFT JOIN employees e ON e.id = ea.employee_id WHERE ea.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteEmployeeAdvance = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const existing = await client.query("SELECT * FROM employee_advances WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found." }], success: false });
    const advance = existing.rows[0];
    if (advance.status === "locked") return res.status(403).json({ errors: [{ msg: "Advance is locked and cannot be deleted." }], success: false });

    await client.query("BEGIN");
    await client.query("DELETE FROM employee_advances WHERE id = $1", [id]);
    if (advance.status === "open") await client.query("UPDATE employees SET advance = advance - $1 WHERE id = $2", [advance.amount, advance.employee_id]);
    await client.query(`UPDATE employee_advances SET status='open' WHERE id=(SELECT id FROM employee_advances ORDER BY created_on DESC LIMIT 1)`);
    await client.query("COMMIT");

    return res.status(200).json({ msg: "Employee advance deleted successfully.", id, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

const addAdvanceInstallment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { advanceId, amount, date } = req.body;
    const advResult = await client.query("SELECT * FROM employee_advances WHERE id = $1", [advanceId]);
    if (advResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Advance not found" }] });

    const advance = advResult.rows[0];
    if (advance.remaining_advance <= 0) return res.status(403).json({ errors: [{ msg: "No advance to pay!", success: "false" }] });

    const remainingBalance = advance.remaining_advance - amount;
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO advance_installments (advance_id, amount, date, method, remaining_balance) VALUES ($1,$2,$3,'direct',$4)`,
      [advanceId, amount, date, remainingBalance]
    );

    let newStatus = "pending";
    if (remainingBalance <= 0) newStatus = "paid";
    else if (amount > 0 && remainingBalance > 0) newStatus = "partial";

    await client.query("UPDATE employee_advances SET remaining_advance=$1, status=$2 WHERE id=$3", [remainingBalance, newStatus, advanceId]);
    await client.query("COMMIT");

    const withEmployee = await pool.query(
      `SELECT ea.*, e.name AS employee_name, COALESCE(SUM(ai.amount),0) AS tot_advance_returned
       FROM employee_advances ea JOIN employees e ON e.id = ea.employee_id
       LEFT JOIN advance_installments ai ON ai.advance_id = ea.id
       WHERE ea.id = $1 GROUP BY ea.id, e.name`, [advanceId]
    );

    return res.status(201).json({ msg: "Installment Added Successfully", advance: withEmployee.rows[0], success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const updateAdvanceInstallment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { amount, date } = req.body;

    const instResult = await client.query("SELECT * FROM advance_installments WHERE id = $1", [id]);
    if (instResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Installment not found" }] });
    const installment = instResult.rows[0];

    if (installment.amount !== amount) {
      const diffCal = amount - installment.amount;
      await client.query("BEGIN");
      await client.query("UPDATE advance_installments SET amount=$1, remaining_balance=$2, date=$3 WHERE id=$4", [amount, installment.remaining_balance - diffCal, date, id]);
      await client.query("UPDATE employee_advances SET remaining_advance=remaining_advance - $1 WHERE id=$2", [diffCal, installment.advance_id]);
      await client.query("COMMIT");
    }

    return res.status(201).json({ msg: "Installment Updated Successfully", success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  } finally {
    client.release();
  }
};

const getSingleInstallment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM advance_installments WHERE id = $1", [id]);
    return res.status(200).json({ data: rows[0], success: true });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteAdvanceInstallment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const instResult = await client.query("SELECT * FROM advance_installments WHERE id = $1", [id]);
    if (instResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found" }] });
    const installment = instResult.rows[0];

    await client.query("BEGIN");
    await client.query("DELETE FROM advance_installments WHERE id = $1", [id]);
    const newRemaining = installment.remaining_balance + installment.amount;
    let newStatus = newRemaining <= 0 ? "paid" : (newRemaining < installment.remaining_balance + installment.amount ? "partial" : "pending");
    await client.query("UPDATE employee_advances SET remaining_advance=$1, status=$2 WHERE id=$3", [newRemaining, newStatus, installment.advance_id]);
    await client.query("COMMIT");

    return res.status(200).json({ msg: "Installment deleted successfully", success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

module.exports = {
  addEmployeeAdvance, getEmployeeAdvances, getAllActiveAdvances, getSingleEmployeeAdvance, deleteEmployeeAdvance,
  addAdvanceInstallment, getSingleInstallment, updateAdvanceInstallment, deleteAdvanceInstallment,
};
