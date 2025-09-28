import {useState , useEffect} from "react";
import CardGrid from "../components/CardGrid.jsx"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';

function DealerPage(){

    const [formData,setformData] = useState({name:"",description:"",price:"",stock:""});
    const [products,setProducts]=useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
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

    const fetchProducts = async () => {
        try {
            setError('');
            const config = createApiConfig();
            const response = await axios.get("http://localhost:5000/api/products/my-products",config);
            setProducts(response.data);
        } catch(err) {
            console.error(err);
            setError("Failed to fetch products");
        }
    }

   
    const fetchOrders = async () => {
        try {
            setError('');
            const config = createApiConfig();
            const response = await axios.get("http://localhost:5000/api/orders/dealer-orders", config);
            setOrders(response.data);
        } catch(err) {
            console.error(err);
            setError("Failed to fetch orders");
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchOrders();
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

    const formatDate = (dateString) => {
        try {
            
            if (!dateString) return 'No date';
            
            const date = new Date(dateString);
            
          
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Date formatting error:', error, 'for date:', dateString);
            return 'Invalid date';
        }
    };

 
    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return '#ff9800';
            case 'confirmed': return '#2196f3';
            case 'shipped': return '#4caf50';
            case 'delivered': return '#8bc34a';
            case 'cancelled': return '#f44336';
            default: return '#9e9e9e';
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
                        <h3 className="form-heading">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
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
                {/* Tab Navigation */}
                <div className="tab-navigation" style={{ marginBottom: '20px' }}>
                    <button 
                        onClick={() => setActiveTab('products')}
                        style={{
                            padding: '10px 20px',
                            marginRight: '10px',
                            backgroundColor: activeTab === 'products' ? '#007bff' : '#f8f9fa',
                            color: activeTab === 'products' ? 'white' : '#333',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        My Products ({products.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: activeTab === 'orders' ? '#007bff' : '#f8f9fa',
                            color: activeTab === 'orders' ? 'white' : '#333',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Customer Orders ({orders.length})
                    </button>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <h3>My Products</h3>
                        <hr />
                        <div className="content">
                            <CardGrid 
                                products={products}
                                actor="dealer"
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        <h3>Customer Orders</h3>
                        <hr />
                        {orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <h4>📦 No Orders Yet</h4>
                                <p>Orders from customers will appear here</p>
                            </div>
                        ) : (
                            <div className="orders-container">
                                {orders.map(order => (
                                    <div key={order.order_id} className="order-card" style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        marginBottom: '20px',
                                        backgroundColor: '#f9f9f9'
                                    }}>
                                        {/* Order Header */}
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                            borderBottom: '1px solid #eee',
                                            paddingBottom: '10px'
                                        }}>
                                            <div>
                                                <h4 style={{ margin: '0', color: '#333' }}>
                                                    Order #{order.order_id}
                                                </h4>
                                                <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                                                    {formatDate(order.order_date)}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    padding: '5px 12px',
                                                    borderRadius: '20px',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    backgroundColor: getStatusColor(order.status)
                                                }}>
                                                    {order.status?.toUpperCase() || 'PENDING'}
                                                </span>
                                                <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '16px' }}>
                                                    Total: ${order.total_amount}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div style={{ marginBottom: '15px' }}>
                                            <h5 style={{ margin: '0 0 8px 0', color: '#555' }}>
                                                👤 Customer Details:
                                            </h5>
                                            <div style={{ 
                                                backgroundColor: 'white',
                                                padding: '10px',
                                                borderRadius: '4px',
                                                fontSize: '14px'
                                            }}>
                                                <p style={{ margin: '2px 0' }}>
                                                    <strong>Name:</strong> {order.customer_name}
                                                </p>
                                                <p style={{ margin: '2px 0' }}>
                                                    <strong>Email:</strong> {order.customer_email}
                                                </p>
                                                <p style={{ margin: '2px 0' }}>
                                                    <strong>Phone:</strong> {order.customer_phone}
                                                </p>
                                                <p style={{ margin: '2px 0' }}>
                                                    <strong>Address:</strong> {order.customer_address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h5 style={{ margin: '0 0 8px 0', color: '#555' }}>
                                                📦 Ordered Items:
                                            </h5>
                                            <div style={{ 
                                                backgroundColor: 'white',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                {order.items && order.items.map((item, index) => (
                                                    <div key={index} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '12px',
                                                        borderBottom: index < order.items.length - 1 ? '1px solid #f0f0f0' : 'none'
                                                    }}>
                                                        <div>
                                                            <strong>{item.product_name}</strong>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                                ${item.price} × {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div style={{ 
                                                            fontWeight: 'bold',
                                                            color: '#007bff'
                                                        }}>
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DealerPage;