import { useState, useEffect } from "react";
import CardGrid from "../components/CardGrid.jsx";
import NavBar from "../components/NavBar.jsx";
import { useCart } from "../components/CartContext.jsx";
import axios from 'axios';


const Cart = ({ cartItems, onRemove, onCheckout, error, message }) => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="cart-container">
            <h2>Shopping Cart 🛒</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.product_id}>
                                {item.name} - ${item.price} x {item.quantity}
                                <button onClick={() => onRemove(item.product_id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${totalPrice.toFixed(2)}</h3>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            console.log('Checkout button clicked in Cart component');
                            if (onCheckout && typeof onCheckout === 'function') {
                                onCheckout();
                            } else {
                                console.error('onCheckout is not a function');
                            }
                        }}
                        type="button"
                    >
                        Proceed to Checkout
                    </button>
                </>
            )}
        </div>
    );
};


function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [productError, setProductError] = useState('');

    // Use CartContext instead of local state
    const { 
        cartItems, 
        addToCart, 
        handleRemoveFromCart, 
        handleCheckout, 
        error, 
        message 
    } = useCart();

    const API_URL = 'http://localhost:5000';

    
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                setProducts(response.data);
            } catch (err) {
                setProductError('Could not fetch products. Please try again later.');
            }
        };
        fetchProducts();
    }, []);


    return (
        <div className="customer-container">
            <NavBar />
            <div className="customer-body">
                <h2>Products</h2>
                <p>Browse our selection and add items to your cart.</p>
                <hr />
                {productError && <p style={{ color: 'red' }}>{productError}</p>}
                
                <CardGrid 
                    products={products}
                    actor="customer"
                    onAddToCart={addToCart}
                />
                
                <hr />
                
                <Cart 
                    cartItems={cartItems}
                    onRemove={handleRemoveFromCart}
                    onCheckout={handleCheckout}
                    error={error}
                    message={message}
                />
            </div>
        </div>
    );


}

export default CustomerDashboard;