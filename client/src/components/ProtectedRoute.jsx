import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import your initialized firebase auth
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Authentication check finished
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Show a blank screen or spinner while checking auth state
  // to prevent flicker
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: 'var(--primary-blue)' }}>
        Loading FreshDash...
      </div>
    );
  }

  // If user is not logged in, redirect to the Landing Page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in, render the protected content (children)
  return children;
};

export default ProtectedRoute;