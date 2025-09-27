import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const API_URL = 'http://localhost:5000';
  
 useEffect(() => {
   try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if(!isInitialLoad){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems,isInitialLoad]);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === product.product_id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Otherwise, add the new item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product_id!== productId));
    };
   
  const handleCheckout = async () => {
        console.log('Checkout function called from CartContext!'); // Debug log
        
        if(cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        
        // Clear previous messages
        setError('');
        setMessage('');
        
        try {
            const token = localStorage.getItem('token');
            console.log('Token found:', !!token); // Debug log
            
            if (!token) {
                setError('Please log in to place an order.');
                return;
            }
            
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const body = { cartItems };

            console.log('Sending order request...'); // Debug log
            const response = await axios.post(`${API_URL}/api/orders`, body, config);
            console.log('Order response:', response.data); // Debug log
            
            setMessage('Order placed successfully!');
            setCartItems([]);
            localStorage.removeItem('cartItems'); // Clear cart from localStorage 
        } catch (error) {
            console.error('Checkout error:', error.response?.data || error.message); // Debug log
            if (error.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
            } else if (error.response?.status === 400) {
                setError(error.response.data.message || 'Invalid order data.');
            } else {
                setError('Failed to place order. Please try again.');
            }
        }
    };
  
  const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 1) {
   
    handleRemoveFromCart(productId);
  } else {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }
};

  const value = {
    cartItems,
    addToCart,
    handleRemoveFromCart,
    handleCheckout,
    updateQuantity,
    error,
    message,
    setError,
    setMessage
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};