const express = require("express");
const Product = require("../models/Product");
const {
  authMiddleware,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products + Search + Filter
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching products"
    });
  }
});

// Low Stock Alert
router.get("/low-stock", async (req, res) => {
  try {
    const products = await Product.find({
      quantity: { $lte: 10 }
    });

    res.json({
      message: "Low stock products",
      count: products.length,
      products: products
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching low stock products"
    });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching product"
    });
  }
});

// Add new product - Admin only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin"),
  async (req, res) => {
    try {
      const product = new Product(req.body);
      const savedProduct = await product.save();

      res.status(201).json(savedProduct);

    } catch (error) {
      res.status(400).json({
        message: "Error adding product"
      });
    }
  }
);

// Stock In / Stock Out - Admin only
router.put(
  "/:id/stock",
  authMiddleware,
  authorizeRoles("Admin"),
  async (req, res) => {
    try {
      const { type, quantity } = req.body;

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (type === "in") {
        product.quantity += quantity;
      } else if (type === "out") {

        if (quantity > product.quantity) {
          return res.status(400).json({
            message: "Insufficient stock"
          });
        }

        product.quantity -= quantity;

      } else {
        return res.status(400).json({
          message: "Type must be 'in' or 'out'"
        });
      }

      await product.save();

      res.json({
        message: `Stock ${
          type === "in" ? "increased" : "decreased"
        } successfully`,
        product: product
      });

    } catch (error) {
      res.status(400).json({
        message: "Error updating stock"
      });
    }
  }
);

// Update product - Admin only
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json(updatedProduct);

    } catch (error) {
      res.status(400).json({
        message: "Error updating product"
      });
    }
  }
);

// Delete product - Admin only
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(
        req.params.id
      );

      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json({
        message: "Product deleted successfully",
        product: deletedProduct
      });

    } catch (error) {
      res.status(400).json({
        message: "Error deleting product"
      });
    }
  }
);

module.exports = router;

