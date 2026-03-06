import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, decrementQuantity, cartItems, getCartTotal } = useCart(); 

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resRest = await axios.get(`http://localhost:5000/api/restaurant/${id}`);
        setRestaurant(resRest.data);
        const resMenu = await axios.get(`http://localhost:5000/api/food/restaurant/${id}`);
        setMenu(resMenu.data);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Helper to find existing quantity of an item
  const getItemQuantity = (itemId) => {
    const item = cartItems.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) return <div style={centerMsg}>Loading Menu...</div>;
  if (!restaurant) return <div style={centerMsg}>Restaurant not found.</div>;

  return (
    <div style={containerStyle}>
      {/* 🏨 Restaurant Info Header */}
      <header style={headerSection}>
        <div style={headerText}>
          <h1 style={restName}>{restaurant.name}</h1>
          <p style={restCuisine}>{restaurant.cuisine}</p>
          <p style={restLoc}>{restaurant.location}</p>
          <div style={statsRow}>
            <span style={starBadge}>★ {restaurant.rating}</span>
            <span style={deliveryText}>| {restaurant.deliveryTime}</span>
          </div>
        </div>
        <img src={restaurant.image} alt={restaurant.name} style={headerImg} />
      </header>

      <hr style={divider} />

      {/* 🍱 Menu List */}
      <div style={menuSection}>
        <h2 style={menuTitle}>Menu</h2>
        {menu.length === 0 ? (
          <p>No items available.</p>
        ) : (
          menu.map((item) => {
            const qty = getItemQuantity(item._id);
            return (
              <div key={item._id} style={foodCard}>
                <div style={foodInfo}>
                  <h3 style={foodNameStyle}>{item.name}</h3>
                  <p style={foodPrice}>₹{item.price}</p>
                  <p style={foodDesc}>{item.description}</p>
                </div>
                <div style={imgWrapper}>
                  <img src={item.image} alt={item.name} style={foodImg} />
                  
                  {/* Toggle between ADD button and Qty Selector */}
                  {qty === 0 ? (
                    <button style={addBtn} onClick={() => addToCart(item)}>
                      ADD +
                    </button>
                  ) : (
                    <div style={qtySelector}>
                      <button style={qtyBtn} onClick={() => decrementQuantity(item._id)}>−</button>
                      <span style={qtyCount}>{qty}</span>
                      <button style={qtyBtn} onClick={() => addToCart(item)}>+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🛒 Floating Cart Strip (Shows if items > 0) */}
      {cartItems.length > 0 && (
        <div style={cartStrip}>
          <div style={cartDetails}>
            <span style={cartSummary}>{cartItems.length} Item{cartItems.length > 1 ? 's' : ''}</span>
            <span style={cartAmount}> | ₹{getCartTotal()}</span>
          </div>
          <button style={viewCartBtn} onClick={() => navigate('/checkout')}>
            VIEW CART 🛒
          </button>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const containerStyle = { padding: '20px 15%', minHeight: '100vh', paddingBottom: '120px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontSize: '20px', fontWeight: 'bold' };

const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' };
const headerText = { flex: 1 };
const restName = { fontSize: '32px', fontWeight: '800', margin: '0 0 5px 0' };
const restCuisine = { color: '#666', margin: '0' };
const restLoc = { color: '#888', fontSize: '14px' };
const statsRow = { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' };
const starBadge = { background: '#48c479', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' };
const deliveryText = { fontWeight: 'bold', color: '#555' };
const headerImg = { width: '250px', height: '160px', borderRadius: '15px', objectFit: 'cover' };

const divider = { border: '0.5px solid #eee', margin: '40px 0' };

const menuSection = { display: 'flex', flexDirection: 'column', gap: '20px' };
const menuTitle = { fontSize: '24px', fontWeight: '800' };

const foodCard = { display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #f5f5f5' };
const foodInfo = { flex: 1, paddingRight: '20px' };
const foodNameStyle = { margin: '0 0 5px 0', fontSize: '18px' };
const foodPrice = { fontWeight: 'bold', color: '#333' };
const foodDesc = { color: '#888', fontSize: '14px', marginTop: '10px' };

const imgWrapper = { position: 'relative', width: '120px' };
const foodImg = { width: '120px', height: '100px', borderRadius: '12px', objectFit: 'cover' };

// Buttons & Selectors
const addBtn = {
  position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
  background: 'white', color: '#6892D5', border: '1px solid #ddd',
  padding: '8px 25px', borderRadius: '8px', fontWeight: 'bold',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)', cursor: 'pointer'
};

const qtySelector = {
  position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
  background: 'white', color: '#6892D5', border: '1px solid #ddd',
  borderRadius: '8px', display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', width: '100px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)', overflow: 'hidden'
};

const qtyBtn = { background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer', color: '#6892D5', fontWeight: 'bold' };
const qtyCount = { fontWeight: 'bold', color: '#333' };

// Cart Strip
const cartStrip = {
  position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
  width: '70%', background: '#6892D5', color: 'white', padding: '15px 30px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 2000
};
const cartDetails = { display: 'flex', alignItems: 'center' };
const cartSummary = { fontWeight: 'bold', fontSize: '16px' };
const cartAmount = { fontSize: '16px' };
const viewCartBtn = { background: 'none', border: 'none', color: 'white', fontWeight: '900', cursor: 'pointer', fontSize: '16px' };

export default RestaurantDetail;