const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const AddFeature = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

  try {
    const { name, description, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO features (name, description, status) VALUES ($1,$2,$3) RETURNING *`,
      [name, description, status]
    );
    return res.status(201).json({ feature: rows[0], msg: "Feature has been added successfully.", success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: { msg: "Server Error" } });
  }
};

const GetFeature = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, description, status, created_on FROM features ORDER BY created_on DESC");
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const UpdateFeature = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  if (!req.params.featureid) return res.status(400).json({ errors: [{ msg: "Feature ID missing" }] });

  try {
    const { name, description, status } = req.body;
    await pool.query(
      "UPDATE features SET name=$1, description=$2, status=$3 WHERE id=$4",
      [name, description, status, req.params.featureid]
    );
    return res.status(201).json({ msg: "Feature updated successfully." });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ msg: "Server Error" });
  }
};

const DeleteFeature = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: [{ success: false, msg: "Feature Id Missing!" }] });

  try {
    await pool.query("DELETE FROM features WHERE id = $1", [id]);
    return res.status(200).json({ id, success: true, msg: "Feature deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

module.exports = { AddFeature, GetFeature, UpdateFeature, DeleteFeature };
