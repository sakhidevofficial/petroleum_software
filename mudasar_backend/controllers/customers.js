const { validationResult } = require("express-validator");
const pool = require("../config/pool");
const fs = require("fs");

function getFormattedDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const getCustomers = async (req, res) => {
  try {
    const { field, operator, searchInput, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const searchableFields = ["name", "email", "contact", "balance", "address", "status"];

    let rows, countResult;
    if (searchableFields.includes(field) && searchInput) {
      ({ rows } = await pool.query(
        `SELECT * FROM customers WHERE ${field}::text ILIKE $1 ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM customers WHERE ${field}::text ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT * FROM customers ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM customers");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getAllActiveCustomers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM customers WHERE status = 'active'");
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { userId, name, email, contact, address, balance, status, pic } = req.body;

    if (pic) {
      fs.copyFile(`./public/temp/${pic}`, `./public/customers/images/${pic}`, (err) => {
        if (err) console.error(`Error moving file: ${err}`);
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO customers (user_id, name, email, contact, address, balance, status, pic)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [userId, name, email || null, contact, address, balance || 0, status, pic || null]
    );
    const savedCustomer = rows[0];

    const date = getFormattedDate();
    await pool.query(
      `INSERT INTO customer_payments (user_id, customer_id, paying_amount, date, prev_amount, rem_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,'open')`,
      [userId, savedCustomer.id, 0, date, 0, balance || 0]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM customers");
    return res.status(201).json({
      msg: "New Customer added successfully",
      customer: savedCustomer,
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, email, contact, address, balance, status, pic } = req.body;

    const existing = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Customer not found", success: false }] });

    const customer = existing.rows[0];
    const date = getFormattedDate();

    if (pic && customer.pic !== pic) {
      if (customer.pic) fs.unlink(`./public/customers/images/${customer.pic}`, () => {});
      fs.copyFile(`./public/temp/${pic}`, `./public/customers/images/${pic}`, (err) => {
        if (err) console.error(err);
      });
    }

    if (parseFloat(balance) !== parseFloat(customer.balance)) {
      await pool.query(
        `INSERT INTO customer_payments (user_id, customer_id, paying_amount, date, prev_amount, rem_amount, status)
         VALUES ($1,$2,$3,$4,$5,$6,'open')`,
        [customer.user_id, id, 0, date, 0, balance]
      );
    }

    const { rows } = await pool.query(
      `UPDATE customers SET name=$1, email=$2, contact=$3, address=$4, balance=$5, status=$6, pic=$7
       WHERE id=$8 RETURNING *`,
      [name, email || null, contact, address, balance, status, pic || customer.pic, id]
    );

    return res.status(201).json({ msg: "Customer updated successfully", updated: rows[0], success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM customers WHERE id = $1", [id]);
    const countResult = await pool.query("SELECT COUNT(*) FROM customers");
    return res.status(200).json({
      msg: "Customer deleted successfully",
      id,
      totalRecords: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addCustomer, updateCustomer, getCustomers, getAllActiveCustomers, getSingleCustomer, deleteCustomer };
