import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import Loader from '../ui/Loader';
import './BookingForm.css';

const BookingForm = () => {
    const { id: roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        roomId: roomId || '',
        checkInDate: '',
        checkOutDate: '',
        guestCount: 1,
        specialRequests: ''
    });

    useEffect(() => {
        if (roomId) {
            loadRoomDetails();
        }
    }, [roomId]);

    const loadRoomDetails = async () => {
        try {
            const response = await roomService.getRoomById(roomId);
            setRoom(response.data);
            setFormData(prev => ({ ...prev, roomId }));
        } catch (err) {
            setError('Failed to load room details');
            console.error('Error loading room:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotal = () => {
        if (!room || !formData.checkInDate || !formData.checkOutDate) return 0;

        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

        return nights * room.price;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        // Validate dates
        if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
            setError('Check-out date must be after check-in date');
            setSubmitting(false);
            return;
        }

        try {
            const response = await bookingService.createBooking(formData);
            console.log('✅ Booking created:', response.data);

            // Navigate to CustomerBookings page with success message
            navigate('/customer/bookings', {
                state: {
                    message: `Booking #${response.data.bookingReference} created successfully!`
                }
            });
        } catch (err) {
            console.error('❌ Booking creation failed:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (!room) return <div className="error-page">Room not found</div>;

    const totalAmount = calculateTotal();
    const minDate = new Date().toISOString().split('T')[0];
    const nights = formData.checkInDate && formData.checkOutDate
        ? Math.ceil((new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="booking-form-container">
            <div className="booking-header">
                <h1>Book Your Stay</h1>
                <p>Complete your reservation for Room {room.roomNumber}</p>
            </div>

            <div className="booking-content">
                <div className="room-summary">
                    <div className="room-image">
                        <img
                            src={room.imageUrl || '/images/rooms/default.jpg'}
                            alt={`Room ${room.roomNumber}`}
                            onError={(e) => {
                                e.target.src = '/images/rooms/default.jpg';
                            }}
                        />
                    </div>
                    <div className="room-details">
                        <h3>Room {room.roomNumber} - {room.roomType}</h3>
                        <p className="room-description">{room.description}</p>
                        <div className="room-features">
                            <span className="feature">👥 Up to {room.capacity} guests</span>
                            <span className="feature">💰 ${room.price}/night</span>
                            <span className={`status ${room.available ? 'available' : 'unavailable'}`}>
                                {room.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="checkInDate">Check-in Date *</label>
                            <input
                                type="date"
                                id="checkInDate"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleChange}
                                min={minDate}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="checkOutDate">Check-out Date *</label>
                            <input
                                type="date"
                                id="checkOutDate"
                                name="checkOutDate"
                                value={formData.checkOutDate}
                                onChange={handleChange}
                                min={formData.checkInDate || minDate}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="guestCount">Number of Guests *</label>
                            <select
                                id="guestCount"
                                name="guestCount"
                                value={formData.guestCount}
                                onChange={handleChange}
                                required
                                className="form-input"
                            >
                                {[...Array(room.capacity)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialRequests">Special Requests</label>
                        <textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Any special requirements or requests..."
                            className="form-input"
                        />
                    </div>

                    <div className="booking-summary">
                        <h3>Booking Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Room Price</span>
                                <span>${room.price}/night</span>
                            </div>
                            {nights > 0 && (
                                <>
                                    <div className="summary-row">
                                        <span>Number of Nights</span>
                                        <span>{nights}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total Amount</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || !formData.checkInDate || !formData.checkOutDate || !room.available}
                        >
                            {submitting ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Creating Booking...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;