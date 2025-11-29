// -------------------------
// Load Environment & Setup
// -------------------------
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

console.log("🚀 BACKEND STARTING…");

// -------------------------
// ROUTES IMPORTS
// -------------------------
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const paymentsRoutes = require("./routes/payments");
const productRoutes = require("./routes/products");
const profileRoutes = require("./routes/profile");

// -------------------------
// ROUTES MOUNT
// -------------------------

// 1) AUTH
console.log("📌 Mounting /api/auth");
app.use("/api/auth", require("./routes/auth"));




// 2) PRODUCTS (must come before orders)
console.log("📌 Mounting /api/products");
app.use("/api/products", productRoutes);

// 3) PROFILE
console.log("📌 Mounting /api/profile");
app.use("/api/profile", profileRoutes);

// 4) ORDERS
console.log("📌 Mounting /api/orders");
app.use("/api/orders", orderRoutes);

// 5) PAYMENTS
console.log("📌 Mounting /api/payments");
app.use("/api/payments", paymentsRoutes);

// -------------------------
// SERVER START
// -------------------------
app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
