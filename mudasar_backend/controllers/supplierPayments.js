const pool = require("../config/pool");

const getSupplierPayments = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT sp.*, s.name AS supplier_name, s.company_name, s.pic AS supplier_pic FROM supplier_payments sp JOIN suppliers s ON s.id = sp.supplier_id`;

    let rows, countResult;
    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE s.name ILIKE $1 ORDER BY sp.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM supplier_payments sp JOIN suppliers s ON s.id = sp.supplier_id WHERE s.name ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(sp.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY sp.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM supplier_payments WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY sp.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM supplier_payments");
    }
    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addSupplierPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const body = req.body || {};
    const userId = body.userId;
    let rawSupplierId = body.supplierId ?? body.supplierName ?? "";
    if (rawSupplierId != null && typeof rawSupplierId === "object" && (rawSupplierId.value != null || rawSupplierId.name != null)) {
      rawSupplierId = rawSupplierId.value ?? rawSupplierId.name ?? rawSupplierId.id ?? "";
    }
    rawSupplierId = rawSupplierId != null && rawSupplierId !== "" ? String(rawSupplierId).trim() : "";
    const rawAmount = body.amount;
    let date = body.date;

    // Normalize date (accept YYYY-MM-DD, DD-MM-YYYY, or Date object)
    if (date != null && typeof date === "object" && date.toISOString) {
      date = new Date(date).toISOString().slice(0, 10);
    }
    if (date != null) date = String(date).trim();
    if (!date || date === "") {
      return res.status(400).json({ errors: [{ msg: "Please select date" }], success: false });
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [y, m, d] = date.split("-");
      date = `${d}-${m}-${y}`;
    }

    const amount = Number(rawAmount);
    if (Number.isNaN(amount) || amount < 0.01) {
      return res.status(400).json({ errors: [{ msg: "Please enter a valid amount (greater than 0)" }], success: false });
    }

    let supplierId = rawSupplierId !== "" ? parseInt(rawSupplierId, 10) : NaN;
    let supplierResult;
    if (Number.isInteger(supplierId) && supplierId >= 1) {
      supplierResult = await client.query("SELECT * FROM suppliers WHERE id = $1", [supplierId]);
    } else {
      const supplierName = rawSupplierId || "";
      if (!supplierName) {
        return res.status(400).json({ errors: [{ msg: "Please select a supplier from the list" }], success: false });
      }
      try {
        supplierResult = await client.query(
          "SELECT * FROM suppliers WHERE (LOWER(TRIM(name)) = LOWER($1) OR LOWER(TRIM(COALESCE(company_name,''))) = LOWER($1) OR name ILIKE $2 OR COALESCE(company_name,'') ILIKE $2) LIMIT 1",
          [supplierName, `%${supplierName}%`]
        );
      } catch (queryErr) {
        console.error("Supplier name lookup error:", queryErr);
        return res.status(500).json({ errors: [{ msg: "Error looking up supplier" }], success: false });
      }
    }
    if (!supplierResult || supplierResult.rows.length === 0) {
      return res.status(400).json({
        errors: [{ msg: "Supplier not found. Please select a supplier from the dropdown." }],
        success: false,
      });
    }
    supplierId = supplierResult.rows[0].id;

    const supplier = supplierResult.rows[0];
    const prevAmount = supplier.balance;
    const remAmount = prevAmount - amount;

    await client.query("BEGIN");
    await client.query(`UPDATE supplier_payments SET status='locked' WHERE status='open' AND id=(SELECT id FROM supplier_payments WHERE status='open' ORDER BY created_on DESC LIMIT 1)`);
    const { rows } = await client.query(
      `INSERT INTO supplier_payments (user_id, supplier_id, amount, date, prev_amount, rem_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,'open') RETURNING *`,
      [userId, supplierId, amount, date, prevAmount, remAmount]
    );
    await client.query("UPDATE suppliers SET balance = balance - $1 WHERE id = $2", [amount, supplierId]);
    await client.query("COMMIT");

    const withSupplier = await pool.query(
      `SELECT sp.*, s.name AS supplier_name, s.company_name, s.pic FROM supplier_payments sp JOIN suppliers s ON s.id = sp.supplier_id WHERE sp.id = $1`,
      [rows[0].id]
    );
    const totalRecord = await pool.query("SELECT COUNT(*) FROM supplier_payments");

    return res.status(201).json({ msg: "Supplier Payment added successfully", supplierpayment: withSupplier.rows[0], totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const getSingleSupplierPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT sp.id, sp.supplier_id, sp.user_id, sp.prev_amount, sp.amount, sp.rem_amount, sp.date, sp.created_on, sp.status, s.company_name, s.pic, s.name
       FROM supplier_payments sp LEFT JOIN suppliers s ON s.id = sp.supplier_id WHERE sp.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const updateSupplierPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { supplierId, amount, date } = req.body;

    const existing = await client.query("SELECT * FROM supplier_payments WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found" }] });
    const payment = existing.rows[0];

    await client.query("BEGIN");
    if (payment.amount !== amount) {
      const diff = amount - payment.amount;
      await client.query("UPDATE suppliers SET balance = balance - $1 WHERE id = $2", [diff, supplierId]);
    }
    const { rows } = await client.query("UPDATE supplier_payments SET amount=$1, date=$2 WHERE id=$3 RETURNING *", [amount, date, id]);
    await client.query("COMMIT");

    const withSupplier = await pool.query(
      `SELECT sp.*, s.name AS supplier_name FROM supplier_payments sp JOIN suppliers s ON s.id = sp.supplier_id WHERE sp.id = $1`, [id]
    );
    return res.status(201).json({ msg: "Supplier payment updated successfully", updated: withSupplier.rows, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const deleteSupplierPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const existing = await client.query("SELECT * FROM supplier_payments WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Not found." }], success: false });
    const payment = existing.rows[0];
    if (payment.status === "locked") return res.status(403).json({ errors: [{ msg: "Payment is locked and cannot be deleted." }], success: false });

    await client.query("BEGIN");
    await client.query("DELETE FROM supplier_payments WHERE id = $1", [id]);
    if (payment.status === "open") await client.query("UPDATE suppliers SET balance = balance + $1 WHERE id = $2", [payment.amount, payment.supplier_id]);
    await client.query(`UPDATE supplier_payments SET status='open' WHERE id=(SELECT id FROM supplier_payments ORDER BY created_on DESC LIMIT 1)`);
    await client.query("COMMIT");

    const totalRecord = await pool.query("SELECT COUNT(*) FROM supplier_payments");
    return res.status(200).json({ msg: "Supplier payment deleted successfully.", id, totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }], success: false });
  } finally {
    client.release();
  }
};

module.exports = { addSupplierPayment, updateSupplierPayment, getSupplierPayments, getSingleSupplierPayment, deleteSupplierPayment };
