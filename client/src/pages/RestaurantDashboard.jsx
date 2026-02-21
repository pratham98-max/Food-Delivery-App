import React, { useState } from 'react';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [food, setFood] = useState({ name: '', description: '', price: '', category: '' });

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      // In a real app, restaurantId comes from the logged-in user context
      const foodData = { ...food, restaurantId: "owner_123" };
      await axios.post('http://localhost:5000/api/food/add', foodData);
      alert("✅ Dish added successfully to your menu!");
      setFood({ name: '', description: '', price: '', category: '' }); // Clear form
    } catch (err) {
      console.error(err);
      alert("Error adding food item.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>👨‍🍳 Restaurant Control Panel</h1>
      
      <div style={{ maxWidth: '500px', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
        <h3>Add New Dish</h3>
        <form onSubmit={handleAddFood} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Dish Name" value={food.name} onChange={(e)=>setFood({...food, name: e.target.value})} required />
          <input placeholder="Price" type="number" value={food.price} onChange={(e)=>setFood({...food, price: e.target.value})} required />
          <input placeholder="Category (e.g. Italian)" value={food.category} onChange={(e)=>setFood({...food, category: e.target.value})} required />
          <textarea placeholder="Short Description" value={food.description} onChange={(e)=>setFood({...food, description: e.target.value})} required />
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', cursor: 'pointer' }}>Add to Menu</button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantDashboard;