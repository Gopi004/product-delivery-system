import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // If there is no token, redirect the user to the login page
    return <Navigate to="/" replace />;
  
}

  // If there is a token, render the component that was passed in (the protected page)
  return children;
};

export default ProtectedRoute;