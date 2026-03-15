const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getEmployeeSalaries = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT es.*, e.name AS employee_name, e.pic AS employee_pic FROM employee_salaries es JOIN employees e ON e.id = es.employee_id`;

    let rows, countResult;

    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE e.name ILIKE $1 ORDER BY es.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_salaries es JOIN employees e ON e.id = es.employee_id WHERE e.name ILIKE $1`, [`%${searchInput}%`]);
    } else if ((field === "salary_of_month" || field === "salary_of_year") && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE es.${field} ILIKE $1 ORDER BY es.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_salaries WHERE ${field} ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(es.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY es.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM employee_salaries WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY es.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM employee_salaries");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addEmployeeSalary = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { userId, employeeId, salaryOfMonth, salaryOfYear, date, status } = req.body;
    const employeeResult = await pool.query("SELECT * FROM employees WHERE id = $1", [employeeId]);
    if (employeeResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Employee not found" }] });

    const netSalary = employeeResult.rows[0].salary;
    const { rows } = await pool.query(
      `INSERT INTO employee_salaries (user_id, employee_id, net_salary, salary_of_month, salary_of_year, status, date)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [userId, employeeId, netSalary, salaryOfMonth, salaryOfYear, status, date]
    );

    const withEmployee = await pool.query(
      `SELECT es.*, e.name AS employee_name FROM employee_salaries es JOIN employees e ON e.id = es.employee_id WHERE es.id = $1`, [rows[0].id]
    );
    const totalRecord = await pool.query("SELECT COUNT(*) FROM employee_salaries");

    return res.status(201).json({ msg: "Salary Added Successfully", totalRecord: parseInt(totalRecord.rows[0].count), salary: withEmployee.rows[0], success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const deleteEmployeeSalary = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM employee_salaries WHERE id = $1", [id]);
    const totalRecord = await pool.query("SELECT COUNT(*) FROM employee_salaries");
    return res.status(200).json({ msg: "Employee Salary deleted successfully", id, totalRecords: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    console.error("deleteEmployeeSalary error:", error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  }
};

module.exports = { addEmployeeSalary, getEmployeeSalaries, deleteEmployeeSalary };
