import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        firebaseUid: user.uid,
        role: formData.role
      });
      
      alert("✅ Registration Successful!");
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: 'var(--primary-blue)', textAlign: 'center' }}>Join FreshDash</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input placeholder="Name" style={inputStyle} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <select style={inputStyle} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant Owner</option>
            <option value="delivery">Delivery Partner</option>
          </select>
          <button type="submit" style={buttonStyle}>Create Account</button>
        </form>
      </div>
    </div>
  );
};

const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, var(--surface-white) 0%, var(--mint-bg) 100%)' };
const cardStyle = { padding: '40px', background: 'white', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' };
const buttonStyle = { padding: '14px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' };

export default Signup;