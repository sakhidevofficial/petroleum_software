const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const getAllMachines = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM machines WHERE status = 'active' ORDER BY created_on DESC");
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const getMachines = async (req, res) => {
  try {
    const { field, searchInput, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    const machineWithReading = `
      SELECT m.*,
             r.prev_reading,
             r.new_reading
      FROM machines m
      LEFT JOIN LATERAL (
        SELECT prev_reading, new_reading FROM readings
        WHERE machine_id = m.id
        ORDER BY created_on DESC LIMIT 1
      ) r ON true`;

    let rows, countResult;

    if (field && searchInput && ["name", "type", "status"].includes(field)) {
      ({ rows } = await pool.query(
        `${machineWithReading} WHERE m.${field} ILIKE $1 ORDER BY m.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(`SELECT COUNT(*) FROM machines WHERE ${field} ILIKE $1`, [`%${searchInput}%`]);
    } else {
      ({ rows } = await pool.query(`${machineWithReading} ORDER BY m.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM machines");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addMachine = async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { name, type, initialReading, status } = req.body;

    await client.query("BEGIN");

    const { rows: machineRows } = await client.query(
      "INSERT INTO machines (name, type, initial_reading, status) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, type, initialReading, status]
    );
    const savedMachine = machineRows[0];

    const productResult = await client.query("SELECT id FROM products WHERE type = $1 LIMIT 1", [type]);
    const productId = productResult.rows[0]?.id || null;

    let priceId = null;
    if (productId) {
      const priceResult = await client.query("SELECT id FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [productId]);
      priceId = priceResult.rows[0]?.id || null;
    }

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const date = `${day}-${month}-${year}`;

    if (productId && priceId) {
      await client.query(
        "INSERT INTO readings (machine_id, product_id, price_id, new_reading, prev_reading, date) VALUES ($1,$2,$3,$4,$4,$5)",
        [savedMachine.id, productId, priceId, initialReading, date]
      );
    } else {
      await client.query(
        "INSERT INTO readings (machine_id, new_reading, prev_reading, date) VALUES ($1,$2,$2,$3)",
        [savedMachine.id, initialReading, date]
      );
    }

    await client.query("COMMIT");

    const { rows: populatedMachine } = await pool.query(
      `SELECT m.*, r.prev_reading, r.new_reading
       FROM machines m
       LEFT JOIN LATERAL (SELECT prev_reading, new_reading FROM readings WHERE machine_id = m.id ORDER BY created_on DESC LIMIT 1) r ON true
       WHERE m.id = $1`,
      [savedMachine.id]
    );

    const totalRecord = await pool.query("SELECT COUNT(*) FROM machines");
    return res.status(201).json({ msg: "Machine added successfully", machine: populatedMachine[0] || {}, totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const updateMachine = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, type, initialReading, currentReading, status } = req.body;

    await pool.query(
      "UPDATE machines SET name=$1, type=$2, initial_reading=$3, current_reading=$4, status=$5 WHERE id=$6",
      [name, type, initialReading, currentReading, status, id]
    );

    const { rows } = await pool.query(
      `SELECT m.*, r.prev_reading, r.new_reading
       FROM machines m
       LEFT JOIN LATERAL (SELECT prev_reading, new_reading FROM readings WHERE machine_id = m.id ORDER BY created_on DESC LIMIT 1) r ON true
       WHERE m.id = $1`,
      [id]
    );

    return res.status(201).json({ msg: "Machine updated successfully", updated: rows[0], success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT m.*, r.prev_reading, r.new_reading
       FROM machines m
       LEFT JOIN LATERAL (SELECT prev_reading, new_reading FROM readings WHERE machine_id = m.id ORDER BY created_on DESC LIMIT 1) r ON true
       WHERE m.id = $1`,
      [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deleteMachine = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const machineResult = await client.query("SELECT * FROM machines WHERE id = $1", [id]);
    if (machineResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Machine not found", success: false }] });

    const machine = machineResult.rows[0];
    if (machine.lock_status === "locked") return res.status(200).json({ errors: [{ msg: "You can not delete machine it disturbs record", success: false }] });

    await client.query("BEGIN");
    await client.query("DELETE FROM readings WHERE machine_id = $1", [id]);
    await client.query("DELETE FROM machines WHERE id = $1", [id]);
    await client.query("COMMIT");

    const countMachines = await pool.query("SELECT COUNT(*) FROM machines");
    return res.status(200).json({ msg: "Machine deleted successfully", id, totalRecords: parseInt(countMachines.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

module.exports = { addMachine, updateMachine, getMachines, getSingleMachine, getAllMachines, deleteMachine };
