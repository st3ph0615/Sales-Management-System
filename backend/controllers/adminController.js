const pool = require("../db");

// ============================
// DASHBOARD STATS
// ============================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = (await pool.query("SELECT COUNT(*) FROM products")).rows[0].count;
    const totalOrders = (await pool.query("SELECT COUNT(*) FROM orders")).rows[0].count;
    const totalCustomers = (await pool.query("SELECT COUNT(*) FROM users WHERE role = 'customer'")).rows[0].count;

    res.json({
      totalProducts: Number(totalProducts),
      totalOrders: Number(totalOrders),
      totalCustomers: Number(totalCustomers)
    });

  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// PRODUCTS
// ============================
exports.getAllProducts = async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT product_id, product_name, category, stock_quantity, image_url, price
      FROM products
      ORDER BY created_at DESC
    `);
    res.json(q.rows);

  } catch (err) {
    console.error("❌ Product load error:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { product_name, category, price, stock_quantity, image_url } = req.body;

    await pool.query(
      `INSERT INTO products (product_name, category, price, stock_quantity, image_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [product_name, category, price, stock_quantity, image_url]
    );

    res.json({ message: "Product created successfully" });

  } catch (err) {
    console.error("❌ Create product error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ============================
// ORDERS
// ============================
exports.getAllOrders = async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT o.order_id, o.total_amount, o.status, o.created_at,
             c.customer_id,
             u.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      ORDER BY o.created_at DESC
    `);

    res.json(q.rows);

  } catch (err) {
    console.error("❌ Orders load error:", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await pool.query(
      `UPDATE orders SET status = $1 WHERE order_id = $2`,
      [status, id]
    );

    res.json({ message: "Order updated" });

  } catch (err) {
    console.error("❌ Update order status error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
