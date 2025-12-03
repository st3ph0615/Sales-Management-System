const pool = require("../db");

// =======================================================
// GET ALL ORDERS
// =======================================================
exports.getAllOrders = async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT 
        o.order_id,
        o.total_amount,
        o.status,
        o.order_date,
        c.customer_id,
        c.name AS customer_name,
        u.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);

    return res.json(q.rows);
  } catch (err) {
    console.error(" Error fetching admin orders:", err);
    return res.status(500).json({ error: "Failed to load orders" });
  }
};


// =======================================================
// GET ORDER BY ID
// =======================================================
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const q = await pool.query(
      `
      SELECT 
        o.order_id,
        o.total_amount,
        o.status,
        o.order_date,
        o.notes,
        o.shipping_address,
        o.billing_address,
        c.customer_id,
        c.name,
        c.address,
        c.phone,
        u.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.user_id
      WHERE o.order_id = $1
      `,
      [id]
    );

    if (q.rows.length === 0)
      return res.status(404).json({ error: "Order not found" });

    return res.json(q.rows[0]);
  } catch (err) {
    console.error("Error fetching order:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


// =======================================================
// UPDATE ORDER STATUS
// =======================================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await pool.query(
      `UPDATE orders SET status = $1 WHERE order_id = $2`,
      [status, id]
    );

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error(" Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
