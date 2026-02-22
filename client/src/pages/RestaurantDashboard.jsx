import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [food, setFood] = useState({ name: '', description: '', price: '', category: '' });
  const [myMenu, setMyMenu] = useState([]);

  // Fetch the menu items when the component loads
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/food/all');
        setMyMenu(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchMenu();
  }, []);

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      // In a real app, restaurantId comes from the logged-in user context
      await axios.post('http://localhost:5000/api/food/add', { ...food, restaurantId: "owner_123" });
      alert("✅ Delicious item added!");
      setFood({ name: '', description: '', price: '', category: '' }); // Clear form
      
      // Refresh the menu list immediately
      const res = await axios.get('http://localhost:5000/api/food/all');
      setMyMenu(res.data);
    } catch (err) {
      console.error(err);
      alert("Error adding food item.");
    }
  };

  return (
    <div style={{ padding: '40px', background: 'var(--surface-white)', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--primary-blue)', margin: 0 }}>👨‍🍳 Restaurant Portal</h1>
        <p style={{ color: 'var(--secondary-teal)' }}>Manage your fresh menu items below.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* Left: Add Food Form */}
        <section style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Add New Item</h3>
          <form onSubmit={handleAddFood} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              placeholder="Dish Name" 
              value={food.name} 
              style={inputStyle} 
              onChange={(e) => setFood({ ...food, name: e.target.value })} 
              required 
            />
            <input 
              placeholder="Price" 
              type="number" 
              value={food.price} 
              style={inputStyle} 
              onChange={(e) => setFood({ ...food, price: e.target.value })} 
              required 
            />
            <input 
              placeholder="Category (e.g., Healthy, Veg)" 
              value={food.category} 
              style={inputStyle} 
              onChange={(e) => setFood({ ...food, category: e.target.value })} 
              required 
            />
            <textarea 
              placeholder="Description" 
              value={food.description} 
              style={{ ...inputStyle, height: '80px' }} 
              onChange={(e) => setFood({ ...food, description: e.target.value })} 
              required 
            />
            <button type="submit" style={buttonStyle}>Add to Menu</button>
          </form>
        </section>

        {/* Right: Menu Preview */}
        <section>
          <h3>Your Current Menu</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {myMenu.map((item) => (
              <div 
                key={item._id} 
                style={{ 
                  background: 'var(--mint-bg)', 
                  padding: '15px', 
                  borderRadius: '12px', 
                  borderLeft: '8px solid var(--primary-blue)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-dark)' }}>
                  {item.category} • <strong>${item.price}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Styles defined locally to fix the 'not defined' errors ---
const cardStyle = { 
  padding: '25px', 
  background: 'white', 
  borderRadius: '15px', 
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
};

const inputStyle = { 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid #eee', 
  fontSize: '14px',
  outlineColor: 'var(--secondary-teal)'
};

const buttonStyle = { 
  padding: '12px', 
  background: 'var(--primary-blue)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  fontWeight: 'bold', 
  cursor: 'pointer' 
};

export default RestaurantDashboard;