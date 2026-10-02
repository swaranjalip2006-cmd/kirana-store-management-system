const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  company: {
    type: String
  }
});

module.exports = mongoose.model("Supplier", supplierSchema);