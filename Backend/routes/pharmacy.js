const express = require("express");
const router = express.Router();
const PharmacyStock = require("../models/PharmacyStock");
const Product = require("../models/Product");
const authenticateUser = require("../middleware/verifyToken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Get all products provided by the current pharmacy
router.get("/get-products", authenticateUser, async (req, res) => {
  try {
    const products = await PharmacyStock.find({ pharmacy: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/get-all-products", authenticateUser, async (req, res) => {
  try {
    const products = await Product.find({}).populate(
      "provider",
      "_id name email location phone"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: "druwnoihv",
  api_key: "329499199596467",
  api_secret: "_alusXCm8XymJ6jjEP58_EzGzrg",
});

// Configure multer to handle file upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products-image", // Specify the folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "gif", "webp"], // Specify the allowed image formats
    public_id: (req, file) => Math.random(), // Generate a unique public ID for each uploaded file
  },
});
// Set up Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the destination folder for uploaded files
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     // Define the filename for uploaded files
//     cb(null, file.originalname);
//   },
// });
const upload = multer({ storage: storage });

// Create a new product for the current provider
router.post(
  "/add-product",
  authenticateUser,
  upload.single("productImage"),
  async (req, res) => {
    try {
      const { name, description, quantity, price, expiryDate } = req.body;

      const product = new PharmacyStock({
        name: name,
        productImage: req.file.path,
        description: description,
        quantity: quantity,
        price: price,
        expiryDate: expiryDate,
        pharmacy: req.user.id, // Associate the product with the current provider
      });

      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update a product provided by the current provider
router.put(
  "/edit-product/:id",
  authenticateUser,
  upload.single("productImage"),
  async (req, res) => {
    try {
      if (req.file) {
        const updatedProduct = await PharmacyStock.findByIdAndUpdate(
          req.params.id,
          {
            productImage: req.file.path,
            ...req.body,
          }
        );
        res.json(updatedProduct);
      } else {
        const updatedProduct = await PharmacyStock.findByIdAndUpdate(
          req.params.id,
          {
            ...req.body,
          }
        );
        res.json(updatedProduct);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete a product provided by the current provider
router.delete("/delete-product/:id", authenticateUser, async (req, res) => {
  try {
    await PharmacyStock.findByIdAndRemove(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
