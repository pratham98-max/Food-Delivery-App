const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

/**
 * @route   POST /api/food/add
 * @desc    Add a new dish to a restaurant's menu
 */
router.post('/add', async (req, res) => {
  try {
    const { name, description, price, category, restaurantId } = req.body;

    // Create a new food item instance
    const newFood = new Food({
      name,
      description,
      price,
      category,
      restaurantId // In Phase 2, this will be the ID of the logged-in owner
    });

    // Save to MongoDB
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    console.error("Food Add Error:", err.message);
    res.status(500).json({ message: "Failed to add food item to database." });
  }
});

/**
 * @route   GET /api/food/all
 * @desc    Get all food items (for the Customer Dashboard)
 */
router.get('/all', async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;