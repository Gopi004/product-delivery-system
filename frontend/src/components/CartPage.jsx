// src/pages/CartPage.jsx
import React from 'react';
 // You'll need to create this CSS file for styling
import { useCart } from './CartContext';
import NavBar from './NavBar';

const CartPage = () => {
 
  const { cartItems, handleRemoveFromCart: onRemove, handleCheckout: onCheckout,updateQuantity } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
   console.log('Current Cart Items:', cartItems);
  return (
    <div>
      <NavBar />
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      <div className='cart-layout'>
        <div className='cart-items-section'>
          {cartItems.length === 0 ? (
            <p className='cart-item-empty'>Your cart is empty.</p>
          ) : (
        <div>
        {cartItems.map(item => (
            <div key={item.product_id} className='cart-item-card'>
             
              <div className='cart-item-info'>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
              </div>
              <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                </div>
                <div className="cart-item-total">
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button className='cart-item-remove' onClick={() => onRemove(item.product_id)}>&times;</button>
            </div>
          ))}
        </div>
      )}
    </div>
      <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <button className="checkout-button" onClick={onCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CartPage;