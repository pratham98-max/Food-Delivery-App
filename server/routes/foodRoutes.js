const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

router.post('/add', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(500).json({ message: "Failed to add food" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;