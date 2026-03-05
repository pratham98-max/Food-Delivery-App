import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase'; // Ensure your firebase config exports 'auth'

const RestaurantDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [hotelForm, setHotelForm] = useState({ name: '', location: '', cuisine: '' });
  const [food, setFood] = useState({ name: '', description: '', price: '', category: '' });
  const [myMenu, setMyMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Check if the logged-in user already has a registered restaurant
  useEffect(() => {
    const checkRestaurant = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const res = await axios.get(`http://localhost:5000/api/restaurant/owner/${user.uid}`);
          if (res.data) {
            setRestaurant(res.data);
            fetchMenu(res.data._id);
          }
        }
      } catch (err) {
        // FIXED: Log the error so 'err' is used
        console.error("No restaurant profile found yet:", err); 
      } finally {
        setLoading(false);
      }
    };
    checkRestaurant();
  }, []);

  // 2. Fetch dishes specifically for this restaurant
  const fetchMenu = async (restaurantId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/food/restaurant/${restaurantId}`);
      setMyMenu(res.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  // 3. Handle Hotel Creation
  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const res = await axios.post('http://localhost:5000/api/restaurant/create', {
        ...hotelForm,
        ownerId: user.uid
      });
      setRestaurant(res.data);
      alert("🎉 Restaurant registered successfully!");
    } catch (err) {
      console.error("Creation Error:", err);
      alert("Error creating restaurant profile.");
    }
  };

  // 4. Handle Adding Dishes
  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/food/add', { 
        ...food, 
        restaurantId: restaurant._id 
      });
      alert("✅ Dish added to your menu!");
      setFood({ name: '', description: '', price: '', category: '' }); 
      fetchMenu(restaurant._id); 
    } catch (err) {
      console.error("Add Food Error:", err);
      alert("Error adding food item.");
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  if (!restaurant) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: 'var(--primary-blue)', textAlign: 'center' }}>Setup Your Restaurant</h2>
          <form onSubmit={handleCreateHotel} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              placeholder="Restaurant Name" 
              style={inputStyle} 
              onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })} 
              required 
            />
            <input 
              placeholder="Location" 
              style={inputStyle} 
              onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })} 
              required 
            />
            <input 
              placeholder="Cuisines" 
              style={inputStyle} 
              onChange={(e) => setHotelForm({ ...hotelForm, cuisine: e.target.value })} 
              required 
            />
            <button type="submit" style={buttonStyle}>Create Restaurant Profile</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: 'var(--surface-white)', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--primary-blue)', margin: 0 }}>👨‍🍳 {restaurant.name} Portal</h1>
        <p style={{ color: 'var(--secondary-teal)' }}>{restaurant.cuisine} • {restaurant.location}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        <section style={cardStyle}>
          <h3>Add New Dish</h3>
          <form onSubmit={handleAddFood} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input placeholder="Dish Name" value={food.name} style={inputStyle} onChange={(e) => setFood({ ...food, name: e.target.value })} required />
            <input placeholder="Price" type="number" value={food.price} style={inputStyle} onChange={(e) => setFood({ ...food, price: e.target.value })} required />
            <input placeholder="Category" value={food.category} style={inputStyle} onChange={(e) => setFood({ ...food, category: e.target.value })} required />
            <textarea placeholder="Description" value={food.description} style={{ ...inputStyle, height: '80px' }} onChange={(e) => setFood({ ...food, description: e.target.value })} required />
            <button type="submit" style={buttonStyle}>Add to Menu</button>
          </form>
        </section>

        <section>
          <h3>Active Menu Items</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {myMenu.map((item) => (
              <div key={item._id} style={menuItemStyle}>
                <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>{item.category} • <strong>${item.price}</strong></p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Styles (same as before)
const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const cardStyle = { padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' };
const buttonStyle = { padding: '12px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const menuItemStyle = { background: 'var(--mint-bg)', padding: '15px', borderRadius: '12px', borderLeft: '8px solid var(--primary-blue)' };

export default RestaurantDashboard;