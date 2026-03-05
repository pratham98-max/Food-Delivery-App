import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const CustomerHome = () => {
  const [location, setLocation] = useState('Detecting location...');
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Detect Real Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using OpenStreetMap's free API for reverse geocoding
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const address = res.data.address;
          setLocation(`${address.suburb || address.neighbourhood || ''}, ${address.city || address.town || ''}`);
        } catch (err) {
          console.error("Location error:", err);
          setLocation("Pune, Maharashtra"); // Fallback
        }
      }, () => {
        setLocation("Location Permission Denied");
      });
    }
  }, []);

  // 3. Fetch Restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/restaurant/all');
        setRestaurants(res.data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ background: 'var(--surface-white)', minHeight: '100vh' }}>
      
      {/* 🚀 Swiggy-Style Dynamic Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={locationBox}>
            <span style={locationLabel}>📍 {location}</span>
          </div>
        </div>

        <div style={navActions}>
          <input 
            type="text" 
            placeholder="Search for restaurants..." 
            style={headerSearchStyle}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {user ? (
            /* 👤 Logged In: Show Profile Icon */
            <div style={{ position: 'relative' }}>
              <div 
                style={profileCircle} 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.displayName ? user.displayName[0] : 'U'}
              </div>
              
              {showProfileMenu && (
                <div style={dropdownStyle}>
                  <div style={dropdownItem}>My Profile</div>
                  <div style={dropdownItem}>Orders</div>
                  <div style={{ ...dropdownItem, color: 'red' }} onClick={handleLogout}>Logout</div>
                </div>
              )}
            </div>
          ) : (
            /* 🔐 Guest: Show Login/Signup */
            <div style={{ display: 'flex', gap: '15px' }}>
              <button style={textBtn} onClick={() => navigate('/login')}>Login</button>
              <button style={primaryBtn} onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          )}
        </div>
      </header>

      {/* 🍱 Main Content */}
      <div style={{ padding: '40px 5%' }}>
        <h2 style={{ marginBottom: '30px', fontWeight: '800' }}>Popular Restaurants</h2>
        <div style={gridStyle}>
          {restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).map(hotel => (
            <div key={hotel._id} onClick={() => navigate(`/restaurant/${hotel._id}`)} style={hotelCardStyle}>
              <img src={hotel.image} alt={hotel.name} style={hotelImage} />
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0' }}>{hotel.name}</h4>
                <p style={cuisineText}>{hotel.cuisine}</p>
                <div style={ratingRow}>
                  <span style={starBadge}>★ {hotel.rating}</span>
                  <span style={deliveryText}>{hotel.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '15px 5%', background: 'white', position: 'sticky', top: 0, zIndex: 1000,
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

const locationBox = { borderBottom: '2px solid var(--text-dark)', cursor: 'pointer' };
const locationLabel = { fontSize: '14px', fontWeight: '800', color: 'var(--text-dark)' };

const navActions = { display: 'flex', alignItems: 'center', gap: '30px' };
const headerSearchStyle = { padding: '10px 20px', borderRadius: '8px', border: '1px solid #eee', background: '#f5f5f5', width: '250px' };

const profileCircle = {
  width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-blue)',
  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 'bold', cursor: 'pointer'
};

const dropdownStyle = {
  position: 'absolute', top: '50px', right: 0, background: 'white',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderRadius: '8px', width: '150px', overflow: 'hidden'
};

const dropdownItem = { padding: '12px 20px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' };

const textBtn = { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-dark)' };
const primaryBtn = { background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' };
const hotelCardStyle = { borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', transition: '0.3s' };
const hotelImage = { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '15px' };
const cuisineText = { color: '#666', fontSize: '14px', margin: '5px 0' };
const ratingRow = { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' };
const starBadge = { background: '#48c479', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };
const deliveryText = { fontSize: '12px', fontWeight: 'bold', color: '#555' };

export default CustomerHome;