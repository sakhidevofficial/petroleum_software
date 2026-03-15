const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const AddSubPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { SubPlan, PlanPrice } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO subscriptions (sub_plan, plan_price, added_by) VALUES ($1,$2,$3) RETURNING *",
      [SubPlan, PlanPrice, req.user?.id || null]
    );
    return res.status(201).json({ subplanid: rows[0].id, msg: "Plan added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const GetSubPlans = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, sub_plan AS \"SubPlan\", plan_price AS \"PlanPrice\", created_on FROM subscriptions ORDER BY created_on DESC"
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const UpdateSubPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  if (!req.params.subplanid) return res.status(400).json({ msg: "Sub Plan id is missing!" });

  try {
    const { SubPlan, PlanPrice } = req.body;
    await pool.query("UPDATE subscriptions SET sub_plan=$1, plan_price=$2 WHERE id=$3", [SubPlan, PlanPrice, req.params.subplanid]);
    return res.status(201).json({ msg: "Sub Plan updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const DeleteSubPlan = async (req, res) => {
  if (!req.params.subplanid) return res.status(400).json({ msg: "Sub Plan id is missing!" });

  try {
    await pool.query("DELETE FROM subscriptions WHERE id = $1", [req.params.subplanid]);
    return res.status(201).json({ msg: "Sub Plan deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { AddSubPlan, GetSubPlans, UpdateSubPlan, DeleteSubPlan };
