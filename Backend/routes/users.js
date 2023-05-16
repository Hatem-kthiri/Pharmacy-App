// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const nodemailer = require("nodemailer");
const authenticateUser = require("../middleware/verifyToken");

const router = express.Router();

// Register a new user
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        role: req.body.role,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// Create a new user from admin
router.post("/add-new-user", async (req, res) => {
  try {
    const { name, email, role, location, phone } = req.body;
    // Generate a random password
    console.log(req.body);
    const password = Math.random().toString(36).slice(-8);
    await User.findOne({ email }).then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role,
          location,
          phone,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save();
          });
        });
        const user = { email: req.body.email, password: password };
        console.log(user);
        res.status(200).json(user);
      }
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
// User login
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3d" }, // Token expiration time (in seconds)
          (err, token) => {
            res.json({
              success: true,
              token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// Get all Pharmacy Users
router.get("/all-pharmacy", (req, res) => {
  User.find({ role: "pharmacy" }, { password: 0 })
    .then((users) => res.json(users))
    .catch((err) => res.status(404).json({ error: "No users found" }));
});
// Get all Provider Users
router.get("/all-providers", (req, res) => {
  User.find({ role: "provider" }, { password: 0 })
    .then((users) => res.json(users))
    .catch((err) => res.status(404).json({ error: "No users found" }));
});

// Edit user information
router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => res.json({ message: "User updated." }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the user" })
    );
});

// Delete user
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.json({ success: true, message: "User Deleted." }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to delete the user" })
    );
});

// get User Info
router.get("/", authenticateUser, async (req, res) => {
  try {
    const info = await User.findById(req.user.id);
    res.status(200).json(info);
  } catch (err) {
    res.json({ error: "Unable to get Information" });
  }
});
module.exports = router;
