import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CustomerHome from './pages/CustomerHome';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 Step 1: Import the new protector

function App() {
  return (
    <Router>
      <div className="App">
        {/* We do NOT have a global navbar here. 
            Each page handles its own specific header. */}
        <Routes>
          {/* Public Routes: Anyone can see these */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes: User MUST login or sign up first */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <CustomerHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurant-dashboard" 
            element={
              <ProtectedRoute>
                <RestaurantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/delivery-dashboard" 
            element={
              <ProtectedRoute>
                <DeliveryDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/restaurant/:id" 
            element={
              <ProtectedRoute>
                <RestaurantDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;