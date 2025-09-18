// frontend/src/components/AuthForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('customer');
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
        const url = `http://localhost:5000/api/${action}/${role}`;

        try {
            const response = await axios.post(url, formData);
            if (isLogin) {
                localStorage.setItem('token', response.data.token);
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
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">Customer</option>
                        <option value="dealer">Dealer</option>
                        <option value="delivery">Delivery Personnel</option>
                    </select>
                </div>
                {!isLogin && (
                    <>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        {/* 2. Added Phone and Address inputs */}
                        <div>
                            <label>Phone:</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Address:</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                    </>
                )}
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
        </div>
    );
};

export default AuthForm;