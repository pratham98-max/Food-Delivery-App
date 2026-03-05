const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7ed9d42339?w=500' },
  ownerId: { type: String, required: true, unique: true }, // Linked to User firebaseUid
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: String, default: '25-30 mins' }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);