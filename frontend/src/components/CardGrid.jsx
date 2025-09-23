import React from "react";
import Card from "./card";
import mechanicalKeyboard from '../assets/mech_keyboard.png';
import NavBar from "./NavBar";

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

const CardGrid = () => {
    return (
        <div>
        <div><NavBar /></div>
        <div className="card-grid">
            {products.map(product => (  
                <Card key={product.id} product={product} />
            ))}
        </div>
        </div>

    );
};
export default CardGrid;