const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

/**
 * @route   POST /api/restaurant/create
 * @desc    Create a new restaurant profile
 * @access  Private (Restaurant Owners)
 */
router.post('/create', async (req, res) => {
  try {
    const { name, location, cuisine, ownerId } = req.body;

    // Check if owner already has a restaurant
    let existingRestaurant = await Restaurant.findOne({ ownerId });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Owner already has a restaurant registered." });
    }

    const newRestaurant = new Restaurant({
      name,
      location,
      cuisine,
      ownerId
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    console.error("Restaurant Creation Error:", err.message);
    res.status(500).json({ message: "Server error during restaurant creation" });
  }
});

/**
 * @route   GET /api/restaurant/owner/:ownerId
 * @desc    Get restaurant details by owner's Firebase UID
 */
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.params.ownerId });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found." });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching restaurant" });
  }
});

/**
 * @route   GET /api/restaurant/all
 * @desc    Get all restaurants for the Customer Home Page
 */
router.get('/all', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching all restaurants" });
  }
});

/**
 * @route   GET /api/restaurant/:id
 * @desc    Get a single restaurant's details by its MongoDB ID
 */
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching restaurant details" });
  }
});

module.exports = router;