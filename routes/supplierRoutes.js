const express = require("express");
const Supplier = require("../models/Supplier");

const router = express.Router();

// Get all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching suppliers"
    });
  }
});

// Get single supplier
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching supplier"
    });
  }
});

// Add new supplier
router.post("/", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();

    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({
      message: "Error adding supplier"
    });
  }
});

// Update supplier
router.put("/:id", async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({
      message: "Error updating supplier"
    });
  }
});

// Delete supplier
router.delete("/:id", async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSupplier) {
      return res.status(404).json({
        message: "Supplier not found"
      });
    }

    res.json({
      message: "Supplier deleted successfully",
      supplier: deletedSupplier
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting supplier"
    });
  }
});

module.exports = router;