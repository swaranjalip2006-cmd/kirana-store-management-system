const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  customerName: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  sellingPrice: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    default: "Cash"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Sale", saleSchema);