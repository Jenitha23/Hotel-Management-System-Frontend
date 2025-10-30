import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/menuService';
import { invoiceService } from '../services/invoiceService';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentOrders, setRecentOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        activeOrders: 0,
        deliveredOrders: 0
    });
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [invoiceError, setInvoiceError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Load orders and invoice in parallel, but don't fail if invoice fails
            await loadRecentOrders();
            await loadCurrentInvoice(); // This might fail if no booking exists
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRecentOrders = async () => {
        try {
            const orders = await orderService.getCustomerOrders();
            const recent = orders?.slice(0, 3) || [];
            setRecentOrders(recent);

            // Calculate order statistics
            const total = orders?.length || 0;
            const active = orders?.filter(order =>
                order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
            ).length || 0;
            const delivered = orders?.filter(order =>
                order.status === 'DELIVERED'
            ).length || 0;

            setOrderStats({
                totalOrders: total,
                activeOrders: active,
                deliveredOrders: delivered
            });
        } catch (error) {
            console.error('Error loading orders:', error);
            // Don't show error for orders - they might not have any yet
        }
    };

    const loadCurrentInvoice = async () => {
        try {
            setInvoiceLoading(true);
            setInvoiceError('');
            const invoice = await invoiceService.getCurrentInvoice();
            setCurrentInvoice(invoice);
        } catch (error) {
            console.error('Error loading current invoice:', error);
            // "No active booking found" is a normal scenario, not an error
            if (error.message.includes('No active booking')) {
                setInvoiceError(''); // Clear error for normal scenario
            } else {
                setInvoiceError('Unable to load current bill');
            }
            setCurrentInvoice(null);
        } finally {
            setInvoiceLoading(false);
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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleViewInvoice = () => {
        navigate('/customer/invoice');
    };

    const handleViewInvoiceHistory = () => {
        navigate('/customer/bookings'); // Redirect to bookings page to see past bookings
    };

    const handleRetryInvoice = () => {
        loadCurrentInvoice();
    };

    return (
        <div className="customer-dashboard">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1>Welcome back, {user?.fullName}!</h1>
                <p>Your luxury getaway awaits at Palm Beach Resort</p>

                {/* Current Bill Summary - Only show if user has an active booking */}
                {invoiceLoading && (
                    <div className="current-bill-summary loading">
                        <div className="bill-loading-spinner"></div>
                        <span>Checking for current bill...</span>
                    </div>
                )}

                {invoiceError && (
                    <div className="current-bill-summary error">
                        <span>{invoiceError}</span>
                        <button
                            className="btn btn-outline btn-small"
                            onClick={handleRetryInvoice}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {currentInvoice && !invoiceLoading && (
                    <div className="current-bill-summary">
                        <div className="bill-amount">
                            <span className="bill-label">Current Balance:</span>
                            <span className="bill-total">{formatCurrency(currentInvoice.grandTotal)}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-small"
                            onClick={handleViewInvoice}
                        >
                            View Detailed Invoice
                        </button>
                    </div>
                )}

                </div>

            <div className="dashboard-content">
                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-cards">
                        {/* Room Related Actions */}
                        <Link to="/rooms" className="action-card">
                            <div className="action-icon">🏨</div>
                            <h3>Book a Room</h3>
                            <p>Browse our luxury accommodations and find your perfect stay</p>
                        </Link>

                        <Link to="/customer/bookings" className="action-card">
                            <div className="action-icon">📋</div>
                            <h3>My Bookings</h3>
                            <p>View and manage your room reservations and bookings</p>
                        </Link>

                        {/* Billing Actions */}
                        <div className="action-card" onClick={handleViewInvoice} style={{cursor: 'pointer'}}>
                            <div className="action-icon">🧾</div>
                            <h3>View Invoice</h3>
                            <p>Access your current bill and payment details</p>
                        </div>

                        <div className="action-card" onClick={handleViewInvoiceHistory} style={{cursor: 'pointer'}}>
                            <div className="action-icon">📊</div>
                            <h3>Billing History</h3>
                            <p>View past invoices and payment history</p>
                        </div>

                        {/* Food Ordering Actions */}
                        <Link to="/menu" className="action-card">
                            <div className="action-icon">🍽️</div>
                            <h3>Order Food</h3>
                            <p>Browse our delicious menu and order food to your room</p>
                        </Link>

                        <Link to="/customer/orders" className="action-card">
                            <div className="action-icon">📦</div>
                            <h3>Order History</h3>
                            <p>View your past food orders and current order status</p>
                        </Link>

                        <Link to="/track-order" className="action-card">
                            <div className="action-icon">📍</div>
                            <h3>Track Order</h3>
                            <p>Track your active food orders in real-time</p>
                        </Link>

                        {/* Support Actions */}
                        <Link to="/contact" className="action-card">
                            <div className="action-icon">📞</div>
                            <h3>Contact Support</h3>
                            <p>24/7 customer service for all your needs and inquiries</p>
                        </Link>
                    </div>
                </div>

                {/* Order Statistics */}
                <div className="order-statistics">
                    <h2>Food Order Summary</h2>
                    <div className="stats-cards">
                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <div className="stat-number">{orderStats.totalOrders}</div>
                                <div className="stat-label">Total Orders</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                                <div className="stat-number">{orderStats.activeOrders}</div>
                                <div className="stat-label">Active Orders</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-number">{orderStats.deliveredOrders}</div>
                                <div className="stat-label">Delivered</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <div className="recent-orders">
                        <div className="section-header">
                            <h2>Recent Food Orders</h2>
                            <Link to="/customer/orders" className="view-all-link">
                                View All Orders →
                            </Link>
                        </div>
                        <div className="orders-list">
                            {recentOrders.map(order => (
                                <div key={order.id} className="order-item">
                                    <div className="order-info">
                                        <div className="order-header">
                                            <h4>Order #{order.orderNumber}</h4>
                                            <span
                                                className="order-status"
                                                style={{ color: getStatusColor(order.status) }}
                                            >
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <p className="order-date">{formatDate(order.createdAt)}</p>
                                        <p className="order-total">Total: ${order.totalAmount?.toFixed(2)}</p>
                                        <div className="order-items-preview">
                                            {order.items?.slice(0, 2).map(item => (
                                                <span key={item.id} className="item-preview">
                                                    {item.menuItemName} × {item.quantity}
                                                </span>
                                            ))}
                                            {order.items?.length > 2 && (
                                                <span className="more-items">+{order.items.length - 2} more</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="order-actions">
                                        <button
                                            className="btn btn-outline btn-small"
                                            onClick={() => navigate('/track-order', {
                                                state: { orderNumber: order.orderNumber }
                                            })}
                                        >
                                            Track
                                        </button>
                                        <button
                                            className="btn btn-primary btn-small"
                                            onClick={() => navigate('/customer/orders')}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Order Buttons */}
                <div className="quick-order-buttons">
                    <h2>Quick Food Order</h2>
                    <div className="order-buttons-grid">
                        <button
                            className="quick-order-btn"
                            onClick={() => navigate('/menu')}
                        >
                            <span className="btn-icon">🍕</span>
                            <span className="btn-text">Order Pizza</span>
                        </button>
                        <button
                            className="quick-order-btn"
                            onClick={() => navigate('/menu')}
                        >
                            <span className="btn-icon">🍔</span>
                            <span className="btn-text">Order Burger</span>
                        </button>
                        <button
                            className="quick-order-btn"
                            onClick={() => navigate('/menu')}
                        >
                            <span className="btn-icon">🥗</span>
                            <span className="btn-text">Order Salad</span>
                        </button>
                        <button
                            className="quick-order-btn"
                            onClick={() => navigate('/menu')}
                        >
                            <span className="btn-icon">🍹</span>
                            <span className="btn-text">Order Drinks</span>
                        </button>
                    </div>
                </div>

                {/* No Orders Message */}
                {!loading && recentOrders.length === 0 && (
                    <div className="no-orders-message">
                        <div className="no-orders-icon">🍽️</div>
                        <h3>No Food Orders Yet</h3>
                        <p>Start your culinary journey with our delicious menu options</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/menu')}
                        >
                            Browse Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;