import React,{useState} from "react";
import addCartIcon from "../assets/add_to_cart.png";
import mechanicalKeyboard from '../assets/mech_keyboard.png';
import { useCart } from "./CartContext";

const products = [
  { 
    id: 'p1', 
    name: 'Mechanical Keyboard', 
    price: 120, 
    description: 'A high-quality mechanical keyboard.',
    imageUrl: mechanicalKeyboard // The imported image
  },
  { 
    id: 'p2', 
    name: 'Gaming Mouse', 
    price: 75, 
    description: 'A responsive mouse for gaming.',
    imageUrl: mechanicalKeyboard // You would import this
  },
  { 
    id: 'p3', 
    name: 'Gaming Headset', 
    price: 120, 
    description: 'A high-quality gaming headset.',
    imageUrl: mechanicalKeyboard // The imported image
  },
  { 
    id: 'p4', 
    name: 'Gaming controller', 
    price: 75, 
    description: 'A responsive controller for gaming.',
    imageUrl: mechanicalKeyboard // You would import this
  },
];



const Card = ({product,view,onAddToCart,onEdit,onDelete}) =>{
    console.log("View prop in Card component:", view);
    const[quantity,setQuantity] = useState(0);
    const { addToCart } = useCart();
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
                    {view==='customer' && ( 
                    <>
                        <div className="quantity-counter">
                            <button onClick={handleDecrement}>-</button>
                            <span>{quantity}</span>
                            <button onClick={handleIncrement}>+</button>
                        </div>
                        <button className="action-button icon-button" onClick={()=>addToCart(product,quantity)}>
                                <img src={addCartIcon} alt="cart-image" className="cart-icon"/>
                        </button>
                    </>
                    )}

                {view==='dealer' && (
                <div className="action-section">
                    <button className="action-button text-button">Edit</button>
                    <button className="action-button text-button">Delete</button>
                </div>
                )}
                

                </div>
             
            </div>
        </div>
    );
};

const CardGrid = ({actor}) => {
    return (
        <div>
        <div className="card-grid">
            {products.map(product => (  
                <Card key={product.id} product={product} view={actor} />
            ))}
        </div>
        </div>

    );
};


export default CardGrid;