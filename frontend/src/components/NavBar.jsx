import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ userType = "customer", userName, showAddButton = false, onAddClick, navLinks = [] }) => {
  
    const defaultLinks = {
        customer: [
            { to: "/customer/dashboard", label: "Home" },
            { to: "/customer/orders", label: "History" },
            { to: "/cart", label: "Cart" }
        ],
        dealer: [
        ],
        delivery: [
            { to: "/delivery/dashboard", label: "Home" }
        ]
    };

    const links = navLinks.length > 0 ? navLinks : defaultLinks[userType] || [];
    const welcomeMessage = userName ? `Hello, ${userName}!` : `Welcome, ${userType.charAt(0).toUpperCase() + userType.slice(1)}!`;

    return (
        <nav className="bg-gray-900/70 backdrop-blur-xl shadow-2xl border border-gray-700/50 p-4 overflow-hidden fixed top-0 left-1/4 z-[1000] flex flex-row justify-between items-center rounded-2xl w-[50vw] m-[3vh] mb-[5vh] font-['Poetsen_One'] text-green-50">
            <p className="text-[1.5rem]">PDS</p>
            <div className="flex flex-row justify-around items-center gap-[2vw]">
                <p className="text-base">{welcomeMessage}</p>
                <div className="navbar-right flex gap-2">
                    {links.map((link, index) => (
                        <Link 
                            key={index}
                            to={link.to} 
                            className="flex items-center justify-center h-[6vh] border-none text-white rounded-lg font-['Poetsen_One'] font-thin cursor-pointer px-[1vw] bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 hover:from-purple-700 hover:via-violet-700 hover:to-pink-700 transform hover:scale-105"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {showAddButton && (
                        <button 
                            className="flex items-center justify-center h-[6vh] border-none text-white rounded-lg font-['Poetsen_One'] font-thin cursor-pointer px-[1vw] bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transform hover:scale-105"
                            onClick={onAddClick}
                        >
                            Add Product
                        </button>
                    )}
                </div>
            </div>    
        </nav>
    );
};

export default NavBar;