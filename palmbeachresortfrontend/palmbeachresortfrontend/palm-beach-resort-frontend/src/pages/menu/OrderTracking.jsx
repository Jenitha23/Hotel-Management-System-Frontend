import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/menuService';
import { useNavigate } from 'react-router-dom';
import './OrderTracking.css';

const OrderTracking = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Add this hook

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const orderData = await orderService.trackOrder(orderNumber.trim());
            setOrder(orderData);
        } catch (err) {
            setError('Order not found. Please check your order number.');
            setOrder(null);
            console.error('Error tracking order:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add back button handler
    const handleBackToDashboard = () => {
        navigate('/customer-dashboard');
    };

    const getStatusSteps = () => {
        const allStatuses = [
            'PENDING',
            'CONFIRMED',
            'PREPARING',
            'READY_FOR_DELIVERY',
            'OUT_FOR_DELIVERY',
            'DELIVERED'
        ];

        const currentStatusIndex = allStatuses.indexOf(order?.status);

        return allStatuses.map((status, index) => ({
            status,
            completed: index <= currentStatusIndex,
            current: index === currentStatusIndex
        }));
    };

    const getStatusColor = (status) => {
        const statusColors = {
            PENDING: '#FFA500',
            CONFIRMED: '#1CA1A6',
            PREPARING: '#FF7F6B',
            READY_FOR_DELIVERY: '#4CAF50',
            OUT_FOR_DELIVERY: '#2196F3',
            DELIVERED: '#666',
            CANCELLED: '#F44336'
        };
        return statusColors[status] || '#666';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstimatedTime = () => {
        if (!order?.estimatedPreparationTime) return null;

        const created = new Date(order.createdAt);
        const estimatedCompletion = new Date(created.getTime() + order.estimatedPreparationTime * 60000);
        const now = new Date();

        const diffMs = estimatedCompletion - now;
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins <= 0) return 'Any moment now';
        return `Approx. ${diffMins} minutes`;
    };

    return (
        <div className="order-tracking-page">
            {/* Updated Header with Back Button */}
            <div className="tracking-header">
                <button
                    className="back-button"
                    onClick={handleBackToDashboard}
                >
                    ← Back to Dashboard
                </button>
                <h1>Track Your Order</h1>
                <p>Enter your order number to track its status</p>
            </div>

            <form onSubmit={handleTrackOrder} className="tracking-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Enter order number (e.g., FOD123456)"
                        className="order-input"
                        required
                    />
                    <button
                        type="submit"
                        className="track-btn"
                        disabled={loading || !orderNumber.trim()}
                    >
                        {loading ? 'Tracking...' : 'Track Order'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                </div>
            )}

            {order && (
                <div className="order-tracking-result">
                    <div className="order-summary-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h2>Order #{order.orderNumber}</h2>
                                <span className="order-date">
                                    Placed on {formatDate(order.createdAt)}
                                </span>
                            </div>
                            <div
                                className="order-status-badge"
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {order.status.replace(/_/g, ' ')}
                            </div>
                        </div>

                        {order.estimatedPreparationTime && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <div className="estimated-time">
                                <span className="time-icon">⏱️</span>
                                <span>{getEstimatedTime()}</span>
                            </div>
                        )}

                        {order.roomNumber && (
                            <div className="delivery-info">
                                <span className="info-label">Delivery to:</span>
                                <span className="info-value">Room {order.roomNumber}</span>
                            </div>
                        )}
                    </div>

                    {order.status !== 'CANCELLED' && (
                        <div className="status-timeline">
                            <h3>Order Status</h3>
                            <div className="timeline">
                                {getStatusSteps().map((step, index) => (
                                    <div key={step.status} className="timeline-step">
                                        <div className={`step-indicator ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                                            {step.completed ? '✓' : index + 1}
                                        </div>
                                        <div className="step-content">
                                            <span className={`step-status ${step.current ? 'current' : ''}`}>
                                                {step.status.replace(/_/g, ' ')}
                                            </span>
                                            {step.current && (
                                                <span className="current-indicator">Current</span>
                                            )}
                                        </div>
                                        {index < getStatusSteps().length - 1 && (
                                            <div className={`step-connector ${step.completed ? 'completed' : ''}`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="order-details-card">
                        <h3>Order Details</h3>
                        <div className="order-items-list">
                            {order.items?.map(item => (
                                <div key={item.id} className="order-item">
                                    <img
                                        src={item.menuItemImage || '/images/menu/default-food.jpg'}
                                        alt={item.menuItemName}
                                        className="item-image"
                                    />
                                    <div className="item-info">
                                        <h4>{item.menuItemName}</h4>
                                        <div className="item-quantity-price">
                                            <span>Quantity: {item.quantity}</span>
                                            <span>${item.unitPrice?.toFixed(2)} each</span>
                                        </div>
                                    </div>
                                    <div className="item-subtotal">
                                        ${item.subtotal?.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <div className="total-row">
                                <span>Total Amount:</span>
                                <span className="total-amount">${order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>

                        {order.specialInstructions && (
                            <div className="special-instructions">
                                <h4>Special Instructions:</h4>
                                <p>{order.specialInstructions}</p>
                            </div>
                        )}
                    </div>

                    {order.canCancel && order.status !== 'CANCELLED' && (
                        <div className="order-actions">
                            <button className="cancel-order-btn">
                                Cancel Order
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!order && !error && (
                <div className="tracking-guide">
                    <div className="guide-content">
                        <h3>How to Track Your Order</h3>
                        <div className="guide-steps">
                            <div className="guide-step">
                                <span className="step-number">1</span>
                                <p>Find your order number in your order confirmation email</p>
                            </div>
                            <div className="guide-step">
                                <span className="step-number">2</span>
                                <p>Enter the order number in the field above</p>
                            </div>
                            <div className="guide-step">
                                <span className="step-number">3</span>
                                <p>Click "Track Order" to see Real-time status updates</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;