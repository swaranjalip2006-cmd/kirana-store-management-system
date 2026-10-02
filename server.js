const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const saleRoutes = require("./routes/saleRoutes");
const customerRoutes = require("./routes/customerRoutes");
const khataRoutes = require("./routes/khataRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/auth", authRoutes);

// Product Routes
app.use("/products", productRoutes);

// Category Routes
app.use("/categories", categoryRoutes);

// Supplier Routes
app.use("/suppliers", supplierRoutes);

// Purchase Routes
app.use("/purchases", purchaseRoutes);

// Sales Routes
app.use("/sales", saleRoutes);

// Customer Routes
app.use("/customers", customerRoutes);

// Digital Khata Routes
app.use("/khata", khataRoutes);

// Reports Routes
app.use("/reports", reportRoutes);

mongoose.connect("mongodb://localhost:27017/kirana-store")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.json({
    message: "Kirana Store API Running"
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});