const express = require("express");
const Khata = require("../models/Khata");
const Customer = require("../models/Customer");

const router = express.Router();

// Get all khata entries
router.get("/", async (req, res) => {
  try {
    const entries = await Khata.find().populate("customer");
    res.json(entries);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching khata"
    });
  }
});

// Add credit or payment
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      type,
      amount,
      description
    } = req.body;

    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    const entry = new Khata({
      customer,
      type,
      amount,
      description
    });

    const savedEntry = await entry.save();

    // Update customer balance
    if (type === "credit") {
      customerExists.balance += amount;
    } else if (type === "payment") {
      customerExists.balance -= amount;

      if (customerExists.balance < 0) {
        customerExists.balance = 0;
      }
    }

    await customerExists.save();

    res.status(201).json({
      message: "Khata updated successfully",
      entry: savedEntry,
      customer: customerExists
    });

  } catch (error) {
    res.status(400).json({
      message: "Error updating khata"
    });
  }
});

module.exports = router;