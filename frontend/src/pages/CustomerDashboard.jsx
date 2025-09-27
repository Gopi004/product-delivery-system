import { useState, useEffect } from "react";
import CardGrid from "../components/CardGrid.jsx";
import NavBar from "../components/NavBar.jsx";
import axios from 'axios';

function CustomerDashboard() {
    const [products, setProducts] = useState([]);
    
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const API_URL = 'http://localhost:5000';

   
        
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
                    
                />
                
                <hr />
            </div>
        </div>
    );


}

export default CustomerDashboard;