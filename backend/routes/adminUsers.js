const express = require("express");
const router = express.Router();
const adminUsersController = require("../controllers/adminUsersController");
const { authenticate, roleGuard } = require("../middleware/authMiddleware");

// Only admins can view/manage users
router.use(authenticate, roleGuard(["admin"]));

router.get("/", adminUsersController.getAllUsers);
router.put("/:id/role", adminUsersController.updateRole);
router.delete("/:id", adminUsersController.deleteUser);

module.exports = router;
