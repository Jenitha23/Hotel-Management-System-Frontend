import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminOrderService } from '../../services/menuService';
import './KitchenDashboard.css';

const KitchenDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        fetchActiveOrders();

        if (autoRefresh) {
            const interval = setInterval(fetchActiveOrders, 10000); // Refresh every 10 seconds
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const fetchActiveOrders = async () => {
        try {
            setError(null);
            const ordersData = await adminOrderService.getActiveKitchenOrders();
            setOrders(ordersData || []);
        } catch (err) {
            setError('Failed to load active orders');
            console.error('Error fetching active orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(orderId);
            const updatedOrder = await adminOrderService.updateOrderStatus(orderId, newStatus);

            // Update the order in the list
            setOrders(prev => prev.map(order =>
                order.id === orderId ? updatedOrder : order
            ));

            alert(`Order marked as ${newStatus.replace(/_/g, ' ')}`);
        } catch (err) {
            alert(err.message || 'Failed to update order status');
            console.error('Error updating order status:', err);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            PENDING: '#FFA500',
            CONFIRMED: '#1CA1A6',
            PREPARING: '#FF7F6B',
            READY_FOR_DELIVERY: '#4CAF50'
        };
        return statusColors[status] || '#666';
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            PENDING: { next: 'CONFIRMED', label: 'Confirm Order', color: '#1CA1A6' },
            CONFIRMED: { next: 'PREPARING', label: 'Start Preparing', color: '#FF7F6B' },
            PREPARING: { next: 'READY_FOR_DELIVERY', label: 'Mark as Ready', color: '#4CAF50' }
        };
        return statusFlow[currentStatus];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getTimeElapsed = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours}h ${diffMins % 60}m ago`;
    };

    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };

    const statusColumns = [
        { status: 'PENDING', title: 'New Orders', icon: '🆕' },
        { status: 'CONFIRMED', title: 'Confirmed', icon: '✅' },
        { status: 'PREPARING', title: 'Preparing', icon: '👨‍🍳' },
        { status: 'READY_FOR_DELIVERY', title: 'Ready', icon: '📦' }
    ];

    if (loading) {
        return (
            <div className="kitchen-dashboard">
                <div className="kitchen-header">
                    <h1>Kitchen Dashboard</h1>
                    <p>Real-time order management for kitchen staff</p>
                </div>
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading active orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="kitchen-dashboard">
            <div className="kitchen-header">
                <div className="header-content">
                    <div>
                        <h1>Kitchen Dashboard</h1>
                        <p>Real-time order management for kitchen staff</p>
                    </div>
                    <div className="header-controls">
                        <button
                            className={`refresh-btn ${autoRefresh ? 'active' : ''}`}
                            onClick={() => setAutoRefresh(!autoRefresh)}
                        >
                            {autoRefresh ? '🔄 Auto Refresh ON' : '⏸️ Auto Refresh OFF'}
                        </button>
                        <button
                            className="refresh-btn"
                            onClick={fetchActiveOrders}
                        >
                            🔄 Refresh Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="kitchen-stats">
                <div className="stat-card">
                    <div className="stat-icon">🆕</div>
                    <div className="stat-info">
                        <div className="stat-number">{getOrdersByStatus('PENDING').length}</div>
                        <div className="stat-label">New Orders</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <div className="stat-number">{getOrdersByStatus('CONFIRMED').length}</div>
                        <div className="stat-label">Confirmed</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍🍳</div>
                    <div className="stat-info">
                        <div className="stat-number">{getOrdersByStatus('PREPARING').length}</div>
                        <div className="stat-label">Preparing</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <div className="stat-number">{getOrdersByStatus('READY_FOR_DELIVERY').length}</div>
                        <div className="stat-label">Ready</div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={fetchActiveOrders} className="retry-btn">Retry</button>
                </div>
            )}

            <div className="kitchen-board">
                {statusColumns.map(column => (
                    <div key={column.status} className="status-column">
                        <div className="column-header">
                            <span className="column-icon">{column.icon}</span>
                            <h3>{column.title}</h3>
                            <span className="order-count">({getOrdersByStatus(column.status).length})</span>
                        </div>
                        <div className="orders-list">
                            {getOrdersByStatus(column.status).map(order => (
                                <div key={order.id} className="kitchen-order-card">
                                    <div className="order-header">
                                        <div className="order-number">#{order.orderNumber}</div>
                                        <div className="order-time">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>

                                    <div className="order-meta">
                                        <span className="room-number">Room {order.roomNumber}</span>
                                        <span className="time-ago">{getTimeElapsed(order.createdAt)}</span>
                                    </div>

                                    <div className="order-items">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="order-item">
                                                <span className="item-quantity">{item.quantity}×</span>
                                                <span className="item-name">{item.menuItemName}</span>
                                                {item.menuItemImage && (
                                                    <img
                                                        src={item.menuItemImage}
                                                        alt={item.menuItemName}
                                                        className="item-image"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {order.specialInstructions && (
                                        <div className="special-instructions">
                                            <strong>Note:</strong> {order.specialInstructions}
                                        </div>
                                    )}

                                    {order.estimatedPreparationTime && (
                                        <div className="prep-time">
                                            ⏱️ Est: {order.estimatedPreparationTime} mins
                                        </div>
                                    )}

                                    <div className="order-actions">
                                        {getNextStatus(order.status) && (
                                            <button
                                                className="status-action-btn"
                                                onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status).next)}
                                                disabled={updatingStatus === order.id}
                                                style={{ backgroundColor: getNextStatus(order.status).color }}
                                            >
                                                {updatingStatus === order.id ? '...' : getNextStatus(order.status).label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {getOrdersByStatus(column.status).length === 0 && (
                                <div className="empty-column">
                                    <div className="empty-icon">📝</div>
                                    <p>No orders</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {orders.length === 0 && !loading && (
                <div className="no-active-orders">
                    <div className="empty-state">
                        <div className="empty-icon">👨‍🍳</div>
                        <h3>No Active Orders</h3>
                        <p>All caught up! New orders will appear here automatically.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenDashboard;
