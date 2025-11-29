const express = require("express");
const router = express.Router();

const adminOrderController = require("../controllers/adminOrderController");
const { authenticate, roleGuard } = require("../middleware/authMiddleware");
console.log("authenticate:", authenticate);
console.log("roleGuard:", roleGuard);
console.log("getAllOrders:", adminOrderController.getAllOrders);
console.log("getOrderById:", adminOrderController.getOrderById);
console.log("updateOrderStatus:", adminOrderController.updateOrderStatus);


// Protect all admin order routes
router.use(authenticate, roleGuard(["admin"]));

// GET all orders
router.get("/", adminOrderController.getAllOrders);

// GET specific order
router.get("/:id", adminOrderController.getOrderById);

// UPDATE order status
router.put("/:id/status", adminOrderController.updateOrderStatus);

module.exports = router;
