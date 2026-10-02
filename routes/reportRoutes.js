const express = require("express");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

const router = express.Router();

// Reports / Analytics
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const sales = await Sale.find();

    // Total Products
    const totalProducts = products.length;

    // Total Stock
    const totalStock = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    // Total Sales
    const totalSales = sales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    // Total Orders
    const totalOrders = sales.length;

    res.json({
      message: "Reports generated successfully",
      report: {
        totalProducts,
        totalStock,
        totalSales,
        totalOrders
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error generating reports"
    });
  }
});

module.exports = router;