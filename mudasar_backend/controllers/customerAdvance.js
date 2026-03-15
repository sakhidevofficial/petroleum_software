const pool = require("../config/pool");

const round = (v) => Math.round((parseFloat(v) + Number.EPSILON) * 100) / 100;

const getCustomerAdvances = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT ca.id, ca.user_id, ca.customer_id, ca.description, ca.amount, ca.date, ca.status, ca.created_on, c.name, c.pic FROM customer_advances ca JOIN customers c ON c.id = ca.customer_id`;

    let rows, countResult;
    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE c.name ILIKE $1 ORDER BY ca.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM customer_advances ca JOIN customers c ON c.id = ca.customer_id WHERE c.name ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(ca.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY ca.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM customer_advances WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY ca.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM customer_advances");
    }
    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleCustomerAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT ca.id, ca.amount, ca.customer_id, ca.date, ca.description, ca.status, ca.created_on, c.name AS customer_name, c.pic
       FROM customer_advances ca LEFT JOIN customers c ON c.id = ca.customer_id WHERE ca.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const addCustomerAdvance = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, customerId, description, amount, date } = req.body;
    if (!userId || !customerId || !description || !amount || !date)
      return res.status(400).json({ errors: [{ msg: "Missing required fields." }], success: false });

    await client.query("BEGIN");
    await client.query(`UPDATE customer_advances SET status='locked' WHERE status='open' AND id=(SELECT id FROM customer_advances WHERE status='open' ORDER BY created_on DESC LIMIT 1)`);
    const { rows } = await client.query(
      `INSERT INTO customer_advances (user_id, customer_id, description, amount, date, status) VALUES ($1,$2,$3,$4,$5,'open') RETURNING *`,
      [userId, customerId, description, amount, date]
    );
    await client.query("UPDATE customers SET balance = balance + $1 WHERE id = $2", [amount, customerId]);
    await client.query("COMMIT");

    const withCustomer = await pool.query(
      `SELECT ca.*, c.name FROM customer_advances ca JOIN customers c ON c.id = ca.customer_id WHERE ca.id = $1`, [rows[0].id]
    );
    const totalRecord = await pool.query("SELECT COUNT(*) FROM customer_advances");

    return res.status(201).json({ msg: "Customer advance added successfully.", advance: withCustomer.rows[0], totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

const updateCustomerAdvance = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { description, amount, date } = req.body;

    const existing = await client.query("SELECT * FROM customer_advances WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found." }], success: false });
    const advance = existing.rows[0];
    if (advance.status === "locked") return res.status(403).json({ errors: [{ msg: "Advance is locked!" }], success: false });

    const diff = amount - advance.amount;
    await client.query("BEGIN");
    if (diff !== 0) await client.query("UPDATE customers SET balance = balance + $1 WHERE id = $2", [diff, advance.customer_id]);
    const { rows } = await client.query("UPDATE customer_advances SET description=$1, amount=$2, date=$3 WHERE id=$4 RETURNING *", [description, amount, date, id]);
    await client.query("COMMIT");

    const enriched = await pool.query(
      `SELECT ca.*, c.name FROM customer_advances ca JOIN customers c ON c.id = ca.customer_id WHERE ca.id = $1`, [id]
    );
    return res.status(200).json({ msg: "Customer advance updated successfully.", updated: enriched.rows[0], success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

const deleteCustomerAdvance = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const existing = await client.query("SELECT * FROM customer_advances WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found." }], success: false });
    const advance = existing.rows[0];
    if (advance.status === "locked") return res.status(403).json({ errors: [{ msg: "Advance is locked and cannot be deleted." }], success: false });

    await client.query("BEGIN");
    await client.query("DELETE FROM customer_advances WHERE id = $1", [id]);
    if (advance.status === "open") await client.query("UPDATE customers SET balance = balance - $1 WHERE id = $2", [advance.amount, advance.customer_id]);
    await client.query(`UPDATE customer_advances SET status='open' WHERE id=(SELECT id FROM customer_advances ORDER BY created_on DESC LIMIT 1)`);
    await client.query("COMMIT");

    return res.status(200).json({ msg: "Customer advance deleted successfully.", id, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

module.exports = { getCustomerAdvances, getSingleCustomerAdvance, addCustomerAdvance, updateCustomerAdvance, deleteCustomerAdvance };
