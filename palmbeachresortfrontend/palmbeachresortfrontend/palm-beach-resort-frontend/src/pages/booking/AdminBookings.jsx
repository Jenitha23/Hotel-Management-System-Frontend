import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/ui/Loader';
import './AdminBookings.css';

const AdminBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        loadBookings();
        loadStatistics();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingService.getAllBookings();
            const bookingsData = response.data || response;
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } catch (err) {
            console.error('Error loading bookings:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await bookingService.getBookingStatistics();
            setStatistics(response.data);
        } catch (err) {
            console.error('Failed to load statistics:', err);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            setActionLoading(bookingId);
            await bookingService.updateBookingStatus(bookingId, newStatus);
            await loadBookings(); // Refresh data
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update booking status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckIn = async (bookingId) => {
        try {
            setActionLoading(bookingId);
            await bookingService.checkIn(bookingId);
            await loadBookings();
        } catch (err) {
            console.error('Error checking in:', err);
            setError(err.response?.data?.message || err.message || 'Failed to check in guest');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckOut = async (bookingId) => {
        try {
            setActionLoading(bookingId);
            await bookingService.checkOut(bookingId);
            await loadBookings();
        } catch (err) {
            console.error('Error checking out:', err);
            setError(err.response?.data?.message || err.message || 'Failed to check out guest');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

        try {
            setActionLoading(bookingId);
            await bookingService.deleteBooking(bookingId);
            await loadBookings();
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError(err.response?.data?.message || err.message || 'Failed to delete booking');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredBookings = filter === 'ALL'
        ? bookings
        : bookings.filter(booking => booking.status === filter);

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { class: 'pending', label: 'Pending' },
            CONFIRMED: { class: 'confirmed', label: 'Confirmed' },
            CHECKED_IN: { class: 'checked-in', label: 'Checked In' },
            CHECKED_OUT: { class: 'checked-out', label: 'Checked Out' },
            CANCELLED: { class: 'cancelled', label: 'Cancelled' }
        };

        const config = statusConfig[status] || { class: 'pending', label: status };

        return (
            <span className={`status-badge ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <Loader />;

    return (
        <div className="admin-bookings-page">
            <div className="admin-header">
                <h1>Booking Management</h1>
                <p>Manage all guest reservations and check-ins</p>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button onClick={loadBookings} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            {/* Statistics Cards */}
            {statistics && (
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <h3>{statistics.total || 0}</h3>
                            <p>Total Bookings</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>{statistics.pending || 0}</h3>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>{statistics.confirmed || 0}</h3>
                            <p>Confirmed</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏨</div>
                        <div className="stat-info">
                            <h3>{statistics.checkedIn || 0}</h3>
                            <p>Checked In</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="filters-section">
                <h3>Filter by Status</h3>
                <div className="filter-buttons">
                    {['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'].map(status => (
                        <button
                            key={status}
                            className={`filter-btn ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status.replace('_', ' ')}
                            {statistics && status !== 'ALL' && (
                                <span className="count">
                                    {statistics[status.toLowerCase()] || 0}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bookings-table-container">
                <div className="table-header">
                    <h3>Bookings ({filteredBookings.length})</h3>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="no-bookings">
                        <div className="no-bookings-icon">📋</div>
                        <h3>No bookings found</h3>
                        <p>No bookings match the selected filter</p>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="booking-card admin">
                                <div className="booking-header">
                                    <div>
                                        <h3>#{booking.bookingReference}</h3>
                                        <p className="customer-info">
                                            {booking.customerName} • {booking.customerEmail}
                                        </p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="booking-details">
                                    <div className="detail-group">
                                        <div className="detail">
                                            <span className="label">Room</span>
                                            <span className="value">
                                                {booking.room?.roomNumber} - {booking.room?.roomType}
                                            </span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Dates</span>
                                            <span className="value">
                                                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                            </span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Guests</span>
                                            <span className="value">{booking.guestCount}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Total</span>
                                            <span className="value price">${booking.totalAmount}</span>
                                        </div>
                                    </div>

                                    {booking.specialRequests && (
                                        <div className="special-requests">
                                            <strong>Special Requests:</strong>
                                            <p>{booking.specialRequests}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="booking-actions admin-actions">
                                    <div className="action-group">
                                        {booking.status === 'CONFIRMED' && (
                                            <button
                                                className="btn btn-success btn-small"
                                                onClick={() => handleCheckIn(booking.id)}
                                                disabled={actionLoading === booking.id}
                                            >
                                                {actionLoading === booking.id ? 'Processing...' : 'Check In'}
                                            </button>
                                        )}
                                        {booking.status === 'CHECKED_IN' && (
                                            <button
                                                className="btn btn-primary btn-small"
                                                onClick={() => handleCheckOut(booking.id)}
                                                disabled={actionLoading === booking.id}
                                            >
                                                {actionLoading === booking.id ? 'Processing...' : 'Check Out'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="action-group">
                                        <select
                                            value={booking.status}
                                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                            className="status-select"
                                            disabled={actionLoading === booking.id}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="CONFIRMED">Confirmed</option>
                                            <option value="CHECKED_IN">Checked In</option>
                                            <option value="CHECKED_OUT">Checked Out</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>

                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDelete(booking.id)}
                                            disabled={actionLoading === booking.id}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;