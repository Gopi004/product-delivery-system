import {useState , useEffect} from "react";
import Card from "../components/card.jsx"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import CardGrid from "../components/card.jsx";

function DealerPage(){

    const [formData,setformData] = useState({name:"",description:"",price:"",stock:""});
    const [products,setProducts]=useState([]);
    const [error, setError] = useState('');


     const createApiConfig = () => {
        const token = localStorage.getItem('token');
        return { 
            headers: 
            { Authorization: `Bearer ${token}` } 
        };
    };

    const fetchProducts = async () =>
    {
        try
        {
            setError('');
            const config = createApiConfig();
            const response = await axios.get("http://localhost:5000/api/products/my-products",config);
            setProducts(response.data);
        }
        catch(err)
        {
            console.error(err);
            setError("Failed to fetch products");
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    function handleInput(e){
        const { name, value } = e.target;
        setformData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e,close){
        e.preventDefault();

        try
        {   
            setError('');
            const config = createApiConfig();

            await axios.post("http://localhost:5000/api/products",formData,config);
            alert('Product added successfully!');
            setformData({name:"",description:"",price:"",stock:""});
            fetchProducts();
            close(); 
        }
        catch(err)
        {
            console.error(err);
            setError(err.response?.data?.message || 'An error occurred while adding products.');
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
                                    <input className="new-product-name" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInput} required />
                                    <textarea className="new-product-desc" name="description" placeholder="Description" value={formData.description} onChange={handleInput} required></textarea>
                                    <input className="new-product-price" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInput} required />
                                    <input className="new-product-stock" type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInput} required />
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
                 {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="content">
                    <CardGrid products={products} actor="dealer" fetchProducts={fetchProducts}/> 
                    {/*change inputs when backend is ready*/}
                </div>
            </div>
        </div>
    );
}

export default DealerPage;