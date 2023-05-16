const mongoose = require("mongoose");

const pharmacyStockSchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: { type: String, required: true },
  productImage: { type: String },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PharmacyStock = mongoose.model("PharmacyStock", pharmacyStockSchema);

module.exports = PharmacyStock;
