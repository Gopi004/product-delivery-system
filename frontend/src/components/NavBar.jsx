import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="bg-gray-900/70 backdrop-blur-xl shadow-2xl border border-gray-700/50 p-4 overflow-hidden fixed top-0 left-1/4 z-[1000] flex flex-row justify-between items-center rounded-2xl w-[50vw] m-[3vh] mb-[5vh] font-['Poetsen_One'] text-green-50">
            <p className="text-[1.5rem]">PDS</p>
            <div className="flex flex-row justify-around items-center gap-[2vw]">
                <p className="text-base">Welcome, Customer!</p>
                <div className="navbar-right">
                    <Link to="/" className="flex items-center justify-center h-[6vh] border-none text-white rounded-lg font-['Poetsen_One'] font-thin cursor-pointer px-[1vw] bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105" >Home</Link>
                    <Link to="/history" className="flex items-center justify-center h-[6vh] border-none text-white rounded-lg font-['Poetsen_One'] font-thin cursor-pointer px-[1vw] bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105">History</Link>
                    <Link to="/cart" className="flex items-center justify-center h-[6vh] border-none text-white rounded-lg font-['Poetsen_One'] font-thin cursor-pointer px-[1vw] bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105">Cart</Link>
                </div>
            </div>    
        </nav>
    );
};

export default NavBar;