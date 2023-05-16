const express = require("express");
const router = express.Router();
const Orders = require("../models/Orders");
const authenticateUser = require("../middleware/verifyToken");
const Product = require("../models/Product");

// Get all orders
router.get("/get-order-provider", authenticateUser, async (req, res) => {
  try {
    const orders = await Orders.find({ provider: req.user.id })
      .populate("product")
      .populate("pharmacy", "name location email phone");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/get-order-pharmacy", authenticateUser, async (req, res) => {
  try {
    const orders = await Orders.find({ pharmacy: req.user.id })
      .populate("product")
      .populate("provider", "name location email phone");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/get-orders", authenticateUser, async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("product")
      .populate("provider", "name location email phone")
      .populate("pharmacy", "name location email phone");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post("/create-order", authenticateUser, async (req, res) => {
  const order = new Orders({
    product: req.body.product,
    quantity: req.body.quantity,
    provider: req.body.provider,
    pharmacy: req.user.id,
    deliveryDate: req.body.deliveryDate,
  });

  try {
    const newOrder = await order.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an order
router.put("/update-order/:id", authenticateUser, async (req, res) => {
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an order
router.delete("/remove-order/:id", async (req, res) => {
  try {
    await Orders.findByIdAndRemove(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
