import React from "react";
import Card from "./Card";


const CardGrid = ({ products, actor,onEdit, onDelete }) => {
    return (
        <div className="card-grid">
            {products.map(product => (
                <Card 
                    key={product.product_id} 
                    product={product} 
                    view={actor}
                    
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default CardGrid;