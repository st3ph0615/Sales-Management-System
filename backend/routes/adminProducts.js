const express = require("express");
const router = express.Router();

const adminProductsController = require("../controllers/adminProductsController");
const { authenticate, roleGuard } = require("../middleware/authMiddleware");

// Protect all product routes for admin only
router.use(authenticate, roleGuard(["admin"]));

// GET all products
router.get("/", adminProductsController.getAllProducts);

// GET one product by id
router.get("/:id", adminProductsController.getProductById);

// CREATE product
router.post("/", adminProductsController.createProduct);



// UPDATE product


router.put("/:id", adminProductsController.updateProduct);

// DELETE (soft-delete)
router.delete("/:id", adminProductsController.deleteProduct);

module.exports = router;
