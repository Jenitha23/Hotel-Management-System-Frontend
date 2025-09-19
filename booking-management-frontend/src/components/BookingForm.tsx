import React, { useState } from 'react';
import type { BookingRequest } from '../types';
import { apiService } from '../services/api';

interface BookingFormProps {
    onBookingCreated: () => void;
    onCheckAvailability: (checkInDate: string, checkOutDate: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingCreated, onCheckAvailability }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 2,
        roomId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckAvailability = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.checkInDate && formData.checkOutDate) {
            onCheckAvailability(formData.checkInDate, formData.checkOutDate);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.roomId) {
                throw new Error('Please select a room');
            }

            // Validate dates
            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);
            const today = new Date();
            
            if (checkIn < today) {
                throw new Error('Check-in date cannot be in the past');
            }
            
            if (checkOut <= checkIn) {
                throw new Error('Check-out date must be after check-in date');
            }

            const bookingRequest: BookingRequest = {
                customerId: 1, // This should come from customer creation/authentication
                roomId: parseInt(formData.roomId),
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                numberOfGuests: parseInt(formData.numberOfGuests.toString())
            };

            // Make the API call to create the booking
            const response = await apiService.createBooking(bookingRequest);
            console.log('Booking created:', response);
            onBookingCreated();
            // Reset form
            setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                checkInDate: '',
                checkOutDate: '',
                numberOfGuests: 2,
                roomId: ''
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="booking-form card">
            <div className="card-body">
                <h4 className="card-title mb-4">Book a Room</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="customerName" className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="customerEmail" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="customerEmail"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="customerPhone" className="form-label">Phone</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="customerPhone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="checkInDate" className="form-label">Check-in Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="checkInDate"
                            name="checkInDate"
                            value={formData.checkInDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="checkOutDate" className="form-label">Check-out Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="checkOutDate"
                            name="checkOutDate"
                            value={formData.checkOutDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="numberOfGuests" className="form-label">Number of Guests</label>
                        <select
                            className="form-select"
                            id="numberOfGuests"
                            name="numberOfGuests"
                            value={formData.numberOfGuests}
                            onChange={handleChange}
                            required
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="roomId" className="form-label">Room Type</label>
                        <select
                            className="form-select"
                            id="roomId"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Room Type</option>
                            <option value="1">Standard Room</option>
                            <option value="2">Deluxe Room</option>
                            <option value="3">Suite</option>
                        </select>
                    </div>
                    <div className="d-grid gap-2">
                        <button 
                            type="button" 
                            className="btn btn-outline-primary w-100"
                            onClick={handleCheckAvailability}
                            disabled={!formData.checkInDate || !formData.checkOutDate}
                        >
                            Check Availability
                        </button>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Booking...' : 'Book Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;