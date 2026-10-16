const mongoose = require("mongoose");

const khataSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  type: {
    type: String,
    enum: ["credit", "payment"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be greater than 0"],
  },

  description: {
    type: String,
    trim: true,
    default: "",
  },

  // Customer balance immediately after this transaction.
  // Older records may not have this field.
  balanceAfter: {
    type: Number,
    min: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Khata", khataSchema);
