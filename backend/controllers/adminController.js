// backend/controllers/adminController.js
const pool = require("../db");

// --------------------------------------
// DASHBOARD STATS
// --------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = (await pool.query("SELECT count(*) FROM products")).rows[0].count;
    const totalOrders = (await pool.query("SELECT count(*) FROM orders")).rows[0].count;
    const totalCustomers = (await pool.query("SELECT count(*) FROM customers")).rows[0].count;

    res.json({
      totalProducts: Number(totalProducts),
      totalOrders: Number(totalOrders),
      totalCustomers: Number(totalCustomers)
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --------------------------------------
// PRODUCTS (NEEDED BY ROUTES)
// --------------------------------------
exports.getAllProducts = async (req, res) => {
  try {
    const q = await pool.query(
      "SELECT product_id, product_name, image_url, price FROM products ORDER BY created_at DESC"
    );
    res.json(q.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { product_name, price, image_url } = req.body;

    await pool.query(
      `INSERT INTO products (product_name, price, image_url)
       VALUES ($1, $2, $3)`,
      [product_name, price, image_url]
    );

    res.json({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// --------------------------------------
// ORDERS
// --------------------------------------
exports.getAllOrders = async (req, res) => {
  try {
    const q = `
      SELECT o.order_id, o.total_amount, o.status, o.payment_status,
             c.name AS customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to load orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      `UPDATE orders SET status = $1 WHERE order_id = $2`,
      [status, id]
    );

    res.json({ message: "Order updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
};
