import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingCard from '../components/BookingCard';

const Bookings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const { bookings, loading, error, cancelBooking } = useBookings(1); // Hardcoded customer ID

    const handleCancelBooking = async (id: number) => {
        setCancellingId(id);
        try {
            await cancelBooking(id);
            alert('Booking cancelled successfully');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const currentBookings = bookings.filter(booking => booking.status === 'CONFIRMED');
    const pastBookings = bookings.filter(booking => booking.status !== 'CONFIRMED');

    return (
        <div className="container my-5">
            <h2 className="section-title text-center mb-5">My Bookings</h2>

            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Current Bookings
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Booking History
                    </button>
                </li>
            </ul>

            <div className="tab-content mt-4">
                {loading && <div className="text-center">Loading bookings...</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {activeTab === 'current' && (
                    <div>
                        {currentBookings.length === 0 ? (
                            <div className="alert alert-info">You don't have any current bookings.</div>
                        ) : (
                            currentBookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={handleCancelBooking}
                                    cancellingId={cancellingId || undefined}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'past' && (
                    <div>
                        {pastBookings.length === 0 ? (
                            <div className="alert alert-info">You don't have any past bookings.</div>
                        ) : (
                            pastBookings.map(booking => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={handleCancelBooking}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;