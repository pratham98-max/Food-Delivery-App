import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../firebase'; //
import { onAuthStateChanged } from 'firebase/auth';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationInput, setLocationInput] = useState("");
  const [restaurantQuery, setRestaurantQuery] = useState("");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const address = res.data.address;
            const displayAddress = `${address.suburb || address.neighbourhood || ''}, ${address.city || address.town || ''}`;
            setLocationInput(displayAddress);
          } catch (err) {
            console.error("Location error:", err);
          } finally {
            setDetecting(false);
          }
        },
        () => {
          setDetecting(false);
        }
      );
    }
  };

  const handleSearchClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/home');
    }
  };

  return (
    <div style={{ background: 'var(--surface-white)', minHeight: '100vh' }}>
      
      {/* 🟢 HERO SECTION */}
      <section style={heroSection}>
        <div style={heroLeft}>
          <div style={topNav}>
            <h2 style={{ color: 'var(--primary-blue)', fontWeight: '900', fontSize: '32px', margin: 0 }}>🌿 FreshDash</h2>
            
            <div style={authButtons}>
              {!loading && (
                <>
                  {user ? (
                    <div onClick={() => navigate('/home')} style={profileWrapper}>
                      <img 
                        src={user.photoURL || "https://via.placeholder.com/45"} 
                        alt="Profile" 
                        style={profileImage}
                      />
                      <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>Dashboard</span>
                    </div>
                  ) : (
                    <>
                      <button style={loginBtn} onClick={() => navigate('/login')}>Login</button>
                      <button style={signupBtn} onClick={() => navigate('/signup')}>Sign Up</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={heroContent}>
            <h1 style={mainHeadline}>Hungry?</h1>
            <h3 style={subHeadline}>Order food from favourite restaurants near you.</h3>
            
            <div style={dualBarContainer}>
              <div style={locationBar}>
                <input 
                  type="text" 
                  placeholder="Delivery location" 
                  style={inputStyle}
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
                <button style={detectAction} onClick={handleDetectLocation} disabled={detecting}>
                  {detecting ? "..." : "🎯 Detect"}
                </button>
              </div>

              <div style={searchBar}>
                <input 
                  type="text" 
                  placeholder="Search for restaurant, cuisine or a dish" 
                  style={inputStyle}
                  value={restaurantQuery}
                  onChange={(e) => setRestaurantQuery(e.target.value)}
                />
                <button style={findFoodBtn} onClick={handleSearchClick}>
                  FIND FOOD
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={heroRight}>
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" 
            alt="Fresh Meals" 
            style={heroImg} 
          />
        </div>
      </section>

      {/* 🍕 NEW: WHAT'S ON YOUR MIND SECTION */}
      {user && (
        <section style={mindSection}>
          <h2 style={mindTitle}>
            {user.displayName ? user.displayName.split(' ')[0] : 'User'}, what's on your mind?
          </h2>
          <div style={foodScroll}>
            {[
              { name: 'Biryani', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1675667625/PC_Creative%20refresh/North_Indian_4.png' },
              { name: 'Pizza', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_OTG/Pizza.png' },
              { name: 'Burgers', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029845/PC_Creative%20refresh/3D_OTG/Burger.png' },
              { name: 'Cakes', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029844/PC_Creative%20refresh/3D_OTG/Cakes.png' },
              { name: 'Chinese', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029848/PC_Creative%20refresh/3D_OTG/Chinese.png' },
              { name: 'Dosa', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029850/PC_Creative%20refresh/3D_OTG/Dosa.png' }
            ].map((item, index) => (
              <div key={index} style={foodItem} onClick={() => navigate('/home')}>
                <img src={item.img} alt={item.name} style={foodCircleImg} />
                <p style={foodName}>{item.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔵 FEATURES SECTION */}
      <section style={featuresContainer}>
        <div style={featureCard}>
          <img src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_210,h_303/No_min_order_x0bxuf" alt="No Min Order" style={featIcon}/>
          <h3 style={featTitle}>No Minimum Order</h3>
          <p style={featDesc}>Order in for yourself or for the group, with no restrictions on order value.</p>
        </div>
        <div style={featureCard}>
          <img src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_224,h_298/Location_kgbiw1" alt="Live Tracking" style={featIcon}/>
          <h3 style={featTitle}>Live Order Tracking</h3>
          <p style={featDesc}>Know where your order is at all times, from the restaurant to your doorstep.</p>
        </div>
        <div style={featureCard}>
          <img src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_248,h_312/Store_2_rvm5pc" alt="Fast Delivery" style={featIcon}/>
          <h3 style={featTitle}>Lightning-Fast Delivery</h3>
          <p style={featDesc}>Experience FreshDash's superfast delivery for food delivered fresh & on time.</p>
        </div>
      </section>

      {/* 🌑 FOOTER SECTION */}
      <footer style={footerStyle}>
        <div style={footerGrid}>
          <div style={footerColumn}>
            <h4 style={footerTitle}>COMPANY</h4>
            <p style={footerLink}>About us</p>
            <p style={footerLink}>Team</p>
            <p style={footerLink}>Careers</p>
          </div>
          <div style={footerColumn}>
            <h4 style={footerTitle}>CONTACT</h4>
            <p style={footerLink}>Help & Support</p>
            <p style={footerLink}>Partner with us</p>
            <p style={footerLink}>Ride with us</p>
          </div>
          <div style={footerColumn}>
            <h4 style={footerTitle}>LEGAL</h4>
            <p style={footerLink}>Terms & Conditions</p>
            <p style={footerLink}>Refund & Cancellation</p>
            <p style={footerLink}>Privacy Policy</p>
            <p style={footerLink}>Cookie Policy</p>
          </div>
          <div style={footerColumn}>
            <img src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200,h_65/icon-AppStore_pw0t7w" alt="App Store" style={{ marginBottom: '20px', width: '150px', cursor: 'pointer' }} />
            <img src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200,h_65/icon-GooglePlay_1_z9jge6" alt="Play Store" style={{ width: '150px', cursor: 'pointer' }} />
          </div>
        </div>
        <hr style={{ border: '0.5px solid #444', margin: '40px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ color: 'white', margin: 0 }}>🌿 FreshDash</h2>
           <p style={{ color: '#888' }}>© 2026 FreshDash Technologies Pvt. Ltd</p>
        </div>
      </footer>
    </div>
  );
};

// --- STYLES ---
const heroSection = { display: 'flex', height: '85vh', width: '100%' };
const heroLeft = { flex: 1.2, padding: '40px 8%', display: 'flex', flexDirection: 'column' };
const heroRight = { flex: 0.8, overflow: 'hidden' };
const heroImg = { width: '100%', height: '100%', objectFit: 'cover' };
const topNav = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' };
const authButtons = { display: 'flex', gap: '25px', alignItems: 'center', minHeight: '45px' };
const heroContent = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const mainHeadline = { fontSize: '48px', fontWeight: '800', margin: '0 0 5px 0' };
const subHeadline = { fontSize: '24px', color: '#686b78', fontWeight: '400', margin: '0 0 40px 0' };

const dualBarContainer = { display: 'flex', gap: '15px', width: '100%', maxWidth: '850px', marginBottom: '35px' };
const locationBar = { flex: 0.35, display: 'flex', border: '1px solid #bebfc5', background: 'white', height: '60px', alignItems: 'center', paddingRight: '10px' };
const searchBar = { flex: 0.65, display: 'flex', border: '1px solid #bebfc5', background: 'white', height: '60px', alignItems: 'center' };
const inputStyle = { flex: 1, border: 'none', padding: '0 15px', fontSize: '16px', outline: 'none' };
const detectAction = { background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: '700', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' };
const findFoodBtn = { background: 'var(--primary-blue)', color: 'white', border: 'none', height: '100%', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer' };

const loginBtn = { background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', color: 'var(--text-dark)' };
const signupBtn = { background: 'var(--text-dark)', color: 'white', border: 'none', padding: '12px 25px', fontWeight: 'bold', cursor: 'pointer' };
const profileWrapper = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' };
const profileImage = { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-blue)' };

// NEW Mind Section Styles
const mindSection = { padding: '60px 8%', background: 'white' };
const mindTitle = { fontSize: '24px', fontWeight: '800', marginBottom: '30px', color: 'var(--text-dark)' };
const foodScroll = { display: 'flex', gap: '40px', overflowX: 'auto', paddingBottom: '20px' };
const foodItem = { textAlign: 'center', cursor: 'pointer', minWidth: '120px' };
const foodCircleImg = { width: '120px', height: '120px', objectFit: 'contain' };
const foodName = { marginTop: '10px', fontWeight: '600', color: '#555' };

const featuresContainer = { display: 'flex', justifyContent: 'space-around', padding: '80px 10%', background: '#2b1e16', color: 'white', textAlign: 'center' };
const featureCard = { width: '28%' };
const featIcon = { height: '180px', marginBottom: '25px' };
const featTitle = { fontSize: '20px', fontWeight: '700', marginBottom: '10px' };
const featDesc = { fontSize: '15px', color: '#e0e0e0', lineHeight: '1.4' };

const footerStyle = { background: '#000', color: 'white', padding: '60px 10%' };
const footerGrid = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' };
const footerColumn = { display: 'flex', flexDirection: 'column' };
const footerTitle = { fontSize: '16px', fontWeight: '700', marginBottom: '25px', color: '#888' };
const footerLink = { fontSize: '15px', color: 'white', marginBottom: '12px', cursor: 'pointer' };

export default LandingPage;