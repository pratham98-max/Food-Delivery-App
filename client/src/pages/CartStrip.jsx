import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * CartStrip Component
 * A floating bar that appears at the bottom of the screen when items are in the cart.
 */
const CartStrip = () => {
  const navigate = useNavigate();
  // Access cart data from the global context
  const { cartItems, getCartTotal } = useCart();

  // If the cart is empty, do not render the strip
  if (cartItems.length === 0) return null;

  return (
    <div style={stripStyle}>
      <div style={cartInfo}>
        <span style={itemCount}>
          {cartItems.length} Item{cartItems.length > 1 ? 's' : ''}
        </span>
        <span style={priceText}> | ₹{getCartTotal()}</span>
      </div>
      
      <button 
        style={viewCartBtn} 
        onClick={() => navigate('/checkout')}
      >
        VIEW CART 🛒
      </button>
    </div>
  );
};

// --- Styles (Matching your FreshDash theme) ---
const stripStyle = {
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: '800px',
  background: '#6892D5', // var(--primary-blue)
  color: 'white',
  padding: '15px 25px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  zIndex: 1000,
  animation: 'slideUp 0.3s ease-out'
};

const cartInfo = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
  fontWeight: '600'
};

const itemCount = {
  marginRight: '5px'
};

const priceText = {
  opacity: 0.9
};

const viewCartBtn = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontWeight: '800',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

export default CartStrip;