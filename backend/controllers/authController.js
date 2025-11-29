// controllers/authController.js
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_strong_secret";
const JWT_EXPIRES_IN = "2h";

/* ============================
   REGISTER
============================ */
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const role = "customer";

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING user_id, email, role`,
      [email, hashedPassword, role]
    );

    const customer = await pool.query(
      `INSERT INTO customers (user_id, name, email, region, address, phone)
       VALUES ($1, '', $2, '', '', '')
       RETURNING customer_id`,
      [newUser.rows[0].user_id, email]
    );

    const customer_id = customer.rows[0].customer_id;

    const payload = {
      user_id: newUser.rows[0].user_id,
      customer_id,
      email: newUser.rows[0].email,
      role: newUser.rows[0].role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        user_id: newUser.rows[0].user_id,
        customer_id,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


/* ======================
   LOGIN
====================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const result = await pool.query(
      "SELECT user_id, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // ⭐ GET customer_id
    const c = await pool.query(
      "SELECT customer_id FROM customers WHERE user_id = $1 LIMIT 1",
      [user.user_id]
    );

    const customer_id = c.rows.length > 0 ? c.rows[0].customer_id : null;

    const payload = {
      user_id: user.user_id,
      customer_id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      message: "Logged in",
      token,
      user: payload,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};