import { useState, useEffect } from "react";
import CardGrid from "../components/CardGrid.jsx";
import NavBar from "../components/NavBar.jsx";
import { useCart } from "../components/CartContext.jsx";
import axios from 'axios';
import { useAuth } from "../components/AuthContext.jsx";


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

    const { logout: onLogout } = useAuth();
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden p-[4vh]">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500 z-0"></div>   
            <button className="fixed top-7 right-5 bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:text-white hover:bg-red-600/90" onClick={onLogout}>Logout</button>
            <NavBar userType="customer" />
            <div className="mt-[15vh] mx-[7.5vw]">
                <h2 className="text-white/80 text-[1.5rem] font-['Poetsen_One'] pb-2 ">Products</h2>
                <hr className="mb-[3vh] text-white/50" />
                {productError && <p style={{ color: 'red' }}>{productError}</p>}
                <div className="m-0 mx-[0vw] w-[80vw] rounded-[15px] bg-gray-900/70 flex flex-col items-center pb-[5vh] ">
                <CardGrid 
                    products={products}
                    actor="customer"
                    onAddToCart={addToCart}
                />
                </div>
                                  
            </div>
            
        </div>
    );


}

export default CustomerDashboard;