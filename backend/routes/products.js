const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

console.log("🟦 products.js LOADED from:", __filename);
console.log("Loading products router...");

// DEBUG
router.get("/debug/test", productController.debugTest);
router.get("/ping", productController.ping);

// DATA ROUTES
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
