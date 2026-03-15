const bcrypt = require("bcryptjs");
const config = require("config");
const pool = require("../config/pool");
const { validationResult } = require("express-validator");
const fs = require("fs");

// GET ALL USERS (paginated + search)
const getAllUsers = async (req, res) => {
  try {
    const { field, operator, searchInput, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const searchableFields = ["name", "email", "contact", "status"];

    let rows, countResult;

    if (searchableFields.includes(field) && searchInput) {
      const query = `
        SELECT id, name, username, access, email, shift, contact, address, pic, status, created_on
        FROM users
        WHERE ${field} ILIKE $1
        ORDER BY created_on ${orderDir}
        LIMIT 5 OFFSET $2
      `;
      const countQ = `SELECT COUNT(*) FROM users WHERE ${field} ILIKE $1`;
      ({ rows } = await pool.query(query, [`%${searchInput}%`, offset]));
      countResult = await pool.query(countQ, [`%${searchInput}%`]);
    } else {
      const query = `
        SELECT id, name, username, access, email, shift, contact, address, pic, status, created_on
        FROM users
        ORDER BY created_on ${orderDir}
        LIMIT 5 OFFSET $1
      `;
      const countQ = `SELECT COUNT(*) FROM users`;
      ({ rows } = await pool.query(query, [offset]));
      countResult = await pool.query(countQ);
    }

    return res.status(200).json({
      data: rows,
      totalRecords: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

// ADD USER
const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, username, email, access, contact, password, status, address, pic } = req.body;

    if (email) {
      const { rows } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
      if (rows.length > 0)
        return res.status(400).json({ errors: [{ msg: "Email is already registered!", success: false }] });
    }

    const usernameCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (usernameCheck.rows.length > 0)
      return res.status(400).json({ errors: [{ msg: "Username is already taken!", success: false }] });

    const adminCheck = await pool.query("SELECT id, access FROM users WHERE access = $1", [access]);
    if (adminCheck.rows.length > 0 && access === "web_admin")
      return res.status(400).json({ errors: [{ msg: "Admin user already created", success: false }] });

    if (pic) {
      fs.copyFile(`./public/temp/${pic}`, `./public/users/images/${pic}`, (err) => {
        if (err) console.error(`Error moving file: ${err}`);
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, username, email, access, password, contact, status, address, pic)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name, username, access, email, shift, contact, address, pic, status, created_on`,
      [name, username, email || null, access, hashedPassword, contact, status, address, pic || null]
    );

    const savedUser = rows[0];
    const countResult = await pool.query("SELECT COUNT(*) FROM users");

    return res.status(201).json({
      msg: "User created successfully !",
      user: savedUser,
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: error.message, success: false }] });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, username, email, contact, address, access, status, pic, password } = req.body;

    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userResult.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "User not found", success: false }] });

    const user = userResult.rows[0];

    const usernameCheck = await pool.query("SELECT id FROM users WHERE username = $1 AND id != $2", [username, id]);
    if (usernameCheck.rows.length > 0)
      return res.status(400).json({ errors: [{ msg: "Username is already taken!", success: false }] });

    const adminCheck = await pool.query("SELECT id FROM users WHERE access = $1 AND id != $2", [access, id]);
    if (adminCheck.rows.length > 0 && access === "web_admin")
      return res.status(400).json({ errors: [{ msg: "Admin user already created", success: false }] });

    if (pic && user.pic !== pic) {
      if (user.pic) {
        fs.unlink(`./public/users/images/${user.pic}`, (err) => {
          if (err) console.error(err);
        });
      }
      fs.copyFile(`./public/temp/${pic}`, `./public/users/images/${pic}`, (err) => {
        if (err) console.error(`Error copying file: ${err}`);
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `UPDATE users
       SET name=$1, username=$2, email=$3, contact=$4, address=$5, access=$6, status=$7, pic=$8, password=$9
       WHERE id=$10
       RETURNING id, name, username, access, email, shift, contact, address, pic, status, created_on`,
      [name, username, email || null, contact, address, access, status, pic || user.pic, hashedPassword, id]
    );

    return res.status(201).json({
      msg: "user updated successfully",
      updated: rows[0],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

// GET SINGLE USER
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT id, name, username, access, email, shift, contact, address, pic, status FROM users WHERE id = $1",
      [id]
    );
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

module.exports = { getAllUsers, getSingleUser, addUser, updateUser };
