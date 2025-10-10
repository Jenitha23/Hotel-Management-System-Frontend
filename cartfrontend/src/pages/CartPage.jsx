import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, updateCartItem, removeFromCart, clearCart } = useCart();

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container p-4 text-center">
                <ShoppingBag size={64} color="var(--teal)" style={{ margin: '2rem auto' }} />
                <h2 style={{ marginBottom: '1rem', color: 'var(--deep-navy)' }}>
                    Your cart is empty
                </h2>
                <p style={{ marginBottom: '2rem', color: '#666' }}>
                    Discover our delicious beachside menu and add some items to your cart!
                </p>
                <Link to="/" className="btn btn-primary">
                    Browse Menu
                </Link>
            </div>
        );
    }

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateCartItem(itemId, newQuantity);
    };

    const handleRemoveItem = async (itemId) => {
        await removeFromCart(itemId);
    };

    return (
        <div className="container p-4">
            <h1 style={{
                textAlign: 'center',
                marginBottom: '2rem',
                color: 'var(--deep-navy)'
            }}>
                Your Beach Cart
            </h1>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card">
                    {cart.items.map(item => (
                        <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem 0',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ marginBottom: '0.5rem', color: 'var(--deep-navy)' }}>
                                    {item.menuName}
                                </h4>
                                <p style={{ color: 'var(--coral)', fontWeight: 'bold' }}>
                                    ${item.price}
                                </p>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                margin: '0 1rem'
                            }}>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="btn"
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: 'var(--sand)',
                                        color: 'var(--deep-navy)'
                                    }}
                                >
                                    <Minus size={16} />
                                </button>

                                <span style={{
                                    minWidth: '30px',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}>
                  {item.quantity}
                </span>

                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="btn"
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: 'var(--sand)',
                                        color: 'var(--deep-navy)'
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                <p style={{ fontWeight: 'bold', color: 'var(--deep-navy)' }}>
                                    ${item.itemTotal}
                                </p>
                            </div>

                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="btn"
                                style={{
                                    marginLeft: '1rem',
                                    padding: '5px 10px',
                                    backgroundColor: 'var(--coral)',
                                    color: 'var(--white)'
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <div style={{
                        paddingTop: '1rem',
                        borderTop: '2px solid var(--teal)',
                        marginTop: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            <span>Total:</span>
                            <span style={{ color: 'var(--teal)' }}>
                ${cart.totalAmount}
              </span>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '2rem',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            onClick={clearCart}
                            className="btn btn-outline"
                        >
                            Clear Cart
                        </button>

                        <Link to="/checkout" className="btn btn-primary">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;