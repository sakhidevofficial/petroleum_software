const pool = require("../config/pool");

const getStocks = async (req, res) => {
  try {
    const { field, operator, searchInput, page = 0, sort = 1 } = req.query;
    const offset = 5 * parseInt(page);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    let rows, countResult;

    if (["name", "type", "status"].includes(field) && searchInput) {
      ({ rows } = await pool.query(
        `SELECT s.*, p.name AS product_name, p.type AS product_type, p.status AS product_status
         FROM stocks s JOIN products p ON p.id = s.product_id
         WHERE p.${field} ILIKE $1
         ORDER BY p.name ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM stocks s JOIN products p ON p.id = s.product_id WHERE p.${field} ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else {
      ({ rows } = await pool.query(
        `SELECT s.*, p.name AS product_name, p.type AS product_type, p.status AS product_status
         FROM stocks s JOIN products p ON p.id = s.product_id
         ORDER BY p.name ${orderDir} LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM stocks");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.error("Error in getStocks:", error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (s.product_id)
        s.id, s.stock, s.product_id,
        p.name AS product_name, p.type AS product_type, p.status AS product_status,
        pr.id AS price_id, pr.new_selling_price, pr.cost_price, pr.created_on AS price_created_on
      FROM stocks s
      JOIN products p ON p.id = s.product_id
      LEFT JOIN prices pr ON pr.product_id = s.product_id
      ORDER BY s.product_id, pr.created_on DESC NULLS LAST
    `);

    const countResult = await pool.query("SELECT COUNT(*) FROM stocks");
    return res.status(200).json({ data: rows, success: true, totalRecord: parseInt(countResult.rows[0].count) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error", success: false }] });
  }
};

module.exports = { getStocks, getAllStocks };
