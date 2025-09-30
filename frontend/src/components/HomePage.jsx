import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AuthForm from '../components/AuthForm'; // Assuming AuthForm is in components
import toast from 'react-hot-toast';


const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      toast.error("You are already logged in.");
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || user) {
    return <div>Loading...</div>; // Show loading or nothing while checking/redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* All the beautiful background elements can go here */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center lg:justify-between">
        <div className="hidden lg:block text-white space-y-4">
          {/* ... Your welcome text ... */}
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default HomePage;