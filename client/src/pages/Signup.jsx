import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  // We use a function for "Lazy Initialization" to keep React happy
  const [formData, setFormData] = useState(() => ({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  }));

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Prepare data for MongoDB (using the real UID from Firebase)
      const mongoData = {
        name: formData.name,
        email: formData.email,
        firebaseUid: user.uid, 
        role: formData.role
      };

      // 3. Save to your Backend
      await axios.post('http://localhost:5000/api/auth/signup', mongoData);
      
      alert("✅ Registration Successful!");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Signup Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant Owner</option>
          <option value="delivery">Delivery Partner</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: '#e03d3d', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;