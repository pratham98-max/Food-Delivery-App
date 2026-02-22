import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Logic for standard Email/Password Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      const mongoData = {
        name: formData.name,
        email: formData.email,
        firebaseUid: user.uid, 
        role: formData.role
      };

      await axios.post('http://localhost:5000/api/auth/signup', mongoData);
      
      alert("✅ Registration Successful!");
      navigate('/login');
    } catch (err) {
      alert("Signup Error: " + err.message);
    }
  };

  // Logic for Google Signup
  const handleGoogleSignup = async () => {
    try {
      // 1. Authenticate with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Prepare data for MongoDB using the selected role
      const mongoData = {
        name: user.displayName, // Get name from Google profile
        email: user.email,
        firebaseUid: user.uid,
        role: formData.role // Role selected from the dropdown
      };

      // 3. Save to your Backend
      await axios.post('http://localhost:5000/api/auth/signup', mongoData);
      
      alert(`✅ Welcome ${user.displayName}! Account created as ${formData.role}.`);
      
      // Redirect based on role immediately
      if (formData.role === 'customer') navigate('/home');
      else if (formData.role === 'restaurant') navigate('/restaurant-dashboard');
      else navigate('/delivery-dashboard');

    } catch (err) {
      console.error(err);
      alert("Google Signup Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: 'var(--primary-blue)', textAlign: 'center', marginBottom: '20px' }}>Join FreshDash</h2>
        
        {/* Step 1: User chooses role first */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', color: '#666' }}>I am joining as a:</label>
          <select name="role" style={inputStyle} value={formData.role} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant Owner</option>
            <option value="delivery">Delivery Partner</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input name="name" placeholder="Full Name" style={inputStyle} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" style={inputStyle} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" style={inputStyle} onChange={handleChange} required />
          <button type="submit" style={buttonStyle}>Sign Up with Email</button>
        </form>

        <div style={{ margin: '15px 0', textAlign: 'center', color: '#888' }}>OR</div>

        {/* Google Signup Button */}
        <button 
          onClick={handleGoogleSignup} 
          type="button"
          style={googleButtonStyle}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="" style={{width: '18px', marginRight: '10px'}} />
          Sign up with Google
        </button>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <span 
            onClick={() => navigate('/login')} 
            style={{ color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 'bold' }}
          >Login</span>
        </p>
      </div>
    </div>
  );
};

// --- Theme Styles ---
const containerStyle = { 
  minHeight: '80vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  background: 'linear-gradient(135deg, var(--surface-white) 0%, var(--mint-bg) 100%)' 
};

const cardStyle = { 
  padding: '40px', 
  background: 'white', 
  borderRadius: '15px', 
  boxShadow: '0 8px 30px rgba(0,0,0,0.05)', 
  width: '100%', 
  maxWidth: '400px' 
};

const inputStyle = { 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid #ddd',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box'
};

const buttonStyle = { 
  padding: '14px', 
  background: 'var(--primary-blue)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  fontWeight: 'bold',
  cursor: 'pointer'
};

const googleButtonStyle = {
  ...buttonStyle,
  background: 'white',
  color: '#444',
  border: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
};

export default Signup;