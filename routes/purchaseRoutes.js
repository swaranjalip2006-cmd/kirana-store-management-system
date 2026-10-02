const express = require("express");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

const router = express.Router();

// Get all purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier")
      .populate("product");

    res.json(purchases);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching purchases"
    });
  }
});

// Add new purchase and increase stock
router.post("/", async (req, res) => {
  try {
    const {
      supplier,
      product,
      quantity,
      purchasePrice
    } = req.body;

    const supplierExists = await Supplier.findById(supplier);
    const productExists = await Product.findById(product);

    if (!supplierExists) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const totalAmount = quantity * purchasePrice;

    const purchase = new Purchase({
      supplier,
      product,
      quantity,
      purchasePrice,
      totalAmount
    });

    const savedPurchase = await purchase.save();

    // Increase product stock
    productExists.quantity += quantity;
    await productExists.save();

    res.status(201).json({
      message: "Purchase added successfully",
      purchase: savedPurchase,
      updatedProduct: productExists
    });

  } catch (error) {
    res.status(400).json({
      message: "Error adding purchase"
    });
  }
});

// Get single purchase
router.get("/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("product");

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found"
      });
    }

    res.json(purchase);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching purchase"
    });
  }
});

module.exports = router;