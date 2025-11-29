// backend/scripts/createAdmin.js
const pool = require("../db"); // adjust path if needed
const bcrypt = require("bcrypt");

async function createAdmin() {
  try {
    const email = "admin@gmail.com";        // change
    const plain = "Adminpassword!";     // change
    const role = "admin";

    const hashed = await bcrypt.hash(plain, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (user_id, email, password_hash, role)
       VALUES (gen_random_uuid(), $1, $2, $3)
       RETURNING user_id, email, role;`,
      [email, hashed, role]
    );

    // optionally create a customers row if your code expects it (admins may not need it)
    console.log("Admin created:", rows[0]);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
