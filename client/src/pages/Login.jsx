import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Fetch the Role from your MongoDB Backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email: firebaseUser.email 
      });

      const { role, name } = res.data;
      alert(`Welcome back, ${name}!`);

      // 3. Redirect based on the role stored in MongoDB
      if (role === 'customer') navigate('/home');
      else if (role === 'restaurant') navigate('/restaurant-dashboard');
      else if (role === 'delivery') navigate('/delivery-dashboard');

    } catch (err) {
      console.error(err);
      alert("Login Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email Address" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;