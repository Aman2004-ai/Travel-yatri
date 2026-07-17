const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/auth/me
// @desc    Get user data
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user info error:", err);
    res.status(500).json({ message: "Server error getting user profile" });
  }
});

module.exports = router;
