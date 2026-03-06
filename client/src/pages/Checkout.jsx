import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Your cart is empty!</h2>
        <button onClick={() => navigate('/home')} style={{ marginTop: '20px', padding: '10px 20px', background: '#6892D5', color: 'white', border: 'none', borderRadius: '5px' }}>
          Go Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 10%' }}>
      <h1>Secure Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', marginTop: '30px' }}>
        
        {/* Left: Address & Payment */}
        <div>
          <div style={sectionBox}>
            <h3>Delivery Address</h3>
            <p style={{ color: '#666' }}>Pune, Maharashtra, India</p>
          </div>
          <div style={sectionBox}>
            <h3>Payment Method</h3>
            <p style={{ color: '#666' }}>Cash on Delivery (Available)</p>
          </div>
          <button 
            style={orderBtn} 
            onClick={() => { alert("Order Placed Successfully!"); clearCart(); navigate('/home'); }}
          >
            CONFIRM ORDER
          </button>
        </div>

        {/* Right: Bill Details */}
        <div style={billBox}>
          <h3>Bill Details</h3>
          {cartItems.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total to Pay</span>
            <span>₹{getCartTotal()}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

const sectionBox = { background: 'white', padding: '20px', border: '1px solid #eee', marginBottom: '20px', borderRadius: '10px' };
const billBox = { background: '#f9f9f9', padding: '30px', borderRadius: '10px', height: 'fit-content' };
const orderBtn = { width: '100%', padding: '15px', background: '#48c479', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', marginTop: '20px' };

export default Checkout;