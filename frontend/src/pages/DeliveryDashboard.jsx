import {useState, useEffect} from "react";
import NavBar from "../components/NavBar.jsx";
import axios from "axios";

function DeliveryDashboard() {
    const [deliveries, setDeliveries] = useState([]);
    const [error,setError] = useState("");
    const [loading,setLoading]=useState(true);
    const [updatingDelivery,setUpdatingDelivery]=useState(null);

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

       useEffect(() => {
        fetchMyDeliveries();
    }, []);





    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden p-[4vh]">

            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500 z-0"></div>

            <NavBar 
                userType="delivery" 
                userName="Delivery Personnel"
            />
            
            <div className="relative z-10 mt-[15vh] mx-[7.5vw]">
                <div>
                    <h3 className="text-white/80 text-[1.5rem] font-['Poetsen_One'] pb-2 ">My Assignments</h3>
                    <hr className="mb-[3vh] text-white/50" />
                    <div className="m-0 mx-[0vw] w-[80vw] rounded-[15px] bg-gray-900/70 flex flex-col items-center pb-[9vh]">
                        



                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryDashboard;