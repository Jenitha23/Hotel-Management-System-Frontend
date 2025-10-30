
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/menuService';
import './CustomerOrderHistory.css';

const CustomerOrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancellingOrder, setCancellingOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const ordersData = await orderService.getCustomerOrders();
            setOrders(ordersData || []);
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setCancellingOrder(orderId);
            const updatedOrder = await orderService.cancelOrder(orderId);

            // Update the order in the list
            setOrders(prev => prev.map(order =>
                order.id === orderId ? updatedOrder : order
            ));

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(updatedOrder);
            }

            alert('Order cancelled successfully');
        } catch (err) {
            alert(err.message || 'Failed to cancel order');
            console.error('Error cancelling order:', err);
        } finally {
            setCancellingOrder(null);
        }
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

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-header">
                    <h1>My Food Orders</h1>
                    <p>Track your food orders and status</p>
                </div>
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>My Food Orders</h1>
                <p>Track your food orders and status</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={fetchOrders} className="retry-btn">Retry</button>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="no-orders-message">
                    <div className="empty-icon">📦</div>
                    <h3>No Orders Yet</h3>
                    <p>Your food orders will appear here once you place an order.</p>
                </div>
            ) : (
                <div className="orders-container">
                    <div className="orders-list">
                        <h2>Order History ({orders.length})</h2>
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>Order #{order.orderNumber}</h3>
                                        <span className="order-date">
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                    <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                                        {order.status.replace(/_/g, ' ')}
                                    </div>
                                </div>

                                <div className="order-summary">
                                    <div className="order-items">
                                        {order.items?.slice(0, 2).map(item => (
                                            <span key={item.id} className="item-name">
                                                {item.menuItemName} × {item.quantity}
                                            </span>
                                        ))}
                                        {order.items?.length > 2 && (
                                            <span className="more-items">
                                                +{order.items.length - 2} more items
                                            </span>
                                        )}
                                    </div>
                                    <div className="order-total">
                                        ${order.totalAmount?.toFixed(2)}
                                    </div>
                                </div>

                                {order.canCancel && order.status !== 'CANCELLED' && (
                                    <button
                                        className="cancel-order-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to cancel this order?')) {
                                                handleCancelOrder(order.id);
                                            }
                                        }}
                                        disabled={cancellingOrder === order.id}
                                    >
                                        {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {selectedOrder && (
                        <div className="order-details">
                            <div className="details-header">
                                <h2>Order Details</h2>
                                <button
                                    className="close-details"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="order-info-section">
                                <div className="info-row">
                                    <span className="info-label">Order Number:</span>
                                    <span className="info-value">{selectedOrder.orderNumber}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Order Date:</span>
                                    <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Status:</span>
                                    <span
                                        className="info-value status-badge"
                                        style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                                    >
                                        {selectedOrder.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                {selectedOrder.roomNumber && (
                                    <div className="info-row">
                                        <span className="info-label">Room Number:</span>
                                        <span className="info-value">{selectedOrder.roomNumber}</span>
                                    </div>
                                )}
                                {selectedOrder.specialInstructions && (
                                    <div className="info-row">
                                        <span className="info-label">Special Instructions:</span>
                                        <span className="info-value">{selectedOrder.specialInstructions}</span>
                                    </div>
                                )}
                                {selectedOrder.estimatedPreparationTime && (
                                    <div className="info-row">
                                        <span className="info-label">Est. Preparation Time:</span>
                                        <span className="info-value">{selectedOrder.estimatedPreparationTime} mins</span>
                                    </div>
                                )}
                            </div>

                            <div className="order-items-section">
                                <h3>Order Items</h3>
                                {selectedOrder.items?.map(item => (
                                    <div key={item.id} className="order-item">
                                        <img
                                            src={item.menuItemImage || '/images/menu/default-food.jpg'}
                                            alt={item.menuItemName}
                                            className="item-image"
                                        />
                                        <div className="item-details">
                                            <h4>{item.menuItemName}</h4>
                                            <div className="item-price">
                                                ${item.unitPrice?.toFixed(2)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="item-subtotal">
                                            ${item.subtotal?.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total-section">
                                <div className="total-row">
                                    <span>Total Amount:</span>
                                    <span className="total-amount">${selectedOrder.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>

                            {selectedOrder.canCancel && selectedOrder.status !== 'CANCELLED' && (
                                <button
                                    className="cancel-order-btn full-width"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this order?')) {
                                            handleCancelOrder(selectedOrder.id);
                                        }
                                    }}
                                    disabled={cancellingOrder === selectedOrder.id}
                                >
                                    {cancellingOrder === selectedOrder.id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerOrderHistory;
