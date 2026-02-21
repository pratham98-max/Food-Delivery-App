const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user with a specific role
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, firebaseUid, role } = req.body;

    // 1. Check if the user already exists in MongoDB
    let user = await User.findOne({ firebaseUid });
    if (user) {
      return res.status(400).json({ message: "User already exists in database" });
    }

    // 2. Create and save the new user
    user = new User({
      name,
      email,
      firebaseUid,
      role // 'customer', 'restaurant', or 'delivery'
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error during signup" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Verify user existence and return role for redirection
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // 2. Return the role and name to the frontend
    // The frontend uses this 'role' to navigate to the correct dashboard
    res.status(200).json({
      name: user.name,
      role: user.role,
      firebaseUid: user.firebaseUid
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;