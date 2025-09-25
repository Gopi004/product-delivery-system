import { useState, useEffect } from "react";
import CardGrid from "../components/CardGrid.jsx";
import NavBar from "../components/NavBar.jsx";
import axios from 'axios';


const Cart = ({ cartItems, onRemove, onCheckout }) => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="cart-container">
            <h2>Shopping Cart 🛒</h2>
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
                    <button onClick={onCheckout}>Proceed to Checkout</button>
                </>
            )}
        </div>
    );
};


function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        // Initialize cart from localStorage
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const API_URL = 'http://localhost:5000';

    // Save cart to localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

   
    const handleAddToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.product_id === product.product_id);
            if (exist) {
                return prevItems.map(item =>
                    item.product_id === product.product_id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const handleRemoveFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
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

    
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                setProducts(response.data);
            } catch (err) {
                setError('Could not fetch products. Please try again later.');
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                
                <CardGrid 
                    products={products}
                    actor="customer"
                    onAddToCart={handleAddToCart}
                />
                
                <hr />
                
                <Cart 
                    cartItems={cartItems}
                    onRemove={handleRemoveFromCart}
                    onCheckout={handleCheckout}
                />
            </div>
        </div>
    );


}

export default CustomerDashboard;