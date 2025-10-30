import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminOrderService } from '../../services/menuService';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [updatingStatus, setUpdatingStatus] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;
        if (statusFilter !== 'ALL') {
            filtered = orders.filter(order => order.status === statusFilter);
        }
        setFilteredOrders(filtered);
    }, [orders, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const ordersData = await adminOrderService.getAllOrders();
            setOrders(ordersData || []);
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
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

            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(updatedOrder);
            }

            alert(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
        } catch (err) {
            alert(err.message || 'Failed to update order status');
            console.error('Error updating order status:', err);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return;
        }

        try {
            await adminOrderService.deleteOrder(orderId);
            setOrders(prev => prev.filter(order => order.id !== orderId));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(null);
            }
            alert('Order deleted successfully');
        } catch (err) {
            alert(err.message || 'Failed to delete order');
            console.error('Error deleting order:', err);
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

    const getNextStatusOptions = (currentStatus) => {
        const statusFlow = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['PREPARING', 'CANCELLED'],
            PREPARING: ['READY_FOR_DELIVERY'],
            READY_FOR_DELIVERY: ['OUT_FOR_DELIVERY'],
            OUT_FOR_DELIVERY: ['DELIVERED'],
            DELIVERED: [],
            CANCELLED: []
        };
        return statusFlow[currentStatus] || [];
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

    const getStatusCounts = () => {
        const counts = {
            ALL: orders.length,
            PENDING: 0,
            CONFIRMED: 0,
            PREPARING: 0,
            READY_FOR_DELIVERY: 0,
            OUT_FOR_DELIVERY: 0,
            DELIVERED: 0,
            CANCELLED: 0
        };

        orders.forEach(order => {
            if (counts[order.status] !== undefined) {
                counts[order.status]++;
            }
        });

        return counts;
    };

    const statusCounts = getStatusCounts();

    if (loading) {
        return (
            <div className="admin-orders-page">
                <div className="admin-page-header">
                    <h1 className="page-title">Order Management</h1>
                    <p className="page-subtitle">Manage and track all food orders</p>
                </div>
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders-page">
            <div className="admin-page-header">
                <h1 className="page-title">Order Management</h1>
                <p className="page-subtitle">Manage and track all food orders</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{statusCounts.ALL}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{statusCounts.PENDING}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{statusCounts.PREPARING}</div>
                    <div className="stat-label">Preparing</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{statusCounts.READY_FOR_DELIVERY + statusCounts.OUT_FOR_DELIVERY}</div>
                    <div className="stat-label">For Delivery</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{statusCounts.DELIVERED}</div>
                    <div className="stat-label">Delivered</div>
                </div>
            </div>

            <div className="admin-controls">
                <div className="filter-controls">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="ALL">All Orders ({statusCounts.ALL})</option>
                        <option value="PENDING">Pending ({statusCounts.PENDING})</option>
                        <option value="CONFIRMED">Confirmed ({statusCounts.CONFIRMED})</option>
                        <option value="PREPARING">Preparing ({statusCounts.PREPARING})</option>
                        <option value="READY_FOR_DELIVERY">Ready for Delivery ({statusCounts.READY_FOR_DELIVERY})</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery ({statusCounts.OUT_FOR_DELIVERY})</option>
                        <option value="DELIVERED">Delivered ({statusCounts.DELIVERED})</option>
                        <option value="CANCELLED">Cancelled ({statusCounts.CANCELLED})</option>
                    </select>

                    <button
                        className="btn btn-secondary"
                        onClick={fetchOrders}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-alert">
                    <span>{error}</span>
                    <button onClick={fetchOrders} className="btn btn-sm">Try Again</button>
                </div>
            )}

            <div className="orders-container">
                <div className="orders-list">
                    <h2>Orders ({filteredOrders.length})</h2>
                    {filteredOrders.length === 0 ? (
                        <div className="no-orders-message">
                            <div className="empty-icon">📦</div>
                            <h3>No Orders Found</h3>
                            <p>No orders match the current filter.</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div
                                key={order.id}
                                className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>#{order.orderNumber}</h3>
                                        <span className="customer-name">{order.customerName}</span>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div
                                        className="order-status"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
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
                                                +{order.items.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                    <div className="order-meta">
                                        {order.roomNumber && (
                                            <span className="room-number">Room {order.roomNumber}</span>
                                        )}
                                        <div className="order-total">${order.totalAmount?.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="order-actions">
                                    {getNextStatusOptions(order.status).map(status => (
                                        <button
                                            key={status}
                                            className="status-update-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusUpdate(order.id, status);
                                            }}
                                            disabled={updatingStatus === order.id}
                                            style={{ backgroundColor: getStatusColor(status) }}
                                        >
                                            {updatingStatus === order.id ? 'Updating...' : `Mark as ${status.replace(/_/g, ' ')}`}
                                        </button>
                                    ))}

                                    <button
                                        className="delete-order-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOrder(order.id);
                                        }}
                                        title="Delete Order"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
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
                                <span className="info-label">Customer:</span>
                                <span className="info-value">{selectedOrder.customerName}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{selectedOrder.customerEmail}</span>
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
                            {selectedOrder.estimatedPreparationTime && (
                                <div className="info-row">
                                    <span className="info-label">Est. Prep Time:</span>
                                    <span className="info-value">{selectedOrder.estimatedPreparationTime} mins</span>
                                </div>
                            )}
                            {selectedOrder.specialInstructions && (
                                <div className="info-row">
                                    <span className="info-label">Special Instructions:</span>
                                    <span className="info-value">{selectedOrder.specialInstructions}</span>
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

                        <div className="order-actions-section">
                            <h3>Update Status</h3>
                            <div className="status-buttons">
                                {getNextStatusOptions(selectedOrder.status).map(status => (
                                    <button
                                        key={status}
                                        className="status-update-btn full-width"
                                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                                        disabled={updatingStatus === selectedOrder.id}
                                        style={{ backgroundColor: getStatusColor(status) }}
                                    >
                                        {updatingStatus === selectedOrder.id ? 'Updating...' : `Mark as ${status.replace(/_/g, ' ')}`}
                                    </button>
                                ))}
                                {getNextStatusOptions(selectedOrder.status).length === 0 && (
                                    <p className="no-actions">No further actions available for this status.</p>
                                )}
                            </div>

                            <button
                                className="delete-order-btn full-width"
                                onClick={() => handleDeleteOrder(selectedOrder.id)}
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrdersPage;
