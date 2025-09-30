import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/AuthForm';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import './index.css'
import DealerPage from './pages/DealerPage.jsx';
import { CartProvider } from './components/CartContext.jsx';
import './CustomerDashboard.css'
import CartPage from './components/CartPage.jsx';
import DeliveryDashboard from './pages/DeliveryDashboard.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import {Toaster} from 'react-hot-toast';
import { AuthProvider } from './components/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- Placeholder Components ---
// You should move these into their own files inside a 'pages' folder later.

const Home = () => (
  <div>
    <HomePage/>
  </div>
);

const Customerdash = () => <h2>Customer Dashboard</h2>;
const DealerDashboard = () => <h2>Dealer Dashboard</h2>;
const DeliveryDash = () => <h2>Delivery Personnel Dashboard</h2>;


function App() {
  return (
    <BrowserRouter>
    <CartProvider>
      <AuthProvider>
      
      <Routes>
        {/* Route for the homepage / login page */}
        <Route path="/" element={<Home />} />

        {/* Routes for the different user dashboards */}
        <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/dealer/dashboard" element={<ProtectedRoute><DealerPage /></ProtectedRoute>} />
        <Route path="/delivery/dashboard" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/customer/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
      </Routes>
    
    <Toaster 
            position="bottom-center"
            toastOptions={{
            // Define default options
            duration: 3000,
            style: {
            background: '#1F2937', // Matches your dark theme
            color: '#F9FAFB',
            border: '1px solid #374151',
            },
            }}
            />
      </AuthProvider>      
    </CartProvider>
  </BrowserRouter>
  );
}

export default App;