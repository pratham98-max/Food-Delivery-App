import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const resHotel = await axios.get(`http://localhost:5000/api/restaurant/${id}`);
        setRestaurant(resHotel.data);
        
        const resMenu = await axios.get(`http://localhost:5000/api/food/restaurant/${id}`);
        setMenu(resMenu.data);
      } catch (err) {
        console.error("Error loading restaurant details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Menu...</div>;
  if (!restaurant) return <div style={{ padding: '100px', textAlign: 'center' }}>Restaurant not found.</div>;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px' }}>
      {/* 🏨 Hotel Header */}
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '800' }}>{restaurant.name}</h1>
          <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>{restaurant.cuisine}</p>
          <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>{restaurant.location} • 2.5 km</p>
        </div>
        <div style={ratingBox}>
          <span style={{ color: '#48c479', fontWeight: 'bold' }}>★ {restaurant.rating || '4.0'}</span>
          <div style={{ borderTop: '1px solid #eee', marginTop: '5px', paddingTop: '5px', fontSize: '10px', color: '#888' }}>
            100+ ratings
          </div>
        </div>
      </header>

      {/* 🍱 Menu Section */}
      <h3 style={{ borderTop: '1px solid #eee', paddingTop: '30px', marginBottom: '20px' }}>
        Recommended ({menu.length})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {menu.map((dish) => (
          <div key={dish._id} style={dishRowStyle}>
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <div style={{ fontSize: '12px', color: '#ee9c00' }}>★ Recommended</div>
              <h4 style={{ margin: '5px 0', fontSize: '18px', color: '#3e4152' }}>{dish.name}</h4>
              <p style={{ fontWeight: 'bold', margin: '0 0 10px 0', fontSize: '15px' }}>${dish.price}</p>
              <p style={dishDescStyle}>{dish.description}</p>
            </div>
            <div style={dishImageContainer}>
              <img src={dish.image || 'https://via.placeholder.com/150'} alt={dish.name} style={dishImage} />
              <button style={addButtonStyle}>ADD</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Styles ---
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' };
const ratingBox = { border: '1px solid #eee', padding: '10px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const dishRowStyle = { display: 'flex', justifyContent: 'space-between', paddingBottom: '30px', borderBottom: '1px solid #f1f1f6' };
const dishDescStyle = { color: 'rgba(40, 44, 63, 0.45)', fontSize: '14px', lineHeight: '1.3', margin: 0 };
const dishImageContainer = { position: 'relative', width: '118px', height: '96px' };
const dishImage = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' };
const addButtonStyle = {
  position: 'absolute',
  bottom: '-10px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'white',
  color: '#6892D5',
  border: '1px solid #d4d5d9',
  padding: '8px 25px',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
};

export default RestaurantDetail;