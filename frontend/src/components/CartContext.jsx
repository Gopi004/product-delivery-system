import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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
        if(cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const body = { cartItems };

            await axios.post(`${API_URL}/api/orders`, body, config);
            
            setMessage('Order placed successfully!');
            setCartItems([]);
            localStorage.removeItem('cartItems'); // Clear cart from localStorage 
        } catch (error) {
            setError('Failed to place order. Please try again.');
        }
    };
  
  const updateQuantity = (productId, newQuantity) => {
  if (newQuantity < 1) {
    // If quantity is less than 1, remove the item completely.
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
    updateQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};