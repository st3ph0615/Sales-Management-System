const pool = require("../db");

// ----------------------------------------------------
// GET ALL USERS
// ----------------------------------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT 
        user_id,
        email AS name,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users.rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------------------------------------------
// UPDATE USER ROLE
// ----------------------------------------------------
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    await pool.query(
      `UPDATE users SET role = $1 WHERE user_id = $2`,
      [role, id]
    );

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.error("❌ Error updating role:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
};

// ----------------------------------------------------
// DELETE USER
// ----------------------------------------------------
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM users WHERE user_id = $1`,
      [id]
    );

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
