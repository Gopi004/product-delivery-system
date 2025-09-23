import {useState} from "react";
import Card from "../components/card.jsx"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';


function DealerPage(){

    const [product,setProduct] = useState({name:"",description:"",price:"",stock:""});

    function handleInput(e){
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e,close){
        e.preventDefault();

        try
        {
            const token = localStorage.getItem('token');
             const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post("http://localhost:5000/api/products",product,config);
            alert('Product added successfully!');
            setProduct({name:"",description:"",price:"",stock:""});
            close(); 
        }
        catch(error)
        {
            console.log(error);
            alert('Failed to add product.');
        }
    }

    return(
        <div className="dealer-container">
            <nav>
                <p className="nav-header">PDS</p>
                <div className="nav-right">
                    <p className="dealer-name">Hello, Dealer</p>
                    <Popup trigger={<button>Add Product</button>} modal nested>
                        {close => (
                            <div className="modal">
                                <button className="form-close-btn" onClick={close}>&times;</button>
                                <form className="new-product-form" onSubmit={(e) => handleSubmit(e, close)}>
                                    <input className="new-product-name" type="text" name="name" placeholder="Name" value={product.name} onChange={handleInput} required />
                                    <textarea className="new-product-desc" name="description" placeholder="Description" value={product.description} onChange={handleInput} required></textarea>
                                    <input className="new-product-price" type="number" name="price" placeholder="Price" value={product.price} onChange={handleInput} required />
                                    <input className="new-product-stock" type="number" name="stock" placeholder="Stock" value={product.stock} onChange={handleInput} required />
                                    <button className="save-btn" type="submit">Save Product</button>
                                </form>
                            </div>
                        )}
                    </Popup>
                </div>
            </nav>
            <div className="dealer-body">
                <h3>My Products</h3>
                <hr />
                <div className="content">
                    
                </div>
            </div>
        </div>
    );
}

export default DealerPage;