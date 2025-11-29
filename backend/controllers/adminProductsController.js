const pool = require("../db");

// =======================================================
// GET ALL PRODUCTS
// =======================================================
exports.getAllProducts = async (req, res) => {
  try {
    const q = await pool.query(`
      SELECT 
        product_id,
        product_name,
        price,
        category,
        stock_quantity,
        is_active,
        image_url,
        created_at
      FROM products
      ORDER BY created_at DESC
    `);

    res.json(q.rows);
  } catch (err) {
    console.error("❌ Error loading products:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
};

// =======================================================
// GET SPECIFIC PRODUCT
// =======================================================
exports.getProductById = async (req, res) => {
  try {
    const q = await pool.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [req.params.id]
    );

    if (q.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(q.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ error: "Failed to get product" });
  }
};

// =======================================================
// CREATE PRODUCT
// =======================================================
exports.createProduct = async (req, res) => {
  try {
    const {
      product_name,
      price,
      category,
      description,
      image_url,
      stock_quantity
    } = req.body;

    await pool.query(
      `INSERT INTO products 
       (product_name, price, category, description, image_url, stock_quantity, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW(), NOW())`,
      [product_name, price, category, description, image_url, stock_quantity]
    );

    res.json({ message: "Product created successfully" });
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// =======================================================
// UPDATE PRODUCT
// =======================================================
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, category, price, stock_quantity, image_url } = req.body;

    const q = await pool.query(
      `UPDATE products 
       SET product_name=$1, category=$2, price=$3, stock_quantity=$4, image_url=$5
       WHERE product_id=$6
       RETURNING *`,
      [product_name, category, price, stock_quantity, image_url, id]
    );

    if (q.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json(q.rows[0]);
  } catch (err) {
    console.error("❌ Update product error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};





// =======================================================
// DELETE (SOFT DELETE: is_active = FALSE)
// =======================================================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE products 
       SET is_active = FALSE, updated_at = NOW()
       WHERE product_id = $1`,
      [id]
    );

    res.json({ message: "Product archived (soft deleted)" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
