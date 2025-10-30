// src/services/bookingService.js
import api from './api';
import { BOOKING_ENDPOINTS } from '../utils/constants';

export const bookingService = {
    // Customer endpoints
    createBooking: (bookingData) => {
        console.log('📦 Creating booking:', bookingData);
        return api.post(BOOKING_ENDPOINTS.CUSTOMER.CREATE, bookingData);
    },

    getCustomerBookings: () => {
        console.log('📦 Fetching customer bookings');
        return api.get(BOOKING_ENDPOINTS.CUSTOMER.GET_ALL);
    },

    getCustomerBooking: (id) => {
        console.log('📦 Fetching customer booking:', id);
        return api.get(`${BOOKING_ENDPOINTS.CUSTOMER.GET_BY_ID}/${id}`);
    },

    cancelBooking: (id) => {
        console.log('📦 Canceling booking:', id);
        return api.post(`${BOOKING_ENDPOINTS.CUSTOMER.CANCEL}/${id}/cancel`);
    },

    updateBooking: (id, updateData) => {
        console.log('📦 Updating booking:', id, updateData);
        return api.put(`${BOOKING_ENDPOINTS.CUSTOMER.UPDATE}/${id}`, updateData);
    },

    // Admin endpoints
    getAllBookings: () => {
        console.log('📦 Fetching all bookings (admin)');
        return api.get(BOOKING_ENDPOINTS.ADMIN.GET_ALL);
    },

    getBookingById: (id) => {
        console.log('📦 Fetching booking by ID:', id);
        return api.get(`${BOOKING_ENDPOINTS.ADMIN.GET_BY_ID}/${id}`);
    },

    getBookingsByStatus: (status) => {
        console.log('📦 Fetching bookings by status:', status);
        return api.get(`${BOOKING_ENDPOINTS.ADMIN.GET_BY_STATUS}/${status}`);
    },

    updateBookingStatus: (id, status) => {
        console.log('📦 Updating booking status:', id, status);
        return api.patch(`${BOOKING_ENDPOINTS.ADMIN.UPDATE_STATUS}/${id}/status`, null, {
            params: { status }
        });
    },

    deleteBooking: (id) => {
        console.log('📦 Deleting booking:', id);
        return api.delete(`${BOOKING_ENDPOINTS.ADMIN.DELETE}/${id}`);
    },

    getTodayCheckIns: () => {
        console.log('📦 Fetching today check-ins');
        return api.get(BOOKING_ENDPOINTS.ADMIN.TODAY_CHECKINS);
    },

    getTodayCheckOuts: () => {
        console.log('📦 Fetching today check-outs');
        return api.get(BOOKING_ENDPOINTS.ADMIN.TODAY_CHECKOUTS);
    },

    checkIn: (id) => {
        console.log('📦 Checking in booking:', id);
        return api.post(`${BOOKING_ENDPOINTS.ADMIN.CHECKIN}/${id}/checkin`);
    },

    checkOut: (id) => {
        console.log('📦 Checking out booking:', id);
        return api.post(`${BOOKING_ENDPOINTS.ADMIN.CHECKOUT}/${id}/checkout`);
    },

    getBookingStatistics: () => {
        console.log('📦 Fetching booking statistics');
        return api.get(BOOKING_ENDPOINTS.ADMIN.STATISTICS);
    }
};