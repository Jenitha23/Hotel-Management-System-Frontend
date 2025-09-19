import axios from 'axios';
import type { Room, BookingResponse, BookingRequest, ApiResponse, Customer } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Set to false since we're not using cookies
    timeout: 30000, // 30 second timeout
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to the backend server. Please ensure the backend server is running on port 8080.');
        }
        
        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            console.error('Server Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            // The request was made but no response received
            console.error('Network Error:', {
                error: error.message,
                request: error.request
            });
            
            if (error.message.includes('ECONNREFUSED')) {
                throw new Error('Backend server is not running. Please start the backend server on port 8080.');
            } else if (error.message.includes('Network Error')) {
                throw new Error('Unable to connect to server. Please check if the backend server is running and CORS is properly configured.');
            }
            throw new Error('No response from server. Please check your internet connection or try again later.');
        } else {
            // Error in request setup
            console.error('Request Setup Error:', error.message);
            throw error;
        }
    }
);

export const apiService = {
    // Room endpoints
    getRooms: async (): Promise<Room[]> => {
        const response = await api.get<ApiResponse<Room[]>>('/rooms');
        return response.data.data || [];
    },

    getAvailableRooms: async (): Promise<Room[]> => {
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                const response = await api.get<ApiResponse<Room[]>>('/rooms/available', {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (!response.data) {
                    throw new Error('Invalid response format from server');
                }
                
                return response.data.data || [];
            } catch (error) {
                retryCount++;
                
                if (retryCount === maxRetries) {
                    if (axios.isAxiosError(error)) {
                        if (error.code === 'ECONNREFUSED') {
                            throw new Error('Cannot connect to the backend server. Please ensure the backend is running on port 8080.');
                        }
                        if (error.response) {
                            throw new Error(`Server error: ${error.response.data?.message || error.response.statusText}`);
                        } else if (error.request) {
                            throw new Error('Backend server is not responding. Please check if it is running on port 8080.');
                        }
                    }
                    throw new Error('Failed to fetch available rooms after multiple attempts. Please check the backend server.');
                }
                
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            }
        }
        
        return [];
    },

    getAvailableRoomsForDates: async (checkInDate: string, checkOutDate: string): Promise<Room[]> => {
        const response = await api.get<ApiResponse<Room[]>>('/rooms/available-for-dates', {
            params: { checkInDate, checkOutDate }
        });
        return response.data.data || [];
    },

    getRoom: async (id: number): Promise<Room> => {
        const response = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
        if (!response.data.data) throw new Error('Room not found');
        return response.data.data;
    },

    // Booking endpoints
    createBooking: async (bookingRequest: BookingRequest): Promise<BookingResponse> => {
        try {
            console.log('Creating booking with request:', bookingRequest);
            const response = await api.post<ApiResponse<BookingResponse>>('/bookings', bookingRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.data.data) {
                throw new Error(response.data.message || 'Failed to create booking');
            }
            
            console.log('Booking created successfully:', response.data.data);
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                console.error('Error creating booking:', errorMessage);
                throw new Error(`Failed to create booking: ${errorMessage}`);
            }
            throw error;
        }
    },

    getBookings: async (): Promise<BookingResponse[]> => {
        const response = await api.get<ApiResponse<BookingResponse[]>>('/bookings');
        return response.data.data || [];
    },

    getBookingsByCustomer: async (customerId: number): Promise<BookingResponse[]> => {
        const response = await api.get<ApiResponse<BookingResponse[]>>(`/bookings/customer/${customerId}`);
        return response.data.data || [];
    },

    getBooking: async (id: number): Promise<BookingResponse> => {
        const response = await api.get<ApiResponse<BookingResponse>>(`/bookings/${id}`);
        if (!response.data.data) throw new Error('Booking not found');
        return response.data.data;
    },

    cancelBooking: async (id: number): Promise<BookingResponse> => {
        const response = await api.put<ApiResponse<BookingResponse>>(`/bookings/${id}/cancel`);
        if (!response.data.data) throw new Error(response.data.message);
        return response.data.data;
    },

    // Customer endpoints
    createCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
        // This would be implemented if you have a customer creation endpoint
        // For now, we'll assume customers are created during booking
        void customer; // Acknowledge the parameter even though it's not used yet
        throw new Error('Not implemented');
    },

    getCustomer: async (id: number): Promise<Customer> => {
        // This would be implemented if you have a customer endpoint
        void id; // Acknowledge the parameter even though it's not used yet
        throw new Error('Not implemented');
    },
};