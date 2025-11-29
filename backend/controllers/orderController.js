const pool = require("../db");


// ======================================================
// GET /api/orders/my
// Fetch logged-in user's customer orders
// ======================================================
exports.getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Get customer_id
    const customerRes = await pool.query(
      `SELECT customer_id FROM customers WHERE user_id = $1 LIMIT 1`,
      [user_id]
    );

    if (customerRes.rows.length === 0) return res.json([]);

    const customer_id = customerRes.rows[0].customer_id;

    // Get orders + payment + items
    const orders = await pool.query(
      `
      SELECT 
          o.order_id,
          o.order_date,
          o.total_amount,
          o.status,

          -- Payment Method
          (
            SELECT p.payment_method
            FROM payments p
            WHERE p.order_id = o.order_id
            ORDER BY p.payment_date DESC
            LIMIT 1
          ) AS payment_method,

          -- Order Items List
          COALESCE(
            json_agg(
              json_build_object(
                'product_name', pr.product_name,
                'quantity', oi.quantity
              )
            ) FILTER (WHERE oi.order_id IS NOT NULL),
            '[]'
          ) AS items

      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN products pr ON pr.product_id = oi.product_id
      WHERE o.customer_id = $1
      GROUP BY o.order_id
      ORDER BY o.order_date DESC;
      `,
      [customer_id]
    );

    res.json(orders.rows);

  } catch (err) {
    console.error("Orders Fetch Error:", err);
    res.status(500).json({ error: "Server error fetching orders" });
  }
};




// ======================================================
// POST /api/orders 
// Create order + items + payment (transaction)
// ======================================================
exports.createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    // 🔥 Authenticated user (from JWT)
    const customer_id = req.user.customer_id;

    if (!customer_id) {
      return res.status(401).json({ error: "Unauthorized: No customer ID" });
    }

    const {
      shipping_address,
      billing_address,
      total_amount,
      notes,
      items,
      payment
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    await client.query("BEGIN");

    // Insert order
    const orderInsertQuery = `
      INSERT INTO orders 
        (customer_id, shipping_address, billing_address, total_amount, status, notes)
      VALUES 
        ($1, $2, $3, $4, 'Paid', $5)
      RETURNING order_id;
    `;

    const orderRes = await client.query(orderInsertQuery, [
      customer_id,
      shipping_address,
      billing_address,
      total_amount,
      notes
    ]);

    const order_id = orderRes.rows[0].order_id;

    // Insert order items + update stock
    for (const it of items) {
      await client.query(
        `INSERT INTO order_items (order_item_id, order_id, product_id, quantity, subtotal)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [order_id, it.product_id, it.quantity, it.subtotal]
      );

      await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE product_id = $2`,
        [it.quantity, it.product_id]
      );
    }

    // Insert payment
    await client.query(
      `INSERT INTO payments 
        (payment_id, order_id, customer_id, payment_method, payment_status, transaction_id, payment_date, amount_paid)
       VALUES 
        (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), $6)`,
      [
        order_id,
        customer_id,
        payment.payment_method || "Cash on Delivery",
        payment.payment_status,
        payment.transaction_id || null,
        payment.amount_paid
      ]
    );

    await client.query("COMMIT");

    res.json({ order_id });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Order Creation Error:", err);
    res.status(500).json({ error: "Error creating order" });
  } finally {
    client.release();
  }
};