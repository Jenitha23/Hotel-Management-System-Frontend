import React from 'react';
import BookingForm from '../components/BookingForm';
import { useRooms } from '../hooks/useBookings';
import RoomCard from '../components/ RoomCard';

const Home: React.FC = () => {
    const [showRooms, setShowRooms] = React.useState(false);
    const [searchDates, setSearchDates] = React.useState<{ checkInDate: string; checkOutDate: string } | null>(null);

    const { rooms, loading, error } = useRooms(
        searchDates?.checkInDate,
        searchDates?.checkOutDate
    );

    const handleBookingCreated = () => {
        setShowRooms(false);
        setSearchDates(null);
        alert('Booking created successfully!');
    };

    const handleCheckAvailability = (checkInDate: string, checkOutDate: string) => {
        setSearchDates({ checkInDate, checkOutDate });
        setShowRooms(true);
    };

    const handleBookRoom = (roomId: number) => {
        // This would typically pre-fill the form or navigate to a booking page
        console.log('Booking room:', roomId);
    };

    return (
        <div>
            <section className="hero-section">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold">Luxury Stay Experience</h1>
                    <p className="lead">Book your perfect room with our easy-to-use reservation system</p>
                    <button
                        className="btn btn-primary btn-lg mt-3"
                        onClick={() => window.scrollTo({ top: document.getElementById('booking-section')?.offsetTop, behavior: 'smooth' })}
                    >
                        Book Now
                    </button>
                </div>
            </section>

            <div className="container my-5">
                <div className="row">
                    <div className="col-lg-4">
                        <div id="booking-section">
                            <BookingForm 
                                onBookingCreated={handleBookingCreated}
                                onCheckAvailability={handleCheckAvailability}
                            />
                        </div>
                    </div>
                    <div className="col-lg-8">
                        {showRooms && (
                            <section>
                                <h2 className="section-title">Available Rooms</h2>
                                {loading && <div className="text-center">Loading rooms...</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                {!loading && !error && rooms.length === 0 && (
                                    <div className="alert alert-info">No rooms available for the selected dates.</div>
                                )}
                                <div className="row">
                                    {rooms.map(room => (
                                        <RoomCard
                                            key={room.id}
                                            room={room}
                                            onBook={handleBookRoom}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;