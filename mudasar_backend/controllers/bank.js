const pool = require("../config/pool");

const getBankTransactions = async (req, res) => {
  try {
    const { field, searchInput, page, sort } = req.query;
    const skip = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";
    const base = `SELECT b.*, u.username FROM bank b LEFT JOIN users u ON u.id = b.user_id`;

    let rows, countResult;

    if (field === "username" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE u.username ILIKE $1 ORDER BY b.created_on ${orderDir} LIMIT 5 OFFSET $2`, [`%${searchInput}%`, skip]));
      countResult = await pool.query(`SELECT COUNT(*) FROM bank b LEFT JOIN users u ON u.id = b.user_id WHERE u.username ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && searchInput) {
      ({ rows } = await pool.query(`${base} WHERE b.date = $1 ORDER BY b.created_on ${orderDir} LIMIT 5 OFFSET $2`, [searchInput, skip]));
      countResult = await pool.query("SELECT COUNT(*) FROM bank WHERE date = $1", [searchInput]);
    } else {
      ({ rows } = await pool.query(`${base} ORDER BY b.created_on ${orderDir} LIMIT 5 OFFSET $1`, [skip]));
      countResult = await pool.query("SELECT COUNT(*) FROM bank");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.error("getBanks error:", error);
    return res.status(500).json({ errors: { msg: "Internal Server Error" }, success: false });
  }
};

const getSingleBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT b.id, b.total_cash, b.date, b.description, b.status, b.deposit_amount, b.deposit_date, u.name AS username
       FROM bank b LEFT JOIN users u ON u.id = b.user_id WHERE b.id = $1`, [id]
    );
    return res.status(200).json({ success: true, data: rows[0] || {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status, depositAmount, depositDate } = req.body;

    const bankResult = await pool.query("SELECT * FROM bank WHERE id = $1", [id]);
    if (bankResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Cash Not Collected", success: false }] });

    if (status === "deposited") {
      await pool.query(
        "UPDATE bank SET description=$1, status=$2, deposit_date=$3, deposit_amount=$4 WHERE id=$5",
        [description, status, depositDate, depositAmount, id]
      );

      const updated = await pool.query(
        `SELECT b.*, u.username FROM bank b LEFT JOIN users u ON u.id = b.user_id WHERE b.id = $1`, [id]
      );
      return res.status(200).json({ msg: "Bank entry updated successfully", updated: updated.rows, success: true });
    }

    return res.status(400).json({ errors: [{ msg: "Status must be 'Deposited' to update bank", success: false }] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { getBankTransactions, updateBank, getSingleBank };
