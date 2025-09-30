import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";


const History = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const createApiConfig = () => {
        const token = localStorage.getItem('token');
        return { 
            headers: 
            { Authorization: `Bearer ${token}` } 
        };
    };


        useEffect(() => {
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
        <div>
                        <div className="flex mb-4">                            
                            <div className="flex gap-2">
                                <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                    📋 Total: {orders.length}
                                </div>                   
                                <div className="text-xs text-blue-400 bg-gray-800/50 px-3 py-1 rounded-lg">
                                    🚚 In Delivery: {orders.filter(o => o.status !== 'Delivered').length}
                                </div>
                                
                            </div>
                        </div>
                    

                        {orders.length === 0 ? (
                            <div className="text-center p-[40px] text-white/60 bg-gray-900/50 rounded-2xl backdrop-blur-xl border border-gray-700/50">
                                <h4 className="text-2xl mb-4">📦 No Orders</h4>
                                <p>No orders from customer yet</p>
                            </div>
                        ) : (
                            <div className="orders-container">
                                {orders.map(order => (
                                    /*set in-delivery instead of pending*/
                                    <div key={order.order_id} className={`order-card backdrop-blur-xl rounded-2xl p-5 mb-5 shadow-2xl border ${
                                        (order.status !== 'Delivered' || !order.status) 
                                        ? 'bg-orange-900/20 border-orange-500/50' 
                                        : 'bg-gray-900/60 border-gray-700/50'
                                    }`}>
                                        {/* Priority Badge for in-delivery */}
                                        {(order.status !== 'Delivered' || !order.status) && (
                                            <div className="mb-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-600/20 border border-orange-500/30 text-orange-400">
                                                🚚 In Delivery
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
                                                    
                                                </div>
                                                <p className="text-purple-400 font-bold text-lg">
                                                    Total: ${order.total_amount}
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
    );
};

export default History;