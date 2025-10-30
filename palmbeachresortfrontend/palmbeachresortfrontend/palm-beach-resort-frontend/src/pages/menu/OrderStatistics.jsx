import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminOrderService } from '../../services/menuService';
import './OrderStatistics.css';

const OrderStatistics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('TODAY');

    useEffect(() => {
        fetchStatistics();
    }, [timeRange]);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await adminOrderService.getOrderStatistics();
            setStats(statistics);
        } catch (err) {
            setError('Failed to load order statistics');
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#FFA500',
            confirmed: '#1CA1A6',
            preparing: '#FF7F6B',
            readyForDelivery: '#4CAF50',
            outForDelivery: '#2196F3',
            delivered: '#666',
            cancelled: '#F44336'
        };
        return statusColors[status] || '#666';
    };

    const calculateCompletionRate = () => {
        if (!stats) return 0;
        const completed = stats.delivered || 0;
        const total = stats.total || 1;
        return Math.round((completed / total) * 100);
    };

    const calculateAveragePreparationTime = () => {
        // This would typically come from your backend
        // For now, we'll use a mock calculation
        return '25 mins';
    };

    const getPopularItems = () => {
        // This would typically come from your backend
        // For now, we'll return mock data
        return [
            { name: 'Grilled Salmon', orders: 45, revenue: 1125 },
            { name: 'Beef Burger', orders: 38, revenue: 760 },
            { name: 'Caesar Salad', orders: 32, revenue: 480 },
            { name: 'Chocolate Cake', orders: 28, revenue: 224 },
            { name: 'Fresh Orange Juice', orders: 25, revenue: 125 }
        ];
    };

    if (loading) {
        return (
            <div className="statistics-page">
                <div className="stats-header">
                    <h1>Order Analytics</h1>
                    <p>Comprehensive order statistics and insights</p>
                </div>
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="statistics-page">
            <div className="stats-header">
                <div className="header-content">
                    <div>
                        <h1>Order Analytics</h1>
                        <p>Comprehensive order statistics and insights</p>
                    </div>
                    <div className="time-filter">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="time-select"
                        >
                            <option value="TODAY">Today</option>
                            <option value="WEEK">This Week</option>
                            <option value="MONTH">This Month</option>
                            <option value="YEAR">This Year</option>
                        </select>
                        <button
                            className="refresh-btn"
                            onClick={fetchStatistics}
                            disabled={loading}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                    <button onClick={fetchStatistics} className="retry-btn">Retry</button>
                </div>
            )}

            {stats && (
                <>
                    <div className="overview-stats">
                        <div className="stat-card primary">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.total || 0}</div>
                                <div className="stat-label">Total Orders</div>
                                <div className="stat-trend">+12% from yesterday</div>
                            </div>
                        </div>

                        <div className="stat-card success">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-number">{stats.delivered || 0}</div>
                                <div className="stat-label">Completed</div>
                                <div className="stat-trend">{calculateCompletionRate()}% completion rate</div>
                            </div>
                        </div>

                        <div className="stat-card warning">
                            <div className="stat-icon">⏱️</div>
                            <div className="stat-content">
                                <div className="stat-number">{calculateAveragePreparationTime()}</div>
                                <div className="stat-label">Avg. Prep Time</div>
                                <div className="stat-trend">-5% faster than last week</div>
                            </div>
                        </div>

                        <div className="stat-card info">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <div className="stat-number">${((stats.delivered || 0) * 25).toLocaleString()}</div>
                                <div className="stat-label">Estimated Revenue</div>
                                <div className="stat-trend">+8% from last period</div>
                            </div>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Order Status Distribution</h3>
                            <div className="status-chart">
                                {[
                                    { key: 'pending', label: 'Pending' },
                                    { key: 'confirmed', label: 'Confirmed' },
                                    { key: 'preparing', label: 'Preparing' },
                                    { key: 'readyForDelivery', label: 'Ready' },
                                    { key: 'outForDelivery', label: 'Out for Delivery' },
                                    { key: 'delivered', label: 'Delivered' },
                                    { key: 'cancelled', label: 'Cancelled' }
                                ].map(item => (
                                    <div key={item.key} className="status-bar">
                                        <div className="status-info">
                                            <span className="status-label">{item.label}</span>
                                            <span className="status-count">{stats[item.key] || 0}</span>
                                        </div>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    width: `${((stats[item.key] || 0) / stats.total * 100)}%`,
                                                    backgroundColor: getStatusColor(item.key)
                                                }}
                                            ></div>
                                        </div>
                                        <span className="status-percentage">
                                            {Math.round(((stats[item.key] || 0) / stats.total * 100))}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="chart-card">
                            <h3>Popular Menu Items</h3>
                            <div className="popular-items">
                                {getPopularItems().map((item, index) => (
                                    <div key={item.name} className="popular-item">
                                        <div className="item-rank">#{index + 1}</div>
                                        <div className="item-info">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-stats">
                                                <span>{item.orders} orders</span>
                                                <span>${item.revenue} revenue</span>
                                            </div>
                                        </div>
                                        <div className="item-revenue">${item.revenue}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="detailed-stats">
                        <div className="stats-card">
                            <h3>Order Timeline</h3>
                            <div className="timeline-stats">
                                <div className="timeline-item">
                                    <span className="time-label">Peak Order Time</span>
                                    <span className="time-value">7:00 PM - 8:00 PM</span>
                                </div>
                                <div className="timeline-item">
                                    <span className="time-label">Average Wait Time</span>
                                    <span className="time-value">18 minutes</span>
                                </div>
                                <div className="timeline-item">
                                    <span className="time-label">Busiest Day</span>
                                    <span className="time-value">Saturday</span>
                                </div>
                                <div className="timeline-item">
                                    <span className="time-label">Order Frequency</span>
                                    <span className="time-value">Every 12 minutes</span>
                                </div>
                            </div>
                        </div>

                        <div className="stats-card">
                            <h3>Performance Metrics</h3>
                            <div className="performance-metrics">
                                <div className="metric">
                                    <span className="metric-label">On-Time Delivery</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '94%' }}></div>
                                    </div>
                                    <span className="metric-value">94%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Customer Satisfaction</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '96%' }}></div>
                                    </div>
                                    <span className="metric-value">96%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Order Accuracy</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '98%' }}></div>
                                    </div>
                                    <span className="metric-value">98%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Repeat Customers</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: '65%' }}></div>
                                    </div>
                                    <span className="metric-value">65%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderStatistics;
