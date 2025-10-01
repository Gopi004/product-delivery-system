import {useState, useEffect} from "react";
import NavBar from "../components/NavBar.jsx";
import axios from "axios";
import { useAuth } from "../components/AuthContext.jsx";


function DeliveryDashboard() {
    const [deliveries, setDeliveries] = useState([]);
    const [error,setError] = useState("");
    const [loading,setLoading]=useState(true);
    const [updatingDelivery,setUpdatingDelivery]=useState(null);
    const [history, setHistory] = useState([]);
    const { logout: onLogout } = useAuth();
    
     const createApiConfig = () => {
        const token = localStorage.getItem('token');
        return { 
            headers: 
            { Authorization: `Bearer ${token}` } 
        };
    };

    const fetchMyDeliveries = async () =>
    {
        try
        {
            setError("");
            setLoading(true);
            const config= createApiConfig();
            const response = await axios.get("http://localhost:5000/api/delivery/mydeliveries",config);
            setDeliveries(response.data);
        }
        catch(err)
        {
            console.error("Error fetching deliveries:",err);
            setError("Failed to fetch deliveries");
        }
        finally
        {
            setLoading(false);
        }
    }

    const updateDeliveryStatus = async (deliveryId, status) =>
    {
        try
        {
            setError("");
            setUpdatingDelivery(deliveryId);
            const config = createApiConfig();

            await axios.put(`http://localhost:5000/api/delivery/deliveries/${deliveryId}/status`,{status},config);

            await fetchMyDeliveries();
            alert(`Delivery marked as ${status} successfully!`);
        }
        catch(err)
        {
            console.error('Error updating delivery status:', err);
            setError(err.response?.data?.message || "Failed to update delivery status");
        }
        finally
        {
            setUpdatingDelivery(null);
        }
    }

    const fetchDeliveryHistory = async () =>
    {
        try
        {
        setError(""); 
        const config = createApiConfig();
        const response = await axios.get("http://localhost:5000/api/delivery/delivery-history",config);
        setHistory(response.data);
        }
        catch(err)
        {
            console.log(err);
            setError('Failed to fetch delivery history.');
        }
       
    }

       useEffect(() => {
        fetchMyDeliveries();
        fetchDeliveryHistory();
    }, []);

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



    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden p-[4vh]">

            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500 z-0"></div>
            <button className="fixed top-7 right-5 bg-red-600/20 border border-red-500/30 text-red-400 font-bold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:text-white hover:bg-red-600/90" onClick={onLogout}>Logout</button>
        
            <NavBar 
                userType="delivery" 
                userName="Delivery Personnel"
            />
            
            <div className="relative z-10 mt-[15vh] mx-[7.5vw]">
                
                <h3 className="text-white/80 text-[1.5rem] font-['Poetsen_One'] pb-2 ">My Assignments</h3>
                <hr className="mb-[3vh] text-white/50" />
                <div className="m-0 mx-[0vw] w-[80vw] rounded-[15px] bg-gray-900/70 flex flex-col items-center pb-[9vh]">
                    {deliveries.length === 0 ? (
                        <div className="text-center p-[40px] mt-[5vh] text-white/60 rounded-2xl backdrop-blur-xl">
                            <h4 className="text-2xl mb-1">📦 No Orders</h4>
                            <p>No orders to deliver yet</p>
                        </div>
                    ) : (
                        <div className=" min-w-[60vw] mt-[3vh]">
                            {deliveries.map(order => (
                                <div key={order.delivery_id} className="order-card backdrop-blur-xl rounded-2xl p-6 mb-4 shadow-2xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 bg-purple-500/10">
                                    {/* Order Header */}
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700/30">
                                        <div className="space-y-2 ">
                                            <div className="flex items-center justify-between w-full min-w-[58vw] mb-[2vh]">
                                                <h4 className="text-white text-2xl font-bold flex items-center gap-2">
                                                    <span className="text-purple-400">📦 Order #{order.order_id}</span> 
                                                </h4>

                                                <button 
                                                    onClick={() => updateDeliveryStatus(order.delivery_id, 'Delivered')}
                                                    disabled={updatingDelivery === order.delivery_id}
                                                    className={`
                                                        px-4 py-2 rounded-lg font-medium text-sm
                                                        flex items-center gap-2
                                                        transition-all duration-300
                                                        ${updatingDelivery === order.delivery_id
                                                            ? 'bg-purple-500/20 text-purple-300 cursor-wait'
                                                            : 'bg-purple-500/10 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300'
                                                        }
                                                        border border-purple-500/30 hover:border-purple-500/50
                                                        shadow-lg hover:shadow-purple-500/10
                                                    `}
                                                >
                                                    {updatingDelivery === order.delivery_id ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                            </svg>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                                            </svg>
                                                            Mark as Delivered
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            
                                            
                                            <div className="flex items-center justify-between min-w-[58vw] gap-4">
                                                <span className="text-gray-400 text-sm bg-gray-700/30 px-3 py-1 rounded-full">
                                                    Delivery ID: {order.delivery_id}
                                                </span>
                                                <span className="text-gray-400 text-sm bg-gray-700/30 px-3 py-1 rounded-full flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {formatDate(order.order_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="space-y-4">
                                        <h5 className="text-gray-200 font-semibold flex items-center gap-2 text-lg">
                                            👤 Customer Details
                                        </h5>
                                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300 space-y-3">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-gray-400">Name:</span>
                                                <span className="text-white font-medium">{order.customer_name}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span className="text-gray-400">Phone:</span>
                                                <span className="text-white font-medium">{order.customer_phone}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-300">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-gray-400">Address:</span>
                                                <span className="text-white font-medium">{order.customer_address}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <h3 className="text-white/80 text-[1.5rem] font-['Poetsen_One'] pb-2 mt-[5vh]">History</h3>
                <hr className="mb-[3vh] text-white/50" />
                {history.length === 0 ? (
                    <div className="text-center p-[40px] mt-[5vh] text-white/60 rounded-2xl backdrop-blur-xl">
                        <h4 className="text-2xl mb-1">📦 No Past Orders</h4>
                        <p>No orders are delivered yet</p>
                    </div>
                    ) : (
                    <div className=" min-w-[60vw] mt-[3vh]">
                        {history.map(order => (
                            <div key={order.delivery_id} className="order-card backdrop-blur-xl rounded-2xl p-6 mb-4 shadow-2xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 bg-gray-800/40">
                                {/* Order Header */}
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700/30">
                                    <div className="space-y-2 ">
                                        <h4 className="text-white text-2xl font-bold flex items-center gap-2 mb-[2vh]">
                                            <span className="text-purple-400">📦 Order #{order.order_id}</span> 
                                        </h4>                              
                                        
                                        <div className="flex items-center justify-between min-w-[76vw] gap-4">
                                            <span className="text-gray-400 text-sm bg-gray-700/30 px-3 py-1 rounded-full">
                                                Delivery ID: {order.delivery_id}
                                            </span>
                                            <span className="text-gray-400 text-sm bg-gray-700/30 px-3 py-1 rounded-full flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatDate(order.delivery_date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h5 className="text-gray-200 font-semibold flex items-center gap-2 text-lg">
                                        👤 Customer Details
                                    </h5>
                                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300 space-y-3">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-400">Name:</span>
                                            <span className="text-white font-medium">{order.customer_name}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-400">Phone:</span>
                                            <span className="text-white font-medium">{order.customer_phone}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-400">Address:</span>
                                            <span className="text-white font-medium">{order.customer_address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


            </div>
        </div>
    )
}

export default DeliveryDashboard;