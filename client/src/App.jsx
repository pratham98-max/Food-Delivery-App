import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CustomerHome from './pages/CustomerHome';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ 
          padding: '1rem 2rem', 
          background: 'var(--primary-blue)', 
          color: 'white', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: 0 }}>🌿 FreshDash</h2>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
            <Link to="/login" style={{ 
              background: 'var(--mint-bg)', 
              color: 'var(--text-dark)', 
              padding: '6px 18px', 
              borderRadius: '20px', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>Login</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<div style={{padding: '50px', textAlign: 'center'}}><h1>Welcome to FreshDash</h1><p>Fresh meals, fast delivery.</p></div>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<CustomerHome />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;