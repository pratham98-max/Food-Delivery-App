import React, { useState } from 'react';
import { auth } from '../firebase'; // Ensure this path is correct based on your folder structure
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
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: 'var(--primary-blue)', textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={inputStyle}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Don't have an account? <span 
            onClick={() => navigate('/signup')} 
            style={{ color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 'bold' }}
          >Sign up</span>
        </p>
      </div>
    </div>
  );
};

// --- Styles defined locally to fix the 'not defined' error ---
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
  fontSize: '16px'
};

const buttonStyle = { 
  padding: '14px', 
  background: 'var(--primary-blue)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer'
};

export default Login;