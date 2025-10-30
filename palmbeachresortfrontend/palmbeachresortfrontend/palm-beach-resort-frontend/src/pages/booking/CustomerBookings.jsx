// src/pages/booking/CustomerBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import Loader from '../../components/ui/Loader';
import './CustomerBookings.css';

const CustomerBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const successMessage = location.state?.message;

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingService.getCustomerBookings();
            // Handle both response formats: { data } or direct array
            const bookingsData = response.data || response;
            setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        } catch (err) {
            console.error('Error loading bookings:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

        try {
            await bookingService.cancelBooking(bookingId);
            await loadBookings(); // Refresh the list
        } catch (err) {
            console.error('Error canceling booking:', err);
            setError(err.response?.data?.message || err.message || 'Failed to cancel booking');
        }
    };

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
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const canCancelBooking = (booking) => {
        return booking.status === 'PENDING' || booking.status === 'CONFIRMED';
    };

    if (loading) return <Loader />;

    return (
        <div className="customer-bookings-page">
            <div className="bookings-header">
                <h1>My Bookings</h1>
                <p>Manage your reservations and upcoming stays</p>
            </div>

            {successMessage && (
                <div className="success-message">
                    <span className="success-icon">✅</span>
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button onClick={loadBookings} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}

            <div className="bookings-content">
                {!bookings || bookings.length === 0 ? (
                    <div className="no-bookings">
                        <div className="no-bookings-icon">📅</div>
                        <h3>No bookings yet</h3>
                        <p>Start planning your perfect getaway at Palm Beach Resort</p>
                        <Link to="/rooms" className="btn btn-primary">
                            Browse Rooms
                        </Link>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map(booking => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-header">
                                    <h3>Booking #{booking.bookingReference}</h3>
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
                                            <span className="label">Check-in</span>
                                            <span className="value">
                                                {formatDate(booking.checkInDate)}
                                            </span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Check-out</span>
                                            <span className="value">
                                                {formatDate(booking.checkOutDate)}
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

                                <div className="booking-actions">
                                    {canCancelBooking(booking) && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleCancelBooking(booking.id)}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                    <Link
                                        to={`/bookings/${booking.id}`}
                                        className="btn btn-outline"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerBookings;