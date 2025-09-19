import React from 'react';
import type { BookingResponse } from '../types';
import { format } from 'date-fns';

interface BookingCardProps {
    booking: BookingResponse;
    onCancel: (id: number) => void;
    cancellingId?: number;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, cancellingId }) => {
    const isCurrent = booking.status === 'CONFIRMED';
    const isCancelled = booking.status === 'CANCELLED';

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    return (
        <div className={`card mb-3 ${isCancelled ? 'cancelled-booking' : 'booking-card'}`}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{booking.roomNumber} Room #{booking.roomNumber}</h5>
                    <span className={`status-badge ${isCancelled ? 'status-cancelled' : 'status-confirmed'}`}>
            {booking.status}
          </span>
                </div>
                <p className="card-text">
                    <strong>Dates:</strong> {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}<br/>
                    <strong>Guests:</strong> {booking.numberOfGuests}<br/>
                    <strong>Total:</strong> ${booking.totalPrice}
                </p>
                {isCurrent && (
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary btn-sm">Modify</button>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                        >
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCard;