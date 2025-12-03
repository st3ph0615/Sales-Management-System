const pool = require("../db");


// GET /api/orders/my
// Fetch logged-in user's customer orders

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

    // Fetch all orders (no JOIN — Citus SAFE)
    const ordersRes = await pool.query(
      `
      SELECT 
        o.order_id,
        o.order_date,
        o.total_amount,
        o.status,
        (
          SELECT p.payment_method
          FROM payments p
          WHERE p.customer_id = o.customer_id
            AND p.order_id = o.order_id
          ORDER BY p.payment_date DESC
          LIMIT 1
        ) AS payment_method
      FROM orders o
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC;
      `,
      [customer_id]
    );

    const orders = ordersRes.rows;

    if (orders.length === 0) return res.json([]);

    // Fetch items for all orders
    const itemsRes = await pool.query(
      `
      SELECT 
        oi.order_id,
        pr.product_name,
        oi.quantity,
        oi.subtotal
      FROM order_items oi
      
      JOIN products pr ON pr.product_id = oi.product_id
      JOIN orders o ON o.order_id = oi.order_id   -- <- KEY FIX
      WHERE o.customer_id = $1;
      `,
      [customer_id]
    );

    const items = itemsRes.rows;

    // Attach items to orders
    const orderMap = {};
    orders.forEach(o => {
      orderMap[o.order_id] = { ...o, items: [] };
    });

    items.forEach(it => {
      orderMap[it.order_id].items.push({
        product_name: it.product_name,
        quantity: it.quantity,
        subtotal: it.subtotal
      });
    });

    res.json(Object.values(orderMap));

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
      payment,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    await client.query("BEGIN");

    // INSERT ORDER
    const orderRes = await client.query(
      `
      INSERT INTO orders 
        (customer_id, shipping_address, billing_address, total_amount, status, notes)
      VALUES ($1, $2, $3, $4, 'Paid', $5)
      RETURNING order_id;
      `,
      [customer_id, shipping_address, billing_address, total_amount, notes]
    );

    const order_id = orderRes.rows[0].order_id;

    // INSERT ORDER ITEMS (⚡ NO CUSTOMER_ID!)
    for (const it of items) {
      await client.query(
        `
        INSERT INTO order_items 
          (order_item_id, order_id, product_id, quantity, subtotal)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        `,
        [order_id, it.product_id, it.quantity, it.subtotal]
      );

      // UPDATE STOCK
      await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1
         WHERE product_id = $2`,
        [it.quantity, it.product_id]
      );
    }

    // INSERT PAYMENT
    await client.query(
      `
      INSERT INTO payments 
        (payment_id, order_id, customer_id, payment_method, payment_status, transaction_id, payment_date, amount_paid)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), $6)
      `,
      [
        order_id,
        customer_id,
        payment.payment_method || "Cash on Delivery",
        payment.payment_status,
        payment.transaction_id || null,
        payment.amount_paid,
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



