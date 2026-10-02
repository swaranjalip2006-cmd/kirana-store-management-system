const mongoose = require("mongoose");

const khataSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  type: {
    type: String,
    enum: ["credit", "payment"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Khata", khataSchema);