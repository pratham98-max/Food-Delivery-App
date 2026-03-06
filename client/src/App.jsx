import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CustomerHome from './pages/CustomerHome';
import RestaurantDashboard from './pages/RestaurantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import { CartProvider } from './context/CartProvider'; // Updated import path

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

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
            
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;