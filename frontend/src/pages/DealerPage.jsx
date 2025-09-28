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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden p-[4vh]">

            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500 z-0"></div>

            <nav className="bg-gray-900/70 backdrop-blur-xl shadow-2xl border border-gray-700/50 p-4 overflow-hidden fixed top-0 left-1/4 z-[1000] flex flex-row justify-between items-center rounded-2xl w-[45vw] m-[3vh] mb-[5vh] font-['Poetsen_One'] text-green-50">
                <p className="text-[1.5rem]">PDS</p>
                <div className="flex flex-row justify-around items-center gap-[2vw]">
                    <p className="dealer-name">Hello, Dealer</p>
                    <button className="h-[6vh] border-none text-white rounded-lg font-['Poetsen_One'] font-thin cursor-pointer px-[1vw] bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105" 
                        onClick={handleAddClick}>Add Product
                    </button>
                </div>
            </nav>

            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} modal nested>
                {close => (
                    <div className="m-0 p-[2vh] rounded-[15px] bg-gray-900/70">
                        
                        <button className="border-none rounded-4xl font-['Poetsen_One'] font-semibold cursor-pointer bg-white w-6" onClick={close}>&times;</button>
                        <h3 className="font-['Poetsen_One'] text-white text-center text-[1.5rem]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form className="p-[2vh] flex flex-col items-center gap-[3vh]" onSubmit={handleSubmit}>
                            <input className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInput} required />
                            <textarea className="border-none h-[8vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500 content-center" name="description" placeholder="Description" value={formData.description} onChange={handleInput} required></textarea>
                            <input className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInput} required />
                            <input className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500" type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInput} required />
                            <button className="h-[6vh] border-none bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105 rounded-[10px] font-['Poetsen_One'] px-4 cursor-pointer font-thin text-white " type="submit">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                        </form>
                    </div>
                )}
            </Popup>

            <div className="mt-[15vh] mx-[7.5vw]">
                {/* Tab Navigation */}
                <div className="flex flex-row justify-end items-center gap-[1vw] mr-2">
                    <button className="text-white text-[1rem] font-['Poetsen_One'] border-none bg-purple-600 transform hover:scale-105 rounded-[10px] p-3 cursor-pointer"
                        onClick={() => setActiveTab('products')}
                    >
                        My Products ({products.length})
                    </button>
                    <button className="text-white text-[1rem] font-['Poetsen_One'] border-none bg-violet-600 transform hover:scale-105 rounded-[10px] p-3 cursor-pointer"
                        onClick={() => setActiveTab('orders')}
                    >
                        Customer Orders ({orders.length})
                    </button>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <h3 className="text-white/80 text-[1.5rem] font-['Poetsen_One'] ">My Products</h3>
                        <hr className="mb-[3vh] text-white/50" />
                        <div className="m-0 mx-[0vw] w-[80vw] rounded-[15px] bg-gray-900/70 flex flex-col items-center pb-[9vh]">
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

