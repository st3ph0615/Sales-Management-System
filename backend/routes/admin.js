const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");

// Protect all admin routes
router.use(auth.authenticate, auth.roleGuard(["admin"]));

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Products
router.get("/products", adminController.getAllProducts);
router.post("/products", adminController.createProduct);

// Orders
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id", adminController.updateOrderStatus);

module.exports = router;
