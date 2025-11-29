const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

// GET /api/orders/my
router.get("/my", authenticate, orderController.getMyOrders);

// POST /api/orders
router.post("/", authenticate, orderController.createOrder);

module.exports = router;
