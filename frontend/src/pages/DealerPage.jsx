import {useState , useEffect} from "react";
import CardGrid from "../components/CardGrid.jsx"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';


function DealerPage(){

    const [formData,setformData] = useState({name:"",description:"",price:"",stock:""});
    const [products,setProducts]=useState([]);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 


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

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setformData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
        });
        setIsPopupOpen(true);
    };

    const handleAddClick = () => {
        setEditingProduct(null); 
        setformData({ name: "", description: "", price: "", stock: "" });
        setIsPopupOpen(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = createApiConfig();
                await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
                fetchProducts(); 
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
    };



   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const config = createApiConfig();
            if (editingProduct) {
               
                await axios.put(`http://localhost:5000/api/products/${editingProduct.product_id}`, formData, config);
            } else {
                
                await axios.post("http://localhost:5000/api/products",formData,config);
            }
            setIsPopupOpen(false); 
            fetchProducts(); 
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };
    
    return (
        <div className="dealer-container">
            <nav>
                <p className="nav-header">PDS</p>
                <div className="nav-right">
                    <p className="dealer-name">Hello, Dealer</p>
                    <button onClick={handleAddClick}>Add Product</button>
                </div>
            </nav>

            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} modal nested>
                {close => (
                    <div className="modal">
                        <button className="form-close-btn" onClick={close}>&times;</button>
                        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form className="new-product-form" onSubmit={handleSubmit}>
                         
                            <input className="new-product-name" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInput} required />
                            <textarea className="new-product-desc" name="description" placeholder="Description" value={formData.description} onChange={handleInput} required></textarea>
                            <input className="new-product-price" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInput} required />
                            <input className="new-product-stock" type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInput} required />
                            <button className="save-btn" type="submit">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                        </form>
                    </div>
                )}
            </Popup>

            <div className="dealer-body">
                <h3>My Products</h3>
                <hr />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="content">
                    <CardGrid 
                        products={products}
                        actor="dealer"
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );

}

export default DealerPage;