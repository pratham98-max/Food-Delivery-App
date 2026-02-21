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
        {/* Simple Navigation for testing */}
        <nav style={{ padding: '15px', background: '#333', color: '#fff', display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: '#fff' }}>Home</Link>
          <Link to="/signup" style={{ color: '#fff' }}>Sign Up</Link>
          <Link to="/login" style={{ color: '#fff' }}>Login</Link>
        </nav>

        <Routes>
          <Route path="/" element={<div style={{padding: '20px'}}><h1>🍔 FoodDash Main Page</h1><p>Please Login or Sign Up.</p></div>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Role-Based Dashboard Routes */}
          <Route path="/home" element={<CustomerHome />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;