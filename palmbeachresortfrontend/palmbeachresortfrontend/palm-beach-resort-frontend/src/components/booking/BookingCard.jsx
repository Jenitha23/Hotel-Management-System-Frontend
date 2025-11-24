import React from 'react';
import { Link } from 'react-router-dom';
import './BookingCard.css';

const BookingCard = ({ booking, onCancel, showActions = true, variant = 'customer' }) => {
    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { class: 'pending', label: 'Pending', icon: '⏳' },
            CONFIRMED: { class: 'confirmed', label: 'Confirmed', icon: '✅' },
            CHECKED_IN: { class: 'checked-in', label: 'Checked In', icon: '🏨' },
            CHECKED_OUT: { class: 'checked-out', label: 'Checked Out', icon: '🚪' },
            CANCELLED: { class: 'cancelled', label: 'Cancelled', icon: '❌' }
        };

        const config = statusConfig[status] || { class: 'pending', label: status, icon: '📋' };

        return (
            <span className={`status-badge ${config.class}`}>
                <span className="status-icon">{config.icon}</span>
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

    const calculateNights = () => {
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    };

    const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

    return (
        <div className={`booking-card ${variant}`}>
            <div className="booking-header">
                <div className="booking-title">
                    <h3>Booking #{booking.bookingReference}</h3>
                    {variant === 'admin' && (
                        <p className="customer-info">
                            {booking.customerName} • {booking.customerEmail}
                        </p>
                    )}
                </div>
                {getStatusBadge(booking.status)}
            </div>

            <div className="booking-content">
                <div className="room-info">
                    <div className="room-image">
                        <img
                            src={booking.room?.imageUrl || '/images/rooms/default.jpg'}
                            alt={`Room ${booking.room?.roomNumber}`}
                            onError={(e) => {
                                e.target.src = '/images/rooms/default.jpg';
                            }}
                        />
                    </div>
                    <div className="room-details">
                        <h4>Room {booking.room?.roomNumber}</h4>
                        <p className="room-type">{booking.room?.roomType}</p>
                        <div className="room-features">
                            <span className="feature">👥 {booking.guestCount} guests</span>
                            <span className="feature">💰 ${booking.room?.price}/night</span>
                        </div>
                    </div>
                </div>

                <div className="booking-details">
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="label">Check-in</span>
                            <span className="value">{formatDate(booking.checkInDate)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Check-out</span>
                            <span className="value">{formatDate(booking.checkOutDate)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Nights</span>
                            <span className="value">{calculateNights()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Total</span>
                            <span className="value price">${booking.totalAmount}</span>
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <div className="special-requests">
                            <div className="requests-header">
                                <span className="requests-icon">💬</span>
                                <strong>Special Requests</strong>
                            </div>
                            <p>{booking.specialRequests}</p>
                        </div>
                    )}
                </div>
            </div>

            {showActions && (
                <div className="booking-actions">
                    {variant === 'customer' && canCancel && (
                        <button
                            className="btn btn-danger"
                            onClick={() => onCancel(booking.id)}
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
            )}
        </div>
    );
};

export default BookingCard;