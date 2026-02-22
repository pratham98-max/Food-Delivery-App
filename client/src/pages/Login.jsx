import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase'; //
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; //
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Email and Password Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); //
      const firebaseUser = userCredential.user;

      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email: firebaseUser.email 
      }); //

      const { role, name } = res.data;
      alert(`Welcome back, ${name}!`);

      if (role === 'customer') navigate('/home');
      else if (role === 'restaurant') navigate('/restaurant-dashboard');
      else navigate('/delivery-dashboard');

    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Google Login Logic
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); //
      const user = result.user;

      // Check MongoDB for the role
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email: user.email 
      });

      const { role } = res.data;
      if (role === 'customer') navigate('/home');
      else if (role === 'restaurant') navigate('/restaurant-dashboard');
      else navigate('/delivery-dashboard');

    } catch (err) {
      alert("Google Login Failed: " + (err.response?.data?.message || "Ensure you have signed up first!"));
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
          <button type="submit" style={buttonStyle}>Login</button>
        </form>

        <div style={{ margin: '15px 0', textAlign: 'center', color: '#888' }}>OR</div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin} 
          type="button"
          style={googleButtonStyle}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="" style={{width: '18px', marginRight: '10px'}} />
          Sign in with Google
        </button>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <span 
            onClick={() => navigate('/signup')} 
            style={{ color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 'bold' }}
          >Sign up</span>
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
  fontSize: '16px'
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

export default Login;