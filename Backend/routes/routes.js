const router = require("express").Router();

const Admin = require("../models/Admin");
const Offer = require("../models/Offer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin) {
      bcrypt.compare(password, admin.password, async (err, result) => {
        if (err) {
          res.status(500).json({
            status: false,
            message: err,
          });
        } else if (result) {
          const token = jwt.sign(
            { id: admin._id, role: admin.role, email },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "7d",
            }
          );
          res.status(200).json({
            status: true,
            message: "you are logged in as Admin",
            data: token,
          });
        } else {
          res.status(401).json({
            staus: false,
            message: "invalid credentials",
          });
        }
      });
    } else {
      res.status(404).json({
        status: false,
        message: "invalid credentials",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
});

// Admin APIs
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) {
        res.status(500).json({ status: false, message: err });
      } else if (hash) {
        const admin = await Admin.create({
          email,
          password: hash,
        });
        res.status(201).json({
          status: true,
          message: "Admin Created ",
          data: admin,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: err });
  }
});
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.YOUR_CLOUD_NAME,
  api_key: process.env.YOUR_API_KEY,
  api_secret: process.env.YOUR_API_SECRET,
});
// Configure multer to handle file upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "offer-logos",
    format: async (req, file) => "png", // or any desired image format
    public_id: (req, file) => file.originalname, // use the original filename as the Cloudinary public ID
  },
});
const upload = multer({ storage: storage });

router.post("/create-offer", upload.single("companyLogo"), async (req, res) => {
  try {
    const { offerName, companyName, desc, jobType, location, date } = req.body;
    // Create a new offer document
    const newOffer = await Offer.create({
      companyLogo: req.file.path,
      offerName,
      companyName,
      desc,
      jobType,
      location,
      date,
    });
    // Save the offer to the database

    res.status(201).json({ message: "Offer Added Success", newOffer });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get-offers", async (req, res) => {
  try {
    const offers = await Offer.find({});
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.put(
  "/update-offer/:id",
  upload.single("companyLogo"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const oldOffer = await Offer.findById(id);
      if (oldOffer) {
        if (oldOffer.companyLogo == req.body.companyLogo) {
          const updateOffer = await Offer.findByIdAndUpdate(id, {
            ...req.body,
          });
          res
            .status(200)
            .json({ message: "Offer Success Updated ", updateOffer });
        } else {
          const { offerName, companyName, desc, jobType, location, date } =
            req.body;
          const updateOffer = await Offer.findByIdAndUpdate(id, {
            companyLogo: req.file.path,
            offerName,
            companyName,
            desc,
            jobType,
            location,
            date,
          });
          res
            .status(200)
            .json({ message: "Offer Success Updated ", updateOffer });
        }
      } else {
        res.status(404).send(err);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.delete("/delete-offer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOffer = await Offer.findByIdAndDelete(id);
    res.status(200).json({ message: "offer deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
