// backend/index.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/admin", require("./routes/admin"));
app.use("/api/admin/users", require("./routes/adminUsers"));
app.use("/auth", require("./routes/auth"));
app.use("/orders", require("./routes/orders"));
app.use("/payments", require("./routes/payments"));
app.use("/products", require("./routes/products"));
app.use("/profile", require("./routes/profile"));


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 BACKEND RUNNING ON PORT ${PORT}`));
