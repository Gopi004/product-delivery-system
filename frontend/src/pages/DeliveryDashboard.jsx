import {useState} from "react";
import NavBar from "../components/NavBar";

function DeliveryDashboard() {

    return(
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden p-[4vh]">

            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse z-0"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-600/8 to-fuchsia-600/8 rounded-full blur-2xl animate-pulse delay-500 z-0"></div>

            <nav className="bg-gray-900/70 backdrop-blur-xl shadow-2xl border border-gray-700/50 p-4 overflow-hidden fixed top-0 left-1/4 z-[1000] flex flex-row justify-between items-center rounded-2xl w-[45vw] m-[3vh] mb-[5vh] font-['Poetsen_One'] text-green-50">
                <p className="text-[1.5rem]">PDS</p>
                <div className="flex flex-row justify-around items-center gap-[2vw]">
                    <p className="dealer-name">Hello, {/* name of the delivery guy */}</p>
                </div>
            </nav>
            
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