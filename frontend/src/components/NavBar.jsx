import React from "react";

const NavBar = () => {
    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <div className="navbar-left">
                    <span className="navbar-app-name">PDS</span>
                </div>
                <div className="navbar-right">
                    <button className="navbar-button">Home</button>
                    <button className="navbar-button">History</button>
                    <button className="navbar-button">Cart</button>
                </div>
            </div>    
        </nav>
    );
};

export default NavBar;