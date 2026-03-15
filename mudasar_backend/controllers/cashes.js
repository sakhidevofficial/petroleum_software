const pool = require("../config/pool");

const getCashes = async (req, res) => {
  try {
    const { field, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT c.*, u.name AS username, u.pic AS user_pic FROM cashes c JOIN users u ON u.id = c.user_id`;

    let rows, countResult;

    if (field === "name" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE u.name ILIKE $1 ORDER BY c.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM cashes c JOIN users u ON u.id = c.user_id WHERE u.name ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "status" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE c.status = $1 ORDER BY c.created_on ${orderDir} LIMIT 5 OFFSET $2`, [searchInput, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM cashes WHERE status = $1`, [searchInput]);
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(`${base} WHERE TO_DATE(c.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date ORDER BY c.created_on ${orderDir} LIMIT 5 OFFSET $3`, [start, end, offset]));
      countResult = await pool.query(`SELECT COUNT(*) FROM cashes WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`, [start, end]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY c.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]));
      countResult = await pool.query("SELECT COUNT(*) FROM cashes");
    }

    return res.status(200).json({ data: rows, totalRecord: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSingleCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT c.id, c.amount, c.cash, c.date, c.description, c.status, c.created_on, u.name AS username
       FROM cashes c LEFT JOIN users u ON u.id = c.user_id WHERE c.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const updateCash = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { userId, description, status, collectionDate } = req.body;

    const cashResult = await client.query("SELECT * FROM cashes WHERE id = $1", [id]);
    if (cashResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Cash entry not found", success: false }] });

    const cashEntry = cashResult.rows[0];

    if (status === "collected") {
      await client.query("BEGIN");
      await client.query(
        "UPDATE cashes SET description=$1, status=$2, collection_date=$3 WHERE id=$4",
        [description ?? cashEntry.description, status, collectionDate ?? cashEntry.collection_date, id]
      );

      const bankCheck = await client.query("SELECT * FROM bank WHERE date = $1", [cashEntry.date]);
      if (bankCheck.rows.length > 0) {
        await client.query("UPDATE bank SET total_cash = total_cash + $1 WHERE date = $2", [cashEntry.cash, cashEntry.date]);
      } else {
        await client.query(
          "INSERT INTO bank (user_id, total_cash, date, status) VALUES ($1,$2,$3,'pending')",
          [userId, cashEntry.cash, cashEntry.date]
        );
      }
      await client.query("COMMIT");

      const updated = await pool.query(
        `SELECT c.*, u.name AS username FROM cashes c LEFT JOIN users u ON u.id = c.user_id WHERE c.id = $1`, [id]
      );
      return res.status(200).json({ msg: "Cash entry updated successfully", updated: updated.rows, success: true });
    }

    return res.status(400).json({ errors: [{ msg: "Status must be 'Collected' to update cash", success: false }] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

module.exports = { getCashes, getSingleCash, updateCash };
