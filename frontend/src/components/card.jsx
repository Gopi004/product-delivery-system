import React from "react";
import mechanicalKeyboard from "../assets/mech_keyboard.png";

const Card = () =>{

    return(
        <div className="card">
            <div className="image-container">
                <img src={mechanicalKeyboard} alt="keyboard" className="product-image" />
            </div>

            <div className="product-details">
                <h2 className="product-title">Mechanical Keyboard</h2>
                <p className="product-description">A high-quality mechanical keyboard with customizable RGB lighting and programmable keys.</p>
                <p className="product-price">$120.00</p>
                <button className="buy-button">Buy Now</button>
            </div>
        </div>
    );
};

export default Card;