// routes/profile.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const pool = require("../db");

/**
 * ----------------------------------------------------
 *  GET /api/profile/me
 *  Fetch logged-in user's customer profile
 * ----------------------------------------------------
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const q = await pool.query(
      `SELECT customer_id, name, email, region, address, phone 
       FROM customers 
       WHERE user_id = $1 
       LIMIT 1`,
      [user_id]
    );

    if (q.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ user: q.rows[0] });

  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    res.status(500).json({ error: "Server error fetching profile" });
  }
});


/**
 * ----------------------------------------------------
 *  PUT /api/profile/update
 *  Update logged-in user's customer profile
 * ----------------------------------------------------
 */
router.put("/update", authenticate, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { name, email, region, address, phone } = req.body;

    await pool.query(
      `UPDATE customers 
       SET name=$1, email=$2, region=$3, address=$4, phone=$5 
       WHERE user_id=$6`,
      [name, email, region, address, phone, user_id]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error updating profile" });
  }
});

module.exports = router;
