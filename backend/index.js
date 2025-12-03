// backend/index.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());


// ADMIN ROUTES


app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/orders", require("./routes/adminOrder"));
app.use("/api/admin/products", require("./routes/adminProducts"));
app.use("/api/admin/users", require("./routes/adminUsers"));

// PUBLIC / USER ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/products", require("./routes/products"));
app.use("/api/profile", require("./routes/profile"));   

const PORT = 5000;
app.listen(PORT, () => console.log(` BACKEND RUNNING ON PORT ${PORT}`));
