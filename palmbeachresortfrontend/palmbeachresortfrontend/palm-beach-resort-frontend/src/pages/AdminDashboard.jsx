import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { adminOrderService } from '../services/menuService';
import { roomService } from '../services/roomService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRooms: 0,
        availableRooms: 0,
        totalBookings: 0,
        activeBookings: 0,
        totalOrders: 0,
        pendingOrders: 0,
        activeOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Replace the mock data with real API calls
    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Real API calls
            const orderStats = await adminOrderService.getOrderStatistics();
            const allOrders = await adminOrderService.getAllOrders();
            const roomStats = await roomService.getRoomStatistics(); // Add this service
            // const bookingStats = await bookingService.getBookingStatistics(); // Add this service

            setStats({
                totalRooms: roomStats.totalRooms || 0,
                availableRooms: roomStats.availableRooms || 0,
                totalBookings: 0, // bookingStats.totalBookings || 0,
                activeBookings: 0, // bookingStats.activeBookings || 0,
                totalOrders: orderStats?.total || 0,
                pendingOrders: orderStats?.pending || 0,
                activeOrders: (orderStats?.pending || 0) + (orderStats?.confirmed || 0) + (orderStats?.preparing || 0)
            });

            setRecentOrders(allOrders?.slice(0, 5) || []);

            // Add real bookings data
            // const recentBookings = await bookingService.getRecentBookings();
            // setRecentBookings(recentBookings?.slice(0, 5) || []);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
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
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Navigate to Task Management
    const navigateToTasks = () => {
        navigate('/admin/tasks');
    };

    // Navigate to Home
    const navigateToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <div className="header-content">

                        <div className="header-text">
                            <h1>Admin Dashboard</h1>
                            <p>Loading dashboard data...</p>
                        </div>
                    </div>
                </div>
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Dashboard Header with Back Button */}
            <div className="dashboard-header">
                <div className="header-content">
                    <button className="back-button" onClick={navigateToHome}>
                        ← Back to Home
                    </button>
                    <div className="header-text">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back, {user?.fullName}. Manage your resort operations.</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="action-grid">
                        {/* Room Management */}
                        <div className="action-category">
                            <h3>🏨 Room Management</h3>
                            <div className="action-buttons">
                                <Link to="/admin/rooms" className="action-btn">
                                    <span className="btn-icon">📋</span>
                                    <span className="btn-text">Manage Rooms</span>
                                </Link>
                                <Link to="/admin/bookings" className="action-btn">
                                    <span className="btn-icon">📅</span>
                                    <span className="btn-text">Manage Bookings</span>
                                </Link>
                                <Link to="/rooms" className="action-btn">
                                    <span className="btn-icon">👀</span>
                                    <span className="btn-text">View Rooms</span>
                                </Link>
                            </div>
                        </div>

                        {/* Food Order Management */}
                        <div className="action-category">
                            <h3>🍽️ Food Order Management</h3>
                            <div className="action-buttons">
                                <Link to="/admin/menu" className="action-btn">
                                    <span className="btn-icon">📝</span>
                                    <span className="btn-text">Manage Menu</span>
                                </Link>
                                <Link to="/admin/orders" className="action-btn">
                                    <span className="btn-icon">📦</span>
                                    <span className="btn-text">Manage Orders</span>
                                </Link>
                                <Link to="/admin/kitchen" className="action-btn">
                                    <span className="btn-icon">👨‍🍳</span>
                                    <span className="btn-text">Kitchen Dashboard</span>
                                </Link>
                                <Link to="/admin/statistics" className="action-btn">
                                    <span className="btn-icon">📊</span>
                                    <span className="btn-text">Order Analytics</span>
                                </Link>
                            </div>
                        </div>

                        {/* Task Management */}
                        <div className="action-category">
                            <h3>✅ Task Management</h3>
                            <div className="action-buttons">
                                <button onClick={navigateToTasks} className="action-btn">
                                    <span className="btn-icon">📋</span>
                                    <span className="btn-text">Manage Tasks</span>
                                </button>
                                <Link to="/admin/tasks/create" className="action-btn">
                                    <span className="btn-icon">➕</span>
                                    <span className="btn-text">Create Task</span>
                                </Link>
                                <Link to="/admin/staff" className="action-btn">
                                    <span className="btn-icon">👥</span>
                                    <span className="btn-text">Manage Staff</span>
                                </Link>
                            </div>
                        </div>

                        {/* System Management */}
                        <div className="action-category">
                            <h3>⚙️ System Management</h3>
                            <div className="action-buttons">
                                <Link to="/admin/users" className="action-btn">
                                    <span className="btn-icon">👥</span>
                                    <span className="btn-text">Manage Users</span>
                                </Link>
                                <Link to="/admin/reports" className="action-btn">
                                    <span className="btn-icon">📈</span>
                                    <span className="btn-text">View Reports</span>
                                </Link>
                                <Link to="/admin/settings" className="action-btn">
                                    <span className="btn-icon">⚙️</span>
                                    <span className="btn-text">System Settings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Overview */}
                <div className="stats-overview">
                    <h2>Resort Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card room-stats">
                            <div className="stat-icon">🏨</div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.totalRooms}</div>
                                <div className="stat-label">Total Rooms</div>
                                <div className="stat-subtext">{stats.availableRooms} available</div>
                            </div>
                        </div>

                        <div className="stat-card booking-stats">
                            <div className="stat-icon">📅</div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.totalBookings}</div>
                                <div className="stat-label">Total Bookings</div>
                                <div className="stat-subtext">{stats.activeBookings} active</div>
                            </div>
                        </div>

                        <div className="stat-card order-stats">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.totalOrders}</div>
                                <div className="stat-label">Total Orders</div>
                                <div className="stat-subtext">{stats.activeOrders} active</div>
                            </div>
                        </div>

                        <div className="stat-card pending-stats">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.pendingOrders}</div>
                                <div className="stat-label">Pending Orders</div>
                                <div className="stat-subtext">Need attention</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <div className="activity-section">
                        <div className="section-header">
                            <h3>Recent Food Orders</h3>
                            <Link to="/admin/orders" className="view-all-link">
                                View All Orders →
                            </Link>
                        </div>
                        <div className="activity-list">
                            {recentOrders.length > 0 ? (
                                recentOrders.map(order => (
                                    <div key={order.id} className="activity-item">
                                        <div className="activity-icon">📦</div>
                                        <div className="activity-details">
                                            <div className="activity-main">
                                                <strong>Order #{order.orderNumber}</strong>
                                                <span
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                                >
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            <div className="activity-meta">
                                                <span>{order.customerName}</span>
                                                <span>Room {order.roomNumber}</span>
                                                <span>${order.totalAmount?.toFixed(2)}</span>
                                            </div>
                                            <div className="activity-time">
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <div className="activity-actions">
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => navigate('/admin/orders')}
                                            >
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-activity">
                                    <p>No recent orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="activity-section">
                        <div className="section-header">
                            <h3>Recent Bookings</h3>
                            <Link to="/admin/bookings" className="view-all-link">
                                View All Bookings →
                            </Link>
                        </div>
                        <div className="activity-list">
                            <div className="no-activity">
                                <p>No recent bookings to display</p>
                                <Link to="/admin/bookings" className="btn btn-primary btn-sm">
                                    Manage Bookings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Actions */}
                <div className="emergency-actions">
                    <h3>Quick Access</h3>
                    <div className="emergency-buttons">
                        <button
                            className="emergency-btn kitchen-btn"
                            onClick={() => navigate('/admin/kitchen')}
                        >
                            <span className="emergency-icon">👨‍🍳</span>
                            <span className="emergency-text">Kitchen Dashboard</span>
                            <span className="emergency-badge">{stats.pendingOrders}</span>
                        </button>

                        <button
                            className="emergency-btn orders-btn"
                            onClick={() => navigate('/admin/orders')}
                        >
                            <span className="emergency-icon">📦</span>
                            <span className="emergency-text">Pending Orders</span>
                            <span className="emergency-badge">{stats.pendingOrders}</span>
                        </button>

                        <button
                            className="emergency-btn task-btn"
                            onClick={navigateToTasks}
                        >
                            <span className="emergency-icon">✅</span>
                            <span className="emergency-text">Task Management</span>
                        </button>

                        <button
                            className="emergency-btn stats-btn"
                            onClick={() => navigate('/admin/statistics')}
                        >
                            <span className="emergency-icon">📊</span>
                            <span className="emergency-text">Order Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;