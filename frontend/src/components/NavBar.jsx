import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar-container">
            <div className="navbar-content">
                <div className="navbar-left">
                    <span className="navbar-app-name">PDS</span>
                </div>
                <div className="navbar-right">
                    <Link to="/" className="navbar-button">Home</Link>
                    <Link to="/history" className="navbar-button">History</Link>
                    <Link to="/cart" className="navbar-button">Cart</Link>
                </div>
            </div>    
        </nav>
    );
};

export default NavBar;