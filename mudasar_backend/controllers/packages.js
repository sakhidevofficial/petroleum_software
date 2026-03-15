const { validationResult } = require("express-validator");
const fs = require("fs");
const pool = require("../config/pool");

const getPackages = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM packages ORDER BY created_on DESC");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const addPackage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

  try {
    const { name, description, price, expiresInMonths, image, group, features, status, color } = req.body;

    if (image) {
      const sourcePath = `./public/temp/${image}`;
      const destinationPath = `./public/packages/images/${image}`;
      fs.rename(sourcePath, destinationPath, (err) => { if (err) console.error(`Error moving file: ${err}`); });
    }

    const { rows } = await pool.query(
      `INSERT INTO packages (name, description, price, expires_in_months, image, grp, features, status, color)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, description, price, expiresInMonths, image, group, JSON.stringify(features), status, color]
    );

    return res.status(201).json({ package: rows[0], msg: "Package added successfully", success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: [{ msg: "Server Error", success: false }] });
  }
};

const getSinglePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM packages WHERE id = $1", [id]);
    return res.status(200).json({ package: rows[0] || {}, success: true });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const updatePackage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

  try {
    const { name, description, price, expiresInMonths, image, group, features, status, color } = req.body;
    const { id } = req.params;

    const existing = await pool.query("SELECT image FROM packages WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: [{ msg: "Package not found", success: false }] });

    if (existing.rows[0].image && existing.rows[0].image !== image) {
      const oldFilePath = `./public/packages/images/${existing.rows[0].image}`;
      fs.unlink(oldFilePath, (err) => { if (err) console.error(err); });
      const sourcePath = `./public/temp/${image}`;
      const destinationPath = `./public/packages/images/${image}`;
      fs.rename(sourcePath, destinationPath, (err) => { if (err) console.error(`Error moving file: ${err}`); });
    }

    const { rows } = await pool.query(
      `UPDATE packages SET name=$1, description=$2, price=$3, expires_in_months=$4, image=$5, grp=$6, features=$7, status=$8, color=$9 WHERE id=$10 RETURNING *`,
      [name, description, price, expiresInMonths, image, group, JSON.stringify(features), status, color, id]
    );

    return res.status(201).json({ package: rows[0], msg: "Package updated successfully", success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: [{ msg: "Server Error", success: false }] });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM packages WHERE id = $1", [id]);
    return res.status(200).json({ id, msg: "Package deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};

module.exports = { addPackage, getPackages, getSinglePackage, updatePackage, deletePackage };
