import {useState , useEffect} from "react";
import CardGrid from "../components/CardGrid.jsx"
import NavBar from "../components/NavBar.jsx";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';
import toast from "react-hot-toast";
import { useAuth } from "../components/AuthContext.jsx";

function DealerPage(){

    const [formData,setformData] = useState({name:"",description:"",price:"",stock:""});
    const [products,setProducts]=useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null); 
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [assigningOrder, setAssigningOrder] = useState(null);
    const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState('');
    const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'pending', 'assigned', 'delivered'
    const { logout:onLogout } = useAuth();
    const [imageFile, setImageFile] = useState(null);

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
            console.log('Orders fetched from backend:', response.data);
            console.log('Orders count:', response.data.length);
            setOrders(response.data);
        } catch(err) {
            console.error('Error fetching orders:', err);
            setError("Failed to fetch orders");
        }
    }

    const fetchDeliveryPersonnel = async () => {
        try {
            const config = createApiConfig();
            const response = await axios.get("http://localhost:5000/api/delivery/delivery-personnel", config);
            setDeliveryPersonnel(response.data);
        } catch(err) {
            console.error(err);
            setError("Failed to fetch delivery personnel");
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchDeliveryPersonnel();
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
        setImageFile(null);
        setIsPopupOpen(true);
    };

      const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };


    const handleAddClick = () => {
        setEditingProduct(null); 
        setformData({ name: "", description: "", price: "", stock: "" });
        setImageFile(null); 
        setIsPopupOpen(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = createApiConfig();
                await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
                toast.success('Product deleted successfully!');
                fetchProducts(); 
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
    };

     

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        if (imageFile) {
            data.append('image', imageFile); // 'image' must match the name in your Multer middleware
        }

        try {
            setError('');
            const config = createApiConfig();
            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct.product_id}`, data, config);
                toast.success('Product updated successfully!');
            } else {
                await axios.post("http://localhost:5000/api/products", data, config);
                toast.success('Product added successfully!');
            }
            setIsPopupOpen(false); 
            fetchProducts(); 
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

   
    const handleAssignClick = (order) => {
        setAssigningOrder(order);
        setSelectedPersonnel('');
        setIsAssignPopupOpen(true);
    };

    const handleAssignDelivery = async (e) => {
        e.preventDefault();
        if (!selectedPersonnel) {
            setError('Please select a delivery personnel');
            return;
        }

        try {
            setError('');
            const config = createApiConfig();
            await axios.put(`http://localhost:5000/api/orders/${assigningOrder.order_id}/assign`, {
                personnelId: selectedPersonnel
            }, config);
            
            setIsAssignPopupOpen(false);
            setAssigningOrder(null);
            setSelectedPersonnel('');
            fetchOrders(); // Refresh orders list
            fetchDeliveryPersonnel(); // Refresh delivery personnel list
            toast.success('Delivery assigned successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign delivery');
        }
    };

    // Filter button handlers
    const handleFilterAll = () => {
        console.log('All Orders button clicked - current filter:', orderFilter, 'total orders:', orders.length);
        setOrderFilter('all');
        console.log('Filter set to all');
    };

    const handleFilterPending = () => {
        setOrderFilter('pending');
    };

    const handleFilterAssigned = () => {
        setOrderFilter('assigned');
    };

    const handleFilterDelivered = () => {
        setOrderFilter('delivered');
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

    // Filter orders based on selected filter
    console.log('Current orderFilter:', orderFilter, 'Total orders:', orders.length);
    const filteredOrders = orderFilter === 'all' 
        ? orders 
        : orders.filter(order => {
            switch(orderFilter) {
                case 'pending': return order.status === 'Pending' || order.status === 'Processing' || !order.status;
                case 'assigned': return order.status === 'Shipped';
                case 'delivered': return order.status === 'Delivered';
                default: 
                    return true;
            }
        });
        
    console.log('Filtered orders count:', filteredOrders.length);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden p-[4vh]">

            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500 z-0"></div>
            <button className="fixed top-7 right-5 bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:text-white hover:bg-red-600/90" onClick={onLogout}>Logout</button>
            <NavBar 
                userType="dealer" 
                userName="Dealer" 
                showAddButton={true} 
                onAddClick={handleAddClick}
            />

            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} modal nested>
                {close => (
                    <div className="m-0 p-[2vh] rounded-[15px] bg-gray-900/90 backdrop-blur-xl border border-gray-600/50 shadow-2xl relative z-[1100]">
                        
                        <button className="border-none rounded-4xl font-['Poetsen_One'] font-semibold cursor-pointer bg-white w-6 absolute top-2 right-2" onClick={close}>&times;</button>
                        <h3 className="font-['Poetsen_One'] text-white text-center text-[1.5rem] mt-2">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form className="p-[2vh] flex flex-col items-center gap-[3vh]" onSubmit={handleSubmit}>
                            <input className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInput} required />
                            <textarea className="border-none h-[8vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500 content-center" name="description" placeholder="Description" value={formData.description} onChange={handleInput} required></textarea>
                            <input className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500" type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInput} required />
                            <input className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500" type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleInput} required />
                            <div className="flex flex-col items-center gap-2">
                                {/* Show current image if editing and no new file selected */}
                                {editingProduct && !imageFile && editingProduct.image_url && (
                                    <div className="flex justify-center mb-2">
                                        <div className="relative">
                                            <img 
                                                src={`http://localhost:5000${editingProduct.image_url}`} 
                                                alt="Current" 
                                                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600/50 shadow-lg"
                                            />
                                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
                                                Current
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Show new image preview if file selected */}
                                {imageFile && (
                                    <div className="flex justify-center mb-2">
                                        <div className="relative">
                                            <img 
                                                src={URL.createObjectURL(imageFile)} 
                                                alt="Preview" 
                                                className="w-24 h-24 object-cover rounded-lg border-2 border-purple-500/50 shadow-lg"
                                            />
                                            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                                                New
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <input 
                                    id="image-upload"
                                    type="file" 
                                    name="image" 
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] text-white placeholder-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                                    required={!editingProduct} // Only required when adding new product
                                />
                                <p className="text-gray-400 text-xs text-center">
                                    {editingProduct 
                                        ? "Select new image to replace current one (optional)" 
                                        : "Max size: 5MB. Supported: JPG, PNG, GIF, WebP"
                                    }
                                </p>
                            </div>

                            <button className="h-[6vh] border-none bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105 rounded-[10px] font-['Poetsen_One'] px-4 cursor-pointer font-thin text-white " type="submit">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                        </form>
                    </div>
                )}
            </Popup>

            {/* Assign Delivery Popup */}
            <Popup open={isAssignPopupOpen} onClose={() => setIsAssignPopupOpen(false)} modal nested>
                {close => (
                    <div className="m-0 p-[2vh] rounded-[15px] bg-gray-900/90 backdrop-blur-xl border border-gray-600/50 shadow-2xl relative z-[1100]">
                        <button className="border-none rounded-4xl font-['Poetsen_One'] font-semibold cursor-pointer bg-white w-6 absolute top-2 right-2" onClick={close}>&times;</button>
                        <h3 className="font-['Poetsen_One'] text-white text-center text-[1.5rem]">
                            Assign Delivery for Order #{assigningOrder?.order_id}
                        </h3>
                        <div className="p-[2vh]">
                            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                                <h4 className="text-white mb-2">Order Details:</h4>
                                <p className="text-gray-300 text-sm">Customer: {assigningOrder?.customer_name}</p>
                                <p className="text-gray-300 text-sm">Address: {assigningOrder?.customer_address}</p>
                                <p className="text-gray-300 text-sm">Total: ${assigningOrder?.total_amount}</p>
                            </div>
                            <form onSubmit={handleAssignDelivery} className="flex flex-col items-center gap-[3vh]">
                                <select 
                                    value={selectedPersonnel} 
                                    onChange={(e) => setSelectedPersonnel(e.target.value)}
                                    className="border-none h-[6vh] w-[18vw] rounded-[10px] text-[1rem] pl-[1.5vw] bg-gray-800/80 border border-gray-600/50 text-white"
                                    required
                                >
                                    <option value="">Select Delivery Personnel</option>
                                    {deliveryPersonnel.map(person => (
                                        <option key={person.personnel_id} value={person.personnel_id}>
                                            {person.name}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    type="submit"
                                    className="h-[6vh] border-none bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transform hover:scale-105 rounded-[10px] font-['Poetsen_One'] px-4 cursor-pointer font-thin text-white"
                                >
                                    Assign Delivery
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </Popup>

            <div className="relative z-10 mt-[15vh] mx-[7.5vw]">
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
                        <h3 className="text-white/80 text-[1.5rem] font-['Poetsen_One'] pb-2 ">My Products</h3>
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white/80 text-[1.5rem] font-['Poetsen_One']">Customer Orders</h3>
                            <div className="flex gap-2 mt-[2vh]">
                                <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                    📋 Total: {orders.length}
                                </div>
                                <div className="text-xs text-orange-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                    ⏳ Pending Assignment: {orders.filter(o => o.status === 'Pending' || !o.status).length}
                                </div>
                                <div className="text-xs text-blue-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                    🚚 In Delivery: {orders.filter(o => o.status === 'Shipped').length}
                                </div>
                                <div className="text-xs text-green-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                    ✅ Completed: {orders.filter(o => o.status === 'Delivered').length}
                                </div>
                            </div>
                        </div>
                        
                        {/* Order Filters */}
                        <div className="flex gap-3 mb-6">
                            <button

                               onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFilterAll();
                                }}
                             
                                className={`px-5 py-3 rounded-xl font-inter text-[15px] font-medium tracking-wider uppercase transition-all duration-300 ease-in-out border-2 ${
                                    orderFilter === 'all'
                                        ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-purple-400 text-white font-semibold border-purple-400/30 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
                                        : 'bg-gray-800/60 text-gray-300 border-gray-600/30 shadow-sm hover:bg-gray-700/70 hover:text-gray-200 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                            >
                                📋 All Orders ({orders.length})
                            </button>
                            
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFilterPending();
                                }}
                                className={`px-5 py-3 rounded-xl font-inter text-[15px] font-medium tracking-wider uppercase transition-all duration-300 ease-in-out border-2 ${
                                    orderFilter === 'pending'
                                        ? 'bg-gradient-to-br from-orange-500 via-red-500 to-red-600 text-white font-semibold border-orange-400/30 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30'
                                        : 'bg-gray-800/60 text-gray-300 border-gray-600/30 shadow-sm hover:bg-gray-700/70 hover:text-gray-200 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                            >
                                ⚡ Needs Assignment ({orders.filter(o => o.status === 'Pending' || !o.status).length})
                            </button>
                            
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFilterAssigned();
                                }}
                                className={`px-5 py-3 rounded-xl font-inter text-[15px] font-medium tracking-wider uppercase transition-all duration-300 ease-in-out border-2 ${
                                    orderFilter === 'assigned'
                                        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white font-semibold border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                                        : 'bg-gray-800/60 text-gray-300 border-gray-600/30 shadow-sm hover:bg-gray-700/70 hover:text-gray-200 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                            >
                                � In Delivery ({orders.filter(o => o.status === 'Shipped').length})
                            </button>
                            
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFilterDelivered();
                                }}
                                className={`px-5 py-3 rounded-xl font-inter text-[15px] font-medium tracking-wider uppercase transition-all duration-300 ease-in-out border-2 ${
                                    orderFilter === 'delivered'
                                        ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white font-semibold border-green-400/30 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30'
                                        : 'bg-gray-800/60 text-gray-300 border-gray-600/30 shadow-sm hover:bg-gray-700/70 hover:text-gray-200 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                            >
                                ✨ Completed ({orders.filter(o => o.status === 'Delivered').length})
                            </button>
                        </div>

                        <hr className="mb-[3vh] text-white/50" />
                        {filteredOrders.length === 0 ? (
                            <div className="text-center p-[40px] text-white/60 bg-gray-900/50 rounded-2xl backdrop-blur-xl border border-gray-700/50">
                                <h4 className="text-2xl mb-4">📦 No Orders</h4>
                                <p>{orderFilter === 'all' ? 'No orders from customers yet' : `No ${orderFilter} orders found`}</p>
                            </div>
                        ) : (
                            <div className="orders-container">
                                {filteredOrders.map(order => (
                                    <div key={order.order_id} className={`order-card backdrop-blur-xl rounded-2xl p-5 mb-5 shadow-2xl border ${
                                        (order.status === 'Pending' || !order.status) 
                                        ? 'bg-orange-900/20 border-orange-500/50' 
                                        : 'bg-gray-900/60 border-gray-700/50'
                                    }`}>
                                        {/* Priority Badge for Pending Orders */}
                                        {(order.status === 'Pending' || !order.status) && (
                                            <div className="mb-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-600/20 border border-orange-500/30 text-orange-400">
                                                🔥 Needs Assignment
                                            </div>
                                        )}
                                        
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
                                                <h4 className="text-white text-xl font-bold mb-1">
                                                    Order #{order.order_id}
                                                </h4>
                                                <p className="text-gray-300 text-sm">
                                                    {formatDate(order.order_date)}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
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
                                                    {(order.status === 'Pending' || order.status === 'Processing' || !order.status) && (
                                                        <button
                                                            onClick={() => handleAssignClick(order)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                backgroundColor: '#28a745',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                fontSize: '11px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                                            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                                                        >
                                                            🚚 Assign Delivery
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-purple-400 font-bold text-lg">
                                                    Total: ${order.total_amount}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="mb-4">
                                            <h5 className="text-gray-200 font-semibold mb-2">
                                                👤 Customer Details:
                                            </h5>
                                            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600/30">
                                                <p className="text-gray-300 text-sm mb-1">
                                                    <strong className="text-white">Name:</strong> {order.customer_name}
                                                </p>
                                                <p className="text-gray-300 text-sm mb-1">
                                                    <strong className="text-white">Email:</strong> {order.customer_email}
                                                </p>
                                                <p className="text-gray-300 text-sm mb-1">
                                                    <strong className="text-white">Phone:</strong> {order.customer_phone}
                                                </p>
                                                <p className="text-gray-300 text-sm">
                                                    <strong className="text-white">Address:</strong> {order.customer_address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h5 className="text-gray-200 font-semibold mb-2">
                                                📦 Ordered Items:
                                            </h5>
                                            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-600/30">
                                                {order.items && order.items.map((item, index) => (
                                                    <div key={index} className={`flex justify-between items-center p-3 ${index < order.items.length - 1 ? 'border-b border-gray-600/30' : ''}`}>
                                                        <div>
                                                            <div className="text-white font-semibold">{item.product_name}</div>
                                                            <div className="text-gray-400 text-xs">
                                                                ${item.price} × {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="text-purple-400 font-bold">
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

