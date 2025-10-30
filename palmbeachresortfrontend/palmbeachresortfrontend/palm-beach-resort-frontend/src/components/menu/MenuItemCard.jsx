import React, { useState, useRef, useEffect } from 'react';
import './MenuItemCard.css';

const MenuItemCard = ({ item, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imageRef = useRef(null);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleImageLoad = () => {
        setImageLoaded(true);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Mark as loaded to show placeholder
    };

    // Reset image states when item changes
    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [item.imageUrl]);

    const handleAddToCart = async () => {
        if (!item.available) return;

        setAddingToCart(true);
        const success = await onAddToCart(item.id, quantity);
        if (success) setQuantity(1);
        setAddingToCart(false);
    };

    // Use default image if image fails to load or is not provided
    const imageUrl = imageError || !item.imageUrl
        ? '/images/menu/default-food.jpg'
        : item.imageUrl;

    return (
        <div className={`menu-item-card ${!item.available ? 'unavailable' : ''}`}>
            {!item.available && <div className="unavailable-badge">Unavailable</div>}

            <div className="image-container">
                {!imageLoaded && (
                    <div className="image-placeholder">
                        <div className="loading-spinner-small"></div>
                    </div>
                )}
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={item.name}
                    className={`menu-item-image ${imageLoaded ? 'loaded' : 'hidden'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
            </div>

            <h3 className="menu-item-name">{item.name}</h3>
            <p className="menu-item-description">{item.description}</p>

            <div className="menu-item-meta">
                <div className="preparation-time">
                    <span>⏱️</span>
                    <span>{item.preparationTime || 15} mins</span>
                </div>
                <div className="menu-item-category">
                    <span>{item.category?.replace('_', ' ')}</span>
                </div>
            </div>

            <div className="menu-item-price">${item.price?.toFixed(2)}</div>

            {item.available && (
                <>
                    <div className="quantity-controls">
                        <button className="quantity-btn" onClick={handleDecrease}>-</button>
                        <span className="quantity-display">{quantity}</span>
                        <button className="quantity-btn" onClick={handleIncrease}>+</button>
                    </div>

                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                    >
                        {addingToCart ? 'Adding...' : `Add to Cart • $${(item.price * quantity).toFixed(2)}`}
                    </button>
                </>
            )}
        </div>
    );
};

export default MenuItemCard;