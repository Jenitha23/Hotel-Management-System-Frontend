// src/pages/booking/BookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/ui/Loader';
import './BookingDetails.css';

const BookingDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadBookingDetails();
    }, [id]);

    const loadBookingDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const service = user?.role === 'ADMIN'
                ? bookingService.getBookingById
                : bookingService.getCustomerBooking;

            const response = await service(id);
            setBooking(response.data || response);
        } catch (err) {
            console.error('Error loading booking details:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

        try {
            setActionLoading(true);
            await bookingService.cancelBooking(id);
            navigate('/customer/bookings', {
                state: { message: 'Booking cancelled successfully!' }
            });
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError(err.response?.data?.message || err.message || 'Failed to cancel booking');
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setActionLoading(true);
            await bookingService.updateBookingStatus(id, newStatus);
            await loadBookingDetails(); // Refresh details
        } catch (err) {
            console.error('Error updating status:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update booking status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            setActionLoading(true);
            await bookingService.checkIn(id);
            await loadBookingDetails();
        } catch (err) {
            console.error('Error checking in:', err);
            setError(err.response?.data?.message || err.message || 'Failed to check in');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setActionLoading(true);
            await bookingService.checkOut(id);
            await loadBookingDetails();
        } catch (err) {
            console.error('Error checking out:', err);
            setError(err.response?.data?.message || err.message || 'Failed to check out');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { class: 'pending', label: 'Pending', icon: '⏳', color: '#FFA500' },
            CONFIRMED: { class: 'confirmed', label: 'Confirmed', icon: '✅', color: '#1CA1A6' },
            CHECKED_IN: { class: 'checked-in', label: 'Checked In', icon: '🏨', color: '#4CD964' },
            CHECKED_OUT: { class: 'checked-out', label: 'Checked Out', icon: '🚪', color: '#0B2545' },
            CANCELLED: { class: 'cancelled', label: 'Cancelled', icon: '❌', color: '#FF7F6B' }
        };

        const config = statusConfig[status] || { class: 'pending', label: status, icon: '📋', color: '#666' };

        return (
            <span
                className={`status-badge large ${config.class}`}
                style={{ borderLeftColor: config.color }}
            >
                <span className="status-icon">{config.icon}</span>
                <span className="status-text">{config.label}</span>
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateNights = () => {
        if (!booking) return 0;
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    };

    const canCancel = booking?.status === 'PENDING' || booking?.status === 'CONFIRMED';
    const isAdmin = user?.role === 'ADMIN';

    if (loading) return <Loader />;
    if (error && !booking) return <div className="error-page">{error}</div>;
    if (!booking) return <div className="error-page">Booking not found</div>;

    return (
        <div className="booking-details-page">
            <div className="booking-details-header">
                <Link to={isAdmin ? '/admin/bookings' : '/customer/bookings'} className="back-link">
                    ← Back to {isAdmin ? 'All Bookings' : 'My Bookings'}
                </Link>
                <div className="header-content">
                    <h1>Booking #{booking.bookingReference}</h1>
                    {getStatusBadge(booking.status)}
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            <div className="booking-details-content">
                <div className="details-grid">
                    {/* Room Information */}
                    <div className="detail-section room-section">
                        <h2>
                            <span className="section-icon">🏨</span>
                            Room Information
                        </h2>
                        <div className="room-card">
                            <div className="room-image">
                                <img
                                    src={booking.room?.imageUrl || '/images/rooms/default.jpg'}
                                    alt={`Room ${booking.room?.roomNumber}`}
                                    onError={(e) => {
                                        e.target.src = '/images/rooms/default.jpg';
                                    }}
                                />
                            </div>
                            <div className="room-info">
                                <h3>Room {booking.room?.roomNumber}</h3>
                                <p className="room-type">{booking.room?.roomType}</p>
                                <p className="room-description">{booking.room?.description}</p>
                                <div className="room-features">
                                    <div className="feature">
                                        <span className="icon">👥</span>
                                        <span>Capacity: {booking.room?.capacity} guests</span>
                                    </div>
                                    <div className="feature">
                                        <span className="icon">💰</span>
                                        <span>Price: ${booking.room?.price}/night</span>
                                    </div>
                                    <div className="feature">
                                        <span className="icon">📅</span>
                                        <span>{calculateNights()} nights</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="detail-section booking-info">
                        <h2>
                            <span className="section-icon">📋</span>
                            Booking Details
                        </h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="label">Check-in Date</span>
                                <span className="value">{formatDate(booking.checkInDate)}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Check-out Date</span>
                                <span className="value">{formatDate(booking.checkOutDate)}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Number of Guests</span>
                                <span className="value">{booking.guestCount} guests</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Total Amount</span>
                                <span className="value price">${booking.totalAmount}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Booking Created</span>
                                <span className="value">{formatDateTime(booking.createdAt)}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Last Updated</span>
                                <span className="value">{formatDateTime(booking.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information (Admin only) */}
                    {isAdmin && (
                        <div className="detail-section customer-section">
                            <h2>
                                <span className="section-icon">👤</span>
                                Customer Information
                            </h2>
                            <div className="customer-card">
                                <div className="customer-info">
                                    <h3>{booking.customerName}</h3>
                                    <p className="customer-email">{booking.customerEmail}</p>
                                    <p className="customer-id">Customer ID: {booking.customerId}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Special Requests */}
                    {booking.specialRequests && (
                        <div className="detail-section requests-section">
                            <h2>
                                <span className="section-icon">💬</span>
                                Special Requests
                            </h2>
                            <div className="requests-card">
                                <p>{booking.specialRequests}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions Section */}
                    <div className="detail-section actions-section">
                        <h2>
                            <span className="section-icon">⚡</span>
                            Actions
                        </h2>
                        <div className="actions-card">
                            <div className="action-buttons">
                                {!isAdmin && canCancel && (
                                    <button
                                        className="btn btn-danger btn-large"
                                        onClick={handleCancelBooking}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )}

                                {isAdmin && (
                                    <div className="admin-actions">
                                        {booking.status === 'CONFIRMED' && (
                                            <button
                                                className="btn btn-success btn-large"
                                                onClick={handleCheckIn}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? 'Processing...' : 'Check In Guest'}
                                            </button>
                                        )}
                                        {booking.status === 'CHECKED_IN' && (
                                            <button
                                                className="btn btn-primary btn-large"
                                                onClick={handleCheckOut}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? 'Processing...' : 'Check Out Guest'}
                                            </button>
                                        )}

                                        <div className="status-control">
                                            <label>Update Status:</label>
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                                disabled={actionLoading}
                                                className="status-select"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="CHECKED_IN">Checked In</option>
                                                <option value="CHECKED_OUT">Checked Out</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <Link
                                    to={isAdmin ? '/admin/bookings' : '/customer/bookings'}
                                    className="btn btn-outline"
                                >
                                    Back to List
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;