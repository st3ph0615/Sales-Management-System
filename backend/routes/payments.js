// routes/payments.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/my", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const c = await pool.query("SELECT customer_id FROM customers WHERE user_id = $1 LIMIT 1", [user_id]);
    if (c.rows.length === 0) return res.json([]);
    const customer_id = c.rows[0].customer_id;

    const q = await pool.query("SELECT payment_id, order_id, payment_method, payment_status, payment_date, amount_paid FROM payments WHERE customer_id = $1 ORDER BY payment_date DESC", [customer_id]);
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
