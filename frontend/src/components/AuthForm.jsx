// frontend/src/components/AuthForm.jsx
import React, { useState,useEffect, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';



const AuthForm = () => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('customer');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // 1. Updated state to include all required fields
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const action = isLogin ? 'login' : 'register';
        const url = `${API_URL}/api/${action}/${role}`;

        try {
            const response = await axios.post(url, formData);
            if (isLogin) {
                login(response.data.token);
                console.log('Login successful!');
                navigate(`/${role}/dashboard`);
                
            } else {
                console.log('Registration successful! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
         
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500"></div>
            
            
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='10' r='1'/%3E%3Ccircle cx='10' cy='50' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            <div className="relative z-10 w-full max-w-6xl flex items-center justify-center lg:justify-between">
            
                <div className="hidden lg:block text-white space-y-4">
                    <div className="mb-8">
                        <p className="text-2xl font-light text-gray-400 mb-2">Welcome to</p>
                        <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
                            PRODUCT<br />
                            DELIVERY<br />
                            SYSTEM
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400 max-w-md leading-relaxed">
                        Your trusted platform for seamless product delivery management in the digital age
                    </p>
                </div>

                
                <div className="w-full max-w-md">
                    <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 relative overflow-hidden">
                      
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-purple-900/5 to-gray-900/10 rounded-3xl"></div>
                        <div className="relative z-10">
                           
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {isLogin ? '🌟 Welcome Back' : '🚀 Join Us'}
                                </h2>
                                <p className="text-gray-400">
                                    {isLogin ? 'Sign in to your account' : 'Create your new account'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Role Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        👤 Select Role
                                    </label>
                                    <select 
                                        value={role} 
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:border-purple-600/50"
                                    >
                                        <option value="customer" className="text-gray-100 bg-gray-800">🛒 Customer</option>
                                        <option value="dealer" className="text-gray-100 bg-gray-800">🏢 Dealer</option>
                                        <option value="delivery" className="text-gray-100 bg-gray-800">🚚 Delivery Personnel</option>
                                    </select>
                                </div>

                                {/* Registration Fields */}
                                {!isLogin && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                📝 Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                placeholder="Enter your full name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                required
                                                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:border-purple-600/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                📱 Phone Number
                                            </label>
                                            <input 
                                                type="text" 
                                                name="phone" 
                                                placeholder="Enter your phone number" 
                                                value={formData.phone} 
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:border-purple-600/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                🏠 Address
                                            </label>
                                            <input 
                                                type="text" 
                                                name="address" 
                                                placeholder="Enter your address" 
                                                value={formData.address} 
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:border-purple-600/50"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        ✉️ Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Enter your email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required
                                        className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:border-purple-600/50"
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        🔒 Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Enter your password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required
                                        className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 hover:border-purple-600/50"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 animate-pulse">
                                        <p className="text-red-300 text-sm flex items-center">
                                            ⚠️ {error}
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button 
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg hover:shadow-2xl relative overflow-hidden"
                                >
                                    <span className="relative z-10">
                                        {isLogin ? '🔑 Sign In' : '🎉 Create Account'}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 hover:opacity-20 transition duration-300"></div>
                                </button>
                            </form>

                            {/* Toggle Auth Mode */}
                            <div className="mt-6 text-center">
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-purple-300 hover:text-purple-200 transition duration-300 text-sm group"
                                >
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <span className="font-semibold underline group-hover:text-white">
                                        {isLogin ? '✨ Sign Up' : '🚪 Sign In'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current===false && user) {
      toast.error("You are already logged in. Please use the logout button.");  
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
    return () => { effectRan.current = true; 

    };
  }, [user, navigate]); 
  
  if (user) {
    return null;
  }

  return (
    <div className="homepage-container">
      <AuthForm />
    </div>
  );
};


export default HomePage;