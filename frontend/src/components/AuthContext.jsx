// src/context/AuthContext.jsx
import React, { createContext, useState, useContext ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // We'll need this to clear the cart
import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { clearCart } = useCart(); // Get the clearCart function
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Invalid token found in localStorage", error);
      localStorage.removeItem('token');
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    toast.success('Logged in successfully');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    //clearCart(); // Clear the cart on logout
    navigate('/'); // Redirect to the login/home page
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    token:localStorage.getItem('token'),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};