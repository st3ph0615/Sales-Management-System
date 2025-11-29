// controllers/profileController.js
const pool = require("../db");

exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { name, email, region, address, phone } = req.body;

    console.log("UPDATING PROFILE FOR USER:", user_id);

    await pool.query(
      `UPDATE customers     
       SET name=$1, email=$2, region=$3, address=$4, phone=$5
       WHERE user_id=$6`,
      [name, email, region, address, phone, user_id]
    );

    return res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return res.status(500).json({ error: "Server error updating profile" });
  }
};