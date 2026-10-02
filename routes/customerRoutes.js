const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers"
    });
  }
});

// Add new customer
router.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({
      message: "Error adding customer"
    });
  }
});

// Update customer
router.put("/:id", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({
      message: "Error updating customer"
    });
  }
});

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCustomer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.json({
      message: "Customer deleted successfully",
      customer: deletedCustomer
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting customer"
    });
  }
});

module.exports = router;