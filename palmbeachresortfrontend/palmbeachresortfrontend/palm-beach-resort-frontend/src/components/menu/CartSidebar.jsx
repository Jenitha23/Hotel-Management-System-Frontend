import React from 'react';
import CartItem from './CartItem';
import './CartSidebar.css';

const CartSidebar = ({
                         isOpen,
                         onClose,
                         cart,
                         onUpdateQuantity,
                         onRemoveItem,
                         onClearCart,
                         onCheckout,
                         loading
                     }) => {
    return (
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="cart-header">
                <h2 className="cart-title">Your Order</h2>
                <button className="close-cart" onClick={onClose}>×</button>
            </div>

            <div className="cart-items">
                {loading ? (
                    <div className="loading-cart">Loading...</div>
                ) : cart?.items?.length > 0 ? (
                    <>
                        {cart.items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemoveItem}
                            />
                        ))}
                        <button className="clear-cart-btn" onClick={onClearCart}>
                            Clear Cart
                        </button>
                    </>
                ) : (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Your cart is empty</p>
                    </div>
                )}
            </div>

            {cart?.items?.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>${cart.totalAmount?.toFixed(2)}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={onCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartSidebar;