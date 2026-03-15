const { validationResult } = require("express-validator");
const fs = require("fs");
const pool = require("../config/pool");

const getProducts = async (req, res) => {
  try {
    const { field, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    const productWithLatestPrice = `
      SELECT DISTINCT ON (p.id) p.id, p.name, p.type, p.status, p.pic, p.created_on,
             pr.id AS price_id, pr.cost_price, pr.new_selling_price, pr.old_selling_price, pr.date AS price_date, pr.created_on AS price_created_on
      FROM products p
      LEFT JOIN prices pr ON pr.product_id = p.id`;

    let rows, countResult;

    if (field && searchInput && ["name", "type", "status"].includes(field)) {
      ({ rows } = await pool.query(
        `${productWithLatestPrice} WHERE p.${field} ILIKE $1 ORDER BY p.id, pr.created_on DESC LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(`SELECT COUNT(*) FROM products WHERE ${field} ILIKE $1`, [`%${searchInput}%`]);
    } else if (field === "date" && startDate && endDate) {
      ({ rows } = await pool.query(
        `${productWithLatestPrice} WHERE pr.date BETWEEN $1 AND $2 ORDER BY p.id, pr.created_on DESC LIMIT 5 OFFSET $3`,
        [startDate, endDate, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(DISTINCT p.id) FROM products p JOIN prices pr ON pr.product_id = p.id WHERE pr.date BETWEEN $1 AND $2`,
        [startDate, endDate]
      );
    } else {
      ({ rows } = await pool.query(
        `${productWithLatestPrice} ORDER BY p.id, pr.created_on DESC LIMIT 5 OFFSET $1`,
        [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM products");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (p.id) p.id, p.name, p.type, p.status, p.pic, p.created_on,
             pr.id AS price_id, pr.cost_price, pr.new_selling_price, pr.old_selling_price,
             s.stock
      FROM products p
      LEFT JOIN prices pr ON pr.product_id = p.id
      LEFT JOIN stocks s ON s.product_id = p.id
      WHERE p.status = 'active'
      ORDER BY p.id, pr.created_on DESC
    `);
    return res.status(200).json({ data: rows, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (p.id) p.id, p.name, p.type, p.status, p.pic, p.created_on,
             pr.id AS price_id, pr.cost_price, pr.new_selling_price, pr.old_selling_price, pr.date AS price_date
      FROM products p
      LEFT JOIN prices pr ON pr.product_id = p.id
      WHERE p.id = $1
      ORDER BY p.id, pr.created_on DESC
    `, [id]);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const addProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { name, type, costPrice, sellingPrice, status, date, pic } = req.body;

    if (pic) {
      const sourcePath = `./public/temp/${pic}`;
      const destinationPath = `./public/products/images/${pic}`;
      fs.copyFile(sourcePath, destinationPath, (err) => { if (err) console.error(`Error moving file: ${err}`); });
    }

    await client.query("BEGIN");

    const { rows: productRows } = await client.query(
      "INSERT INTO products (name, type, status, pic) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, type, status, pic || null]
    );
    const savedProduct = productRows[0];

    await client.query(
      "INSERT INTO prices (product_id, cost_price, old_selling_price, new_selling_price, date) VALUES ($1,$2,$3,$3,$4)",
      [savedProduct.id, costPrice, sellingPrice, date]
    );

    await client.query("INSERT INTO stocks (product_id, stock) VALUES ($1, 0)", [savedProduct.id]);

    await client.query("COMMIT");

    const { rows: getProduct } = await pool.query(`
      SELECT DISTINCT ON (p.id) p.id, p.name, p.type, p.status, p.pic, p.created_on,
             pr.id AS price_id, pr.cost_price, pr.new_selling_price
      FROM products p LEFT JOIN prices pr ON pr.product_id = p.id
      WHERE p.id = $1
      ORDER BY p.id, pr.created_on DESC
    `, [savedProduct.id]);

    const totalRecord = await pool.query("SELECT COUNT(*) FROM products");
    return res.status(201).json({ msg: "Product added successfully", product: getProduct, totalRecord: parseInt(totalRecord.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const updateProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { name, type, costPrice, sellingPrice, status, date, pic } = req.body;

    const productResult = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    if (productResult.rows.length === 0) return res.status(404).json({ errors: [{ msg: "Product not found" }] });

    const product = productResult.rows[0];
    const priceResult = await client.query("SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [id]);
    const price = priceResult.rows[0];

    await client.query("BEGIN");

    if (product.pic && pic && product.pic !== pic) {
      const oldFilePath = `./public/products/images/${product.pic}`;
      fs.unlink(oldFilePath, (err) => { if (err) console.error(err); });
      const sourcePath = `./public/temp/${pic}`;
      const destinationPath = `./public/products/images/${pic}`;
      fs.copyFile(sourcePath, destinationPath, (err) => { if (err) console.error(`Error copying file: ${err}`); });
    }

    await client.query("UPDATE products SET name=$1, type=$2, status=$3, pic=$4 WHERE id=$5", [name, type, status, pic || product.pic, id]);

    if (!price || price.cost_price !== costPrice || price.new_selling_price !== sellingPrice) {
      await client.query(
        "INSERT INTO prices (product_id, cost_price, old_selling_price, new_selling_price, date) VALUES ($1,$2,$3,$3,$4)",
        [id, costPrice, sellingPrice, date]
      );
    }

    await client.query("COMMIT");

    const { rows: getProduct } = await pool.query(`
      SELECT DISTINCT ON (p.id) p.id, p.name, p.type, p.status, p.pic, p.created_on,
             pr.id AS price_id, pr.cost_price, pr.new_selling_price
      FROM products p LEFT JOIN prices pr ON pr.product_id = p.id
      WHERE p.id = $1
      ORDER BY p.id, pr.created_on DESC
    `, [id]);

    return res.status(201).json({ msg: "Product updated successfully", updated: getProduct, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

const deleteProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");
    await client.query("DELETE FROM prices WHERE product_id = $1", [id]);
    await client.query("DELETE FROM stocks WHERE product_id = $1", [id]);
    await client.query("DELETE FROM products WHERE id = $1", [id]);
    await client.query("COMMIT");

    const countProducts = await pool.query("SELECT COUNT(*) FROM products");
    return res.status(200).json({ msg: "Product deleted successfully", id, totalRecords: parseInt(countProducts.rows[0].count), success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  } finally {
    client.release();
  }
};

module.exports = { addProduct, updateProduct, getProducts, getAllProducts, getSingleProduct, deleteProduct };
