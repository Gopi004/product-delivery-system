import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Card from './components/card';
import './App.css';import './index.css'
import DealerPage from './pages/DealerPage.jsx';


// --- Placeholder Components ---
// You should move these into their own files inside a 'pages' folder later.

const HomePage = () => (
  <div>
    <AuthForm />
  </div>
);

const CustomerDashboard = () => <Card />
const DealerDashboard = () => <h2>Dealer Dashboard</h2>;
const DeliveryDashboard = () => <h2>Delivery Personnel Dashboard</h2>;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the homepage / login page */}
        <Route path="/" element={<HomePage />} />

        {/* Routes for the different user dashboards */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/dealer/dashboard" element={<DealerPage />} />
        <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;