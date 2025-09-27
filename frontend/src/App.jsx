import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import './index.css'
import DealerPage from './pages/DealerPage.jsx';
import { CartProvider } from './components/CartContext.jsx';
import './CustomerDashboard.css'
import CartPage from './components/CartPage.jsx';

// --- Placeholder Components ---
// You should move these into their own files inside a 'pages' folder later.

const HomePage = () => (
  <div>
    <AuthForm />
  </div>
);

const Customerdash = () => <h2>Customer Dashboard</h2>;
const DealerDashboard = () => <h2>Dealer Dashboard</h2>;
const DeliveryDashboard = () => <h2>Delivery Personnel Dashboard</h2>;


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
      <Routes>
        {/* Route for the homepage / login page */}
        <Route path="/" element={<HomePage />} />

        {/* Routes for the different user dashboards */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/dealer/dashboard" element={<DealerPage />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;