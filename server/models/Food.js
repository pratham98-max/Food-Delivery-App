const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    restaurantId: { type: String, required: true }, // Links food to the restaurant owner
    image: { type: String, default: 'https://via.placeholder.com/150' },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', FoodSchema);