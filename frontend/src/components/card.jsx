import React, { useState } from "react";
import addCartIcon from "../assets/add_to_cart.png";
import { useCart } from "./CartContext";

const Card = ({ product, view, onAddToCart, onEdit, onDelete }) => {
    
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };
    
    return (
        <div className="card">
            <div className="image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
            </div>

            <div className="product-details">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>

                <div className="action-section">
                    {view === 'customer' && (
                        <>
                            <div className="quantity-counter">
                                <button onClick={handleDecrement}>-</button>
                                <span>{quantity}</span>
                                <button onClick={handleIncrement}>+</button>
                            </div>
                            <button className="action-button icon-button" onClick={() => onAddToCart(product, quantity)}>
                                <img src={addCartIcon} alt="cart-image" className="cart-icon"/>
                            </button>
                        </>
                    )}

                    {view === 'dealer' && (
                        <div className="dealer-actions">
                          
                            <button className="action-button text-button" onClick={() => onEdit(product)}>Edit</button>
                            <button className="action-button text-button" onClick={() => onDelete(product.product_id)}>Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;