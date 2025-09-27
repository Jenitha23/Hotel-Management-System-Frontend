import { useState, useEffect } from 'react';
import type { BookingResponse, Room } from '../types';
import { apiService } from '../services/api';

export const useBookings = (customerId?: number) => {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const data = customerId
                    ? await apiService.getBookingsByCustomer(customerId)
                    : await apiService.getBookings();
                setBookings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [customerId]);

    const cancelBooking = async (id: number) => {
        try {
            const cancelledBooking = await apiService.cancelBooking(id);
            setBookings(prev => prev.map(booking =>
                booking.id === id ? cancelledBooking : booking
            ));
            return cancelledBooking;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel booking');
            throw err;
        }
    };

    return { bookings, loading, error, cancelBooking };
};

export const useRooms = (checkInDate?: string, checkOutDate?: string) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const data = checkInDate && checkOutDate
                    ? await apiService.getAvailableRoomsForDates(checkInDate, checkOutDate)
                    : await apiService.getAvailableRooms();
                setRooms(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [checkInDate, checkOutDate]);

    return { rooms, loading, error };
};