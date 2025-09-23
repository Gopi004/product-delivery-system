import React,{useState} from "react";
import addCartIcon from "../assets/add_to_cart.png";
const Card = ({product}) =>{
    const[quantity,setQuantity] = useState(1);
    const handleIncrement = () =>{
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () =>{
        if(quantity > 1){
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };
    
    return(
        <div className="card">
            <div className="image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
            </div>

            <div className="product-details">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <div className="action-section">
                    <div className="quantity-counter">
                    <button onClick={handleDecrement}>-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrement}>+</button>
                </div>
                <button className="buy-button"><img src={addCartIcon} alt="cart-image" className="cart-icon"/></button>
                </div>
            </div>
        </div>
    );
};

export default Card;