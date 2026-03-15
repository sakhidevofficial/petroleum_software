const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const config = require("config");
const pool = require("../config/pool");

// ─── Helper ──────────────────────────────────────────────────────────────────

function generateDateRange(months) {
  const start = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + months);
  return { startDate: start, endDate: end };
}

// ─── CHECK EMAIL ──────────────────────────────────────────────────────────────

const CheckEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

  try {
    const { email, username } = req.body;
    const emailCheck = await pool.query("SELECT id FROM tenants WHERE email = $1", [email]);
    const userCheck = await pool.query("SELECT id FROM tenants WHERE username = $1", [username]);

    if (emailCheck.rows.length > 0) return res.status(403).json({ error: [{ msg: "Email is already registered", success: false }] });
    if (userCheck.rows.length > 0) return res.status(403).json({ error: [{ msg: "Username is already registered", success: false }] });
    return res.status(200).json({ msg: "Everything is Ok", success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: [{ msg: error.message, success: false }] });
  }
};

// ─── REGISTER TENANT ─────────────────────────────────────────────────────────

const RegisterTenant = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });

  try {
    return await addTenantMain(req, res);
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

async function addTenantMain(req, res) {
  const client = await pool.connect();
  try {
    const { ownerName, username, email, tenantName, packageId, password, contact, address, logo, date, status } = req.body;

    const emailExist = await client.query("SELECT id FROM tenants WHERE email = $1", [email]);
    if (emailExist.rows.length > 0) return res.status(409).json({ errors: [{ msg: "Email already Exists!", success: false }] });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (logo) {
      fs.rename(`./public/temp/${logo}`, `./public/tenants/images/${logo}`, (err) => { if (err) console.error(err); });
    }

    await client.query("BEGIN");

    const { rows: tenantRows } = await client.query(
      "INSERT INTO tenants (owner_name, username, email, tenant_name, contact, address, logo, date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [ownerName, username, email, tenantName, contact, address, logo || "", date, status]
    );
    const savedTenant = tenantRows[0];

    const pkgResult = await client.query("SELECT * FROM packages WHERE id = $1", [packageId]);
    const pkg = pkgResult.rows[0];
    const { startDate, endDate } = generateDateRange(pkg?.expires_in_months || 12);

    await client.query(
      "INSERT INTO tenant_subscriptions (package_id, starts_at, ends_at, tenant_id) VALUES ($1,$2,$3,$4)",
      [packageId, startDate, endDate, savedTenant.id]
    );

    if (logo) {
      fs.copyFile(`./public/tenants/images/${logo}`, `./public/users/images/${logo}`, (err) => { if (err) console.error(err); });
    }

    await client.query(
      "INSERT INTO users (name, username, email, access, password, contact, address, pic, status) VALUES ($1,$2,$3,'tenant_admin',$4,$5,$6,$7,$8)",
      [ownerName, username, email, hashedPassword, contact, address, logo || null, status]
    );

    await client.query("COMMIT");
    return res.status(201).json({ tenantId: savedTenant.id, msg: "Tenant registered successfully", success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  } finally {
    client.release();
  }
}

// ─── GET TENANTS ──────────────────────────────────────────────────────────────

const getTenants = async (req, res) => {
  try {
    const { field, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    let rows, countResult;

    if (field === "date" && startDate && endDate) {
      ({ rows } = await pool.query(
        "SELECT id, owner_name, username, email, tenant_name, contact, address, logo, status, date FROM tenants WHERE date BETWEEN $1 AND $2 ORDER BY created_on " + orderDir + " LIMIT 5 OFFSET $3",
        [startDate, endDate, offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM tenants WHERE date BETWEEN $1 AND $2", [startDate, endDate]);
    } else if (field && searchInput) {
      const allowedFields = ["owner_name", "username", "email", "tenant_name", "contact", "address"];
      const col = allowedFields.includes(field) ? field : "owner_name";
      ({ rows } = await pool.query(
        `SELECT id, owner_name, username, email, tenant_name, contact, address, logo, status, date FROM tenants WHERE ${col} ILIKE $1 ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(`SELECT COUNT(*) FROM tenants WHERE ${col} ILIKE $1`, [`%${searchInput}%`]);
    } else {
      ({ rows } = await pool.query(
        "SELECT id, owner_name, username, email, tenant_name, contact, address, logo, status, date FROM tenants ORDER BY created_on " + orderDir + " LIMIT 5 OFFSET $1",
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM tenants");
    }

    return res.status(200).json({ results: { data: rows, totalRecords: parseInt(countResult.rows[0].count) }, success: true });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

// ─── GET SINGLE TENANT ────────────────────────────────────────────────────────

const getSingleTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT id, owner_name, username, email, tenant_name, contact, address, logo, status, date FROM tenants WHERE id = $1", [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: [{ msg: "Tenant not found", success: false }] });

    const sub = await pool.query(
      "SELECT id, package_id FROM tenant_subscriptions WHERE tenant_id = $1 ORDER BY created_on DESC LIMIT 1", [id]
    );

    const result = { ...rows[0], packageId: sub.rows[0]?.package_id, subscriptionId: sub.rows[0]?.id };
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

// ─── UPDATE TENANT ────────────────────────────────────────────────────────────

const updateTenant = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { ownerName, username, email, tenantName, contact, address, packageId, status, date, logo, password, subscriptionId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const tenantResult = await client.query("SELECT * FROM tenants WHERE id = $1", [id]);
    if (tenantResult.rows.length === 0) return res.status(404).json({ error: [{ msg: "Tenant not found" }] });
    const fetchTenant = tenantResult.rows[0];

    const subResult = await client.query("SELECT * FROM tenant_subscriptions WHERE id = $1", [subscriptionId]);
    const lastSubscription = subResult.rows[0];

    await client.query("BEGIN");

    if (packageId != lastSubscription?.package_id) {
      const pkgResult = await client.query("SELECT expires_in_months FROM packages WHERE id = $1", [packageId]);
      const { startDate, endDate } = generateDateRange(pkgResult.rows[0]?.expires_in_months || 12);
      await client.query(
        "UPDATE tenant_subscriptions SET package_id=$1, starts_at=$2, ends_at=$3 WHERE id=$4",
        [packageId, startDate, endDate, subscriptionId]
      );
    }

    if (logo && fetchTenant.logo !== logo) {
      if (fetchTenant.logo) fs.unlink(`./public/tenants/images/${fetchTenant.logo}`, () => {});
      fs.rename(`./public/temp/${logo}`, `./public/tenants/images/${logo}`, () => {});
    }

    await client.query(
      "UPDATE tenants SET owner_name=$1, username=$2, email=$3, tenant_name=$4, contact=$5, address=$6, logo=$7, status=$8, date=$9 WHERE id=$10",
      [ownerName, username, email, tenantName, contact, address, logo || fetchTenant.logo, status, date, id]
    );

    await client.query(
      "UPDATE users SET name=$1, username=$2, email=$3, password=$4, contact=$5, address=$6, pic=$7, status=$8 WHERE email=$9 AND access='tenant_admin'",
      [ownerName, username, email, hashedPassword, contact, address, logo || null, status, fetchTenant.email]
    );

    await client.query("COMMIT");
    const updated = await pool.query("SELECT id, owner_name, username, email, tenant_name, contact, address, logo, status, date FROM tenants WHERE id=$1", [id]);
    return res.status(201).json({ success: true, msg: "Tenant Updated Successfully", data: updated.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  } finally {
    client.release();
  }
};

// ─── DELETE TENANT ────────────────────────────────────────────────────────────

const deleteTenant = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");
    await client.query("DELETE FROM tenant_subscriptions WHERE tenant_id = $1", [id]);
    await client.query("DELETE FROM users WHERE access='tenant_admin' AND id IN (SELECT id FROM users WHERE pic IN (SELECT logo FROM tenants WHERE id=$1))", [id]);
    await client.query("DELETE FROM tenants WHERE id = $1", [id]);
    await client.query("COMMIT");

    const countTenants = await pool.query("SELECT COUNT(*) FROM tenants");
    return res.status(200).json({ msg: "Tenant Deleted Successfully", id, totalRecords: parseInt(countTenants.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: [{ success: false, msg: "Internal Server Error" }] });
  } finally {
    client.release();
  }
};

// ─── GET PACKAGES (for tenant management) ────────────────────────────────────

const getPackages = async (req, res) => {
  try {
    const { status } = req.query;
    const { rows } = status
      ? await pool.query("SELECT * FROM packages WHERE status = $1", [status])
      : await pool.query("SELECT * FROM packages");
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

module.exports = { RegisterTenant, CheckEmail, getTenants, deleteTenant, getSingleTenant, updateTenant, getPackages };
