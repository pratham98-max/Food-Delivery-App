const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

/**
 * @route   POST /api/food/add
 * @desc    Add a new dish linked to a specific restaurant
 * @access  Private (Restaurant Owners)
 */
router.post('/add', async (req, res) => {
  try {
    const { name, price, description, category, restaurantId, image } = req.body;

    const newFood = new Food({
      name,
      price,
      description,
      category,
      restaurantId, // Links the dish to the specific Hotel ID
      image
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    console.error("Add Food Error:", err.message);
    res.status(500).json({ message: "Failed to add food item to the menu" });
  }
});

/**
 * @route   GET /api/food/restaurant/:restaurantId
 * @desc    Get all dishes for a specific restaurant (Used for Restaurant Detail Page)
 * @access  Public
 */
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const foodItems = await Food.find({ restaurantId });
    
    if (!foodItems) {
      return res.status(404).json({ message: "No menu items found for this restaurant" });
    }

    res.status(200).json(foodItems);
  } catch (err) {
    console.error("Fetch Restaurant Menu Error:", err.message);
    res.status(500).json({ message: "Error fetching restaurant menu" });
  }
});

/**
 * @route   GET /api/food/all
 * @desc    Get all dishes across all restaurants (Optional discovery)
 * @access  Public
 */
router.get('/all', async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    console.error("Fetch All Food Error:", err.message);
    res.status(500).json({ message: "Error fetching all food items" });
  }
});

module.exports = router;