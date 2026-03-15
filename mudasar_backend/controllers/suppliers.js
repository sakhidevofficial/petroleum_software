const { validationResult } = require("express-validator");
const pool = require("../config/pool");
const fs = require("fs");

const getSuppliers = async (req, res) => {
  try {
    const { field, operator, searchInput, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const searchableFields = ["name", "email", "contact", "company_name", "balance", "address", "status"];

    let rows, countResult;
    if (searchableFields.includes(field) && searchInput) {
      ({ rows } = await pool.query(
        `SELECT * FROM suppliers WHERE ${field}::text ILIKE $1 ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM suppliers WHERE ${field}::text ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT * FROM suppliers ORDER BY created_on ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM suppliers");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getAllActiveSuppliers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM suppliers WHERE status = 'active'");
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { name, companyName, email, contact, address, balance, status, pic } = req.body;

    if (pic) {
      fs.copyFile(`./public/temp/${pic}`, `./public/suppliers/images/${pic}`, (err) => {
        if (err) console.error(`Error moving file: ${err}`);
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO suppliers (name, company_name, email, contact, address, balance, status, pic)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, companyName, email || null, contact, address, balance || 0, status, pic || null]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM suppliers");
    return res.status(201).json({
      msg: "New Supplier added successfully",
      supplier: rows[0],
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, companyName, email, contact, address, balance, status, pic } = req.body;

    const existing = await pool.query("SELECT * FROM suppliers WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Supplier not found", success: false }] });

    const supplier = existing.rows[0];

    if (pic && supplier.pic !== pic) {
      if (supplier.pic) fs.unlink(`./public/suppliers/images/${supplier.pic}`, () => {});
      fs.copyFile(`./public/temp/${pic}`, `./public/suppliers/images/${pic}`, (err) => {
        if (err) console.error(err);
      });
    }

    const { rows } = await pool.query(
      `UPDATE suppliers SET name=$1, company_name=$2, email=$3, contact=$4, address=$5, balance=$6, status=$7, pic=$8
       WHERE id=$9 RETURNING *`,
      [name, companyName, email || null, contact, address, balance, status, pic || supplier.pic, id]
    );

    return res.status(201).json({ msg: "Supplier updated successfully", updated: rows[0], success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM suppliers WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);
    const countResult = await pool.query("SELECT COUNT(*) FROM suppliers");
    return res.status(200).json({
      msg: "Supplier deleted successfully",
      id,
      totalRecords: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addSupplier, updateSupplier, getSuppliers, getAllActiveSuppliers, getSingleSupplier, deleteSupplier };
