import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                items: cart.items.map(item => ({
                    menu: { id: item.menuId },
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await orderAPI.create(orderData);
            const order = response.data;

            // Clear cart and redirect to confirmation
            await clearCart();
            navigate('/order-confirmation', {
                state: { orderNumber: order.orderNumber }
            });
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error creating order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="container p-4">
            <h1 style={{
                textAlign: 'center',
                marginBottom: '2rem',
                color: 'var(--deep-navy)'
            }}>
                Checkout
            </h1>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="grid grid-2">
                    {/* Order Summary */}
                    <div className="card">
                        <h3 style={{
                            marginBottom: '1rem',
                            color: 'var(--teal)',
                            borderBottom: '2px solid var(--teal)',
                            paddingBottom: '0.5rem'
                        }}>
                            Order Summary
                        </h3>

                        {cart.items.map(item => (
                            <div key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #eee'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>{item.menuName}</p>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                        Qty: {item.quantity} × ${item.price}
                                    </p>
                                </div>
                                <p style={{ fontWeight: 'bold' }}>
                                    ${item.itemTotal}
                                </p>
                            </div>
                        ))}

                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '2px solid var(--teal)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }}>
                                <span>Total:</span>
                                <span style={{ color: 'var(--teal)' }}>
                  ${cart.totalAmount}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="card">
                        <h3 style={{
                            marginBottom: '1rem',
                            color: 'var(--teal)',
                            borderBottom: '2px solid var(--teal)',
                            paddingBottom: '0.5rem'
                        }}>
                            Customer Information
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--deep-navy)'
                                }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '2px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--deep-navy)'
                                }}>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '2px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--deep-navy)'
                                }}>
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '2px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1rem' }}
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;