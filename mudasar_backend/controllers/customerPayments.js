const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const round = (v) => Math.round((parseFloat(v) + Number.EPSILON) * 100) / 100;

const getCustomerPayments = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT cp.*, c.name AS customer_name, c.pic AS customer_pic FROM customer_payments cp JOIN customers c ON c.id = cp.customer_id`;

    let rows, countResult;
    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE c.name ILIKE $1 ORDER BY cp.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM customer_payments cp JOIN customers c ON c.id = cp.customer_id WHERE c.name ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(cp.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY cp.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM customer_payments WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY cp.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM customer_payments");
    }
    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addCustomerPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { userId, customerId, payingAmount, date } = req.body;

    const customerResult = await client.query("SELECT * FROM customers WHERE id = $1", [customerId]);
    if (customerResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Customer not found" }] });

    const customer = customerResult.rows[0];
    const prevAmount = round(customer.balance || 0);
    const remAmount = round(prevAmount - payingAmount);

    await client.query("BEGIN");
    await client.query(`UPDATE customer_payments SET status = 'locked' WHERE status = 'open' AND id = (SELECT id FROM customer_payments WHERE status='open' ORDER BY created_on DESC LIMIT 1)`);

    const { rows } = await client.query(
      `INSERT INTO customer_payments (user_id, customer_id, paying_amount, date, prev_amount, rem_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,'open') RETURNING *`,
      [userId, customerId, payingAmount, date, prevAmount, remAmount]
    );
    await client.query("UPDATE customers SET balance = $1 WHERE id = $2", [remAmount, customerId]);
    await client.query("COMMIT");

    const withCustomer = await pool.query(
      `SELECT cp.*, c.name AS customer_name, c.pic AS customer_pic FROM customer_payments cp JOIN customers c ON c.id = cp.customer_id WHERE cp.id = $1`,
      [rows[0].id]
    );
    const totalRecord = await pool.query("SELECT COUNT(*) FROM customer_payments");

    return res.status(201).json({ msg: "Customer Payment added successfully", customerpayment: withCustomer.rows, totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const getSingleCustomerPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT cp.*, c.name AS customer_name FROM customer_payments cp JOIN customers c ON c.id = cp.customer_id WHERE cp.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const updateCustomerPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { customerId, payingAmount, date } = req.body;

    const paymentResult = await client.query("SELECT * FROM customer_payments WHERE id = $1", [id]);
    if (paymentResult.rows.length === 0) return res.status(404).json({ errors: { msg: "Payment not found" } });
    const payment = paymentResult.rows[0];
    if (payment.status === "locked") return res.status(403).json({ errors: [{ msg: "Payment is locked!" }], success: false });

    const customerResult = await client.query("SELECT * FROM customers WHERE id = $1", [customerId]);
    const customer = customerResult.rows[0];
    const diff = round(payingAmount - payment.paying_amount);

    await client.query("BEGIN");
    await client.query("UPDATE customers SET balance = balance - $1 WHERE id = $2", [diff, customerId]);
    await client.query("UPDATE customer_payments SET paying_amount=$1, rem_amount=$2, date=$3 WHERE id=$4", [payingAmount, round(customer.balance - diff), date, id]);
    await client.query("COMMIT");

    const result = await pool.query(
      `SELECT cp.*, c.name AS customer_name FROM customer_payments cp JOIN customers c ON c.id = cp.customer_id WHERE cp.id = $1`, [id]
    );
    return res.status(201).json({ msg: "Customer payment updated successfully", updated: result.rows, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const deleteCustomerPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const paymentResult = await client.query("SELECT * FROM customer_payments WHERE id = $1", [id]);
    if (paymentResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Customer payment not found." }], success: false });
    const payment = paymentResult.rows[0];
    if (payment.status === "locked") return res.status(403).json({ errors: [{ msg: "Payment is locked and cannot be deleted." }], success: false });

    await client.query("BEGIN");
    await client.query("DELETE FROM customer_payments WHERE id = $1", [id]);
    if (payment.status === "open") {
      await client.query("UPDATE customers SET balance = balance + $1 WHERE id = $2", [payment.paying_amount, payment.customer_id]);
    }
    await client.query(`UPDATE customer_payments SET status='open' WHERE id=(SELECT id FROM customer_payments ORDER BY created_on DESC LIMIT 1)`);
    await client.query("COMMIT");

    const totalRecords = await pool.query("SELECT COUNT(*) FROM customer_payments");
    return res.status(200).json({ msg: "Customer payment deleted successfully.", id, totalRecords: parseInt(totalRecords.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

module.exports = { addCustomerPayment, updateCustomerPayment, getCustomerPayments, getSingleCustomerPayment, deleteCustomerPayment };
