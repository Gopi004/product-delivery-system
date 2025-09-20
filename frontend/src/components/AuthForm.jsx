// frontend/src/components/AuthForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

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
        <div className="container">
            <div className="heading-msg">
                <p className="sub-heading">Welcome to</p>
                <p className="heading">PRODUCT</p>
                <p className="heading">DELIVERY</p>
                <p className="heading">SYSTEM</p>
            </div>
            <div className='auth'>
                <h3>{isLogin ? 'Login' : 'Register'}</h3>
                <form className='form' onSubmit={handleSubmit}>
                    <div>
                        <select className='input' value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="customer">Customer</option>
                            <option value="dealer">Dealer</option>
                            <option value="delivery">Delivery Personnel</option>
                        </select>
                    </div>

                    {!isLogin && (
                        <>
                            <input className='input' type="text" name="name" placeholder='Name' value={formData.name} onChange={handleChange} required />
                            <input className='input' type="text" name="phone" placeholder='Phone' value={formData.phone} onChange={handleChange} />
                            <input className='input' type="text" name="address" placeholder='Address' value={formData.address} onChange={handleChange} />
                        </>
                    )}
                    <input className='input' type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} required />
                    <input className='input' type="password" name="password" placeholder='Password' value={formData.password} onChange={handleChange} required />

                    {error && <p className='auth-error' style={{ color: 'red' }}>{error}</p>}
                    <button className='auth-btn' type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <button className='auth-btn2' onClick={() => setIsLogin(!isLogin)}>
                    <u>{isLogin ? 'Need an account? Register' : 'Have an account? Login'}</u>
                </button>
            </div>
        </div>
    );
};

export default AuthForm;