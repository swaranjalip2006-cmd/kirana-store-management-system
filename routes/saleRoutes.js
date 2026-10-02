const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

const router = express.Router();

// Get all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().populate("product");
    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sales"
    });
  }
});

// Add new sale and decrease stock
router.post("/", async (req, res) => {
  try {
    const {
      product,
      customerName,
      quantity,
      sellingPrice,
      paymentMethod
    } = req.body;

    const productExists = await Product.findById(product);

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Check available stock
    if (quantity > productExists.quantity) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    const totalAmount = quantity * sellingPrice;

    const sale = new Sale({
      product,
      customerName,
      quantity,
      sellingPrice,
      totalAmount,
      paymentMethod
    });

    const savedSale = await sale.save();

    // Decrease stock
    productExists.quantity -= quantity;
    await productExists.save();

    res.status(201).json({
      message: "Sale completed successfully",
      sale: savedSale,
      updatedProduct: productExists
    });

  } catch (error) {
    res.status(400).json({
      message: "Error adding sale"
    });
  }
});

// Get single sale
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("product");

    if (!sale) {
      return res.status(404).json({
        message: "Sale not found"
      });
    }

    res.json(sale);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching sale"
    });
  }
});

module.exports = router;