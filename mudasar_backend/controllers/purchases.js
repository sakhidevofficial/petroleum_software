const { validationResult } = require("express-validator");
const pool = require("../config/pool");

const round = (num) => Math.round(num * 100) / 100;

const getPurchases = async (req, res) => {
  try {
    const { field, operator, searchInput, startDate, endDate, page, sort } = req.query;
    const offset = 5 * (parseInt(page) || 0);
    const orderDir = sort === "-1" ? "DESC" : "ASC";

    const baseSelect = `
      SELECT pur.*, p.name AS product_name, p.type AS product_type,
             s.name AS supplier_name, s.company_name, s.pic AS supplier_pic
      FROM purchases pur
      JOIN products p ON p.id = pur.product_id
      JOIN suppliers s ON s.id = pur.supplier_id
    `;

    let rows, countResult;

    if (field === "supplier" && searchInput) {
      ({ rows } = await pool.query(
        `${baseSelect} WHERE s.name ILIKE $1 ORDER BY pur.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM purchases pur JOIN suppliers s ON s.id = pur.supplier_id WHERE s.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "product" && searchInput) {
      ({ rows } = await pool.query(
        `${baseSelect} WHERE p.name ILIKE $1 ORDER BY pur.created_on ${orderDir} LIMIT 5 OFFSET $2`,
        [`%${searchInput}%`, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM purchases pur JOIN products p ON p.id = pur.product_id WHERE p.name ILIKE $1`,
        [`%${searchInput}%`]
      );
    } else if (field === "date" && startDate && endDate) {
      const start = startDate.split("-").reverse().join("-");
      const end = endDate.split("-").reverse().join("-");
      ({ rows } = await pool.query(
        `${baseSelect} WHERE TO_DATE(pur.date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date
         ORDER BY pur.created_on ${orderDir} LIMIT 5 OFFSET $3`,
        [start, end, offset]
      ));
      countResult = await pool.query(
        `SELECT COUNT(*) FROM purchases WHERE TO_DATE(date,'DD-MM-YYYY') BETWEEN $1::date AND $2::date`,
        [start, end]
      );
    } else {
      ({ rows } = await pool.query(
        `${baseSelect} ORDER BY pur.created_on ${orderDir} LIMIT 5 OFFSET $1`, [offset]
      ));
      countResult = await pool.query("SELECT COUNT(*) FROM purchases");
    }

    return res.status(200).json({ data: rows, totalRecords: parseInt(countResult.rows[0].count), success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const addPurchase = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { productId, supplierId, quantity, costPrice, sellingPrice, paidAmount, date } = req.body;

    await pool.query(
      `UPDATE purchases SET status = 'locked'
       WHERE id = (SELECT id FROM purchases WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [productId]
    );

    const { rows: purchaseRows } = await pool.query(
      `INSERT INTO purchases (product_id, supplier_id, quantity, cost_price, selling_price, paid_amount, date)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [productId, supplierId, quantity, costPrice, sellingPrice, paidAmount, date]
    );
    const savedPurchase = purchaseRows[0];

    const payable = round(quantity * costPrice - paidAmount);
    await pool.query("UPDATE suppliers SET balance = balance + $1 WHERE id = $2", [payable, supplierId]);

    const stockResult = await pool.query("SELECT * FROM stocks WHERE product_id = $1", [productId]);
    const currentStock = stockResult.rows[0]?.stock || 0;

    const lastPriceResult = await pool.query(
      "SELECT * FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1", [productId]
    );
    const lastPrice = lastPriceResult.rows[0];

    const priceDifference = lastPrice ? round(costPrice - lastPrice.cost_price) : 0;
    const differenceValue = round(currentStock * priceDifference);

    if (lastPrice) {
      await pool.query("UPDATE prices SET status = 'locked' WHERE id = $1", [lastPrice.id]);
    }

    await pool.query(
      `INSERT INTO prices (product_id, purchase_id, remaining_stock, cost_price, old_selling_price, new_selling_price, price_difference, difference_value, date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [productId, savedPurchase.id, round(currentStock), costPrice,
       lastPrice?.new_selling_price || 0, sellingPrice, priceDifference, differenceValue, date]
    );

    await pool.query("UPDATE stocks SET stock = stock + $1 WHERE product_id = $2", [round(quantity), productId]);

    const withRelations = await pool.query(
      `SELECT pur.*, p.name AS product_name, p.type AS product_type,
              s.name AS supplier_name, s.company_name
       FROM purchases pur
       JOIN products p ON p.id = pur.product_id
       JOIN suppliers s ON s.id = pur.supplier_id
       WHERE pur.id = $1`,
      [savedPurchase.id]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM purchases");
    return res.status(201).json({
      msg: "New Purchase added successfully",
      purchase: withRelations.rows[0],
      totalRecord: parseInt(countResult.rows[0].count),
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(403).json({ errors: errors.array({ onlyFirstError: true }) });

    const { id } = req.params;
    const { productId, supplierId, quantity, costPrice, sellingPrice, paidAmount, date } = req.body;

    const existingResult = await pool.query("SELECT * FROM purchases WHERE id = $1", [id]);
    if (existingResult.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Purchase not found", success: false }] });

    const purchase = existingResult.rows[0];
    const quantityDiff = quantity - purchase.quantity;
    const oldPayable = round(purchase.quantity * purchase.cost_price - purchase.paid_amount);
    const newPayable = round(quantity * costPrice - paidAmount);
    const diffPayable = newPayable - oldPayable;

    await pool.query("UPDATE stocks SET stock = stock + $1 WHERE product_id = $2", [quantityDiff, productId]);
    await pool.query("UPDATE suppliers SET balance = balance + $1 WHERE id = $2", [diffPayable, supplierId]);

    const priceResult = await pool.query("SELECT * FROM prices WHERE purchase_id = $1", [id]);
    if (priceResult.rows.length > 0) {
      await pool.query(
        `UPDATE prices SET cost_price=$1, new_selling_price=$2, date=$3 WHERE purchase_id=$4`,
        [costPrice, sellingPrice, date, id]
      );
    }

    const { rows } = await pool.query(
      `UPDATE purchases SET product_id=$1, supplier_id=$2, quantity=$3, cost_price=$4, selling_price=$5, paid_amount=$6, date=$7
       WHERE id=$8 RETURNING *`,
      [productId, supplierId, quantity, costPrice, sellingPrice, paidAmount, date, id]
    );

    const withRelations = await pool.query(
      `SELECT pur.*, p.name AS product_name, s.name AS supplier_name
       FROM purchases pur
       JOIN products p ON p.id = pur.product_id
       JOIN suppliers s ON s.id = pur.supplier_id
       WHERE pur.id = $1`,
      [id]
    );

    return res.status(201).json({ msg: "Purchase updated successfully", updated: withRelations.rows, success: true });
  } catch (error) {
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

const getSinglePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM purchases WHERE id = $1", [id]);
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: [{ msg: "Internal Server Error", success: false }] });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM purchases WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ errors: [{ msg: "Purchase not found", success: false }] });

    const purchase = existing.rows[0];
    if (purchase.status === "locked")
      return res.status(200).json({ errors: [{ msg: "Purchase is locked", success: false }] });

    const payable = round(purchase.quantity * purchase.cost_price - purchase.paid_amount);
    await pool.query("UPDATE suppliers SET balance = balance - $1 WHERE id = $2", [payable, purchase.supplier_id]);
    await pool.query("UPDATE stocks SET stock = stock - $1 WHERE product_id = $2", [round(purchase.quantity), purchase.product_id]);

    await pool.query("DELETE FROM prices WHERE purchase_id = $1", [id]);
    await pool.query("DELETE FROM purchases WHERE id = $1", [id]);

    await pool.query(
      `UPDATE purchases SET status = 'open'
       WHERE id = (SELECT id FROM purchases WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [purchase.product_id]
    );
    await pool.query(
      `UPDATE prices SET status = 'open'
       WHERE id = (SELECT id FROM prices WHERE product_id = $1 ORDER BY created_on DESC LIMIT 1)`,
      [purchase.product_id]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM purchases");
    return res.status(200).json({
      msg: "Purchase deleted successfully",
      totalRecords: parseInt(countResult.rows[0].count),
      id,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { msg: "Internal Server Error", success: false } });
  }
};

module.exports = { addPurchase, updatePurchase, getPurchases, deletePurchase, getSinglePurchase };
