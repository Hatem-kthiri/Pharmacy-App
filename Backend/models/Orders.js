const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  quantity: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  delivredStatus: {
    type: String,
    default: "Pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
