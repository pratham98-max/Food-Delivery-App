import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerHome = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all food items from the backend
    const fetchFoods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/food/all');
        setFoods(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching food:", err);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) return <p>Loading delicious food...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🍱 Available Dishes</h1>
      <p>Explore variety of meals from our partner restaurants.</p>

      {foods.length === 0 ? (
        <p>No food items available yet. Wait for restaurants to add items!</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px' 
        }}>
          {foods.map((item) => (
            <div key={item._id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '10px', 
              padding: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{item.name}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{item.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>${item.price}</span>
                <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{item.category}</span>
              </div>
              <button style={{ 
                width: '100%', 
                marginTop: '10px', 
                backgroundColor: '#e03d3d', 
                color: 'white', 
                border: 'none', 
                padding: '8px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHome;