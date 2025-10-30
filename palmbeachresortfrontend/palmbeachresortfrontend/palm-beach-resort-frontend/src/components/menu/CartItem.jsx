import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const handleIncrease = () => onUpdateQuantity(item.id, item.quantity + 1);
    const handleDecrease = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        } else {
            onRemove(item.id);
        }
    };

    return (
        <div className="cart-item">
            <img
                src={item.menuItemImage || '/images/menu/default-food.jpg'}
                alt={item.menuItemName}
                className="cart-item-image"
            />

            <div className="cart-item-details">
                <h4 className="cart-item-name">{item.menuItemName}</h4>
                <div className="cart-item-price">
                    ${item.unitPrice?.toFixed(2)} × {item.quantity}
                </div>
                <div className="cart-item-subtotal">
                    ${item.subtotal?.toFixed(2)}
                </div>
            </div>

            <div className="cart-item-controls">
                <div className="quantity-controls-small">
                    <button className="quantity-btn-small" onClick={handleDecrease}>-</button>
                    <span className="quantity-display-small">{item.quantity}</span>
                    <button className="quantity-btn-small" onClick={handleIncrease}>+</button>
                </div>
                <button
                    className="remove-item-btn"
                    onClick={() => onRemove(item.id)}
                    title="Remove item"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default CartItem;