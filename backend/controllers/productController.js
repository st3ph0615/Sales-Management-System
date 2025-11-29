const pool = require("../db");

// -----------------------------------------
// DEBUG ROUTES (Optional; keep if you want)
// -----------------------------------------
exports.debugTest = (req, res) => {
  res.send("PRODUCT ROUTE IS WORKING ✔");
};

exports.ping = (req, res) => {
  res.send("PING OK");
};


// -----------------------------------------
// GET ALL PRODUCTS
// -----------------------------------------
exports.getAllProducts = async (req, res) => {
  try {
    const q = await pool.query(
      "SELECT product_id, product_name, image_url, price FROM products WHERE is_active = TRUE ORDER BY created_at DESC"
    );

    res.json(q.rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// -----------------------------------------
// GET SINGLE PRODUCT BY ID
// -----------------------------------------
exports.getProductById = async (req, res) => {
  try {
    const q = await pool.query(
      "SELECT * FROM products WHERE product_id = $1 AND is_active = TRUE",
      [req.params.id]
    );

    if (q.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(q.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching product:", err.message);
    res.status(500).json({ error: "Error fetching product" });
  }
};
