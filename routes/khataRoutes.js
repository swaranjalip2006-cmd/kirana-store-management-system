
const express = require("express");
const Khata = require("../models/Khata");
const Customer = require("../models/Customer");

const router = express.Router();

// Get all khata entries
router.get("/", async (req, res) => {
  try {
    const entries = await Khata.find()
      .populate("customer", "name phone balance")
      .sort({ date: -1, _id: -1 });

    res.json(entries);
  } catch (error) {
    console.error("Fetch Khata error:", error);
    res.status(500).json({
      message: "Error fetching khata",
    });
  }
});

// Add credit or payment
router.post("/", async (req, res) => {
  try {
    const { customer, type, amount, description } = req.body;

    if (!customer) {
      return res.status(400).json({
        message: "Please select a customer",
      });
    }

    if (!["credit", "payment"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    const numericAmount = Number(amount);

    if (
      amount === "" ||
      amount === null ||
      amount === undefined ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const customerExists = await Customer.findById(customer);

    if (!customerExists) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const currentBalance = Number(customerExists.balance || 0);

    if (!Number.isFinite(currentBalance) || currentBalance < 0) {
      return res.status(400).json({
        message: "Customer balance is invalid",
      });
    }

    let newBalance;

    if (type === "credit") {
      newBalance = currentBalance + numericAmount;
    } else {
      if (numericAmount > currentBalance) {
        return res.status(400).json({
          message: `Payment cannot exceed outstanding balance of ₹${currentBalance}`,
        });
      }

      newBalance = currentBalance - numericAmount;
    }

    // Save the transaction with its resulting balance.
    
const entry = new Khata({
  customer: customerExists._id,
  type,
  amount: numericAmount,
  description: description || "",
  balanceAfter: newBalance,
});


    // Update the customer's current balance.
    customerExists.balance = newBalance;

    await customerExists.save();
    const savedEntry = await entry.save();
    console.log("Saved Khata Entry:", savedEntry.toObject());

    res.status(201).json({
      message: "Khata updated successfully",
      entry: savedEntry,
      customer: customerExists,
    });
  } catch (error) {
    console.error("Update Khata error:", error);

    res.status(500).json({
      message: "Error updating khata",
    });
  }
});

module.exports = router;
