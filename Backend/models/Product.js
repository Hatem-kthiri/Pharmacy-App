const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: { type: String, required: true },
  productImage: { type: String },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
