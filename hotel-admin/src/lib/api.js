const BASE = import.meta.env.VITE_API_BASE || "/api/admin";

// Mock data for development when backend is not available
const MOCK_BOOKINGS = [
    {
        booking_id: 1,
        customer_id: 101,
        customerName: "John Doe",
        room_id: 201,
        roomType: "Deluxe Suite",
        booking_date: "2024-01-15",
        check_in_date: "2024-01-20",
        check_out_date: "2024-01-25",
        status: "CONFIRMED",
        special_request: "Late checkout requested"
    },
    {
        booking_id: 2,
        customer_id: 102,
        customerName: "Jane Smith",
        room_id: 202,
        roomType: "Standard Room",
        booking_date: "2024-01-16",
        check_in_date: "2024-01-22",
        check_out_date: "2024-01-24",
        status: "PENDING",
        special_request: "Ground floor preferred"
    },
    {
        booking_id: 3,
        customer_id: 103,
        customerName: "Bob Johnson",
        room_id: 203,
        roomType: "Executive Suite",
        booking_date: "2024-01-17",
        check_in_date: "2024-01-25",
        check_out_date: "2024-01-28",
        status: "CANCELLED",
        special_request: null
    }
];

// Check if we should use mock data (when backend is not available)
let useMockData = false;

async function request(path, options = {}) {
    try {
        const res = await fetch(`${BASE}${path}`, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            ...options,
        });
        
        if (!res.ok) {
            const text = await res.text();
            // Check if response is HTML (error page) instead of JSON
            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || text.includes('text/html')) {
                useMockData = true;
                throw new Error(`Server returned HTML instead of JSON. Using mock data for development.`);
            }
            throw new Error(text || `HTTP ${res.status}`);
        }
        
        // Check if response is actually JSON
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.status === 204 ? null : res.json();
        } else {
            const text = await res.text();
            // If we get HTML content, switch to mock data
            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || contentType?.includes('text/html')) {
                useMockData = true;
                throw new Error(`Expected JSON response but got HTML. Using mock data for development.`);
            }
            throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
        }
    } catch (error) {
        // Handle network errors or other fetch failures
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            useMockData = true;
            throw new Error('Unable to connect to the server. Using mock data for development.');
        }
        throw error;
    }
}

// Mock API functions for development
const mockApi = {
    async listBookings({ status, roomType, date } = {}) {
        let filteredBookings = [...MOCK_BOOKINGS];
        
        if (status && status !== "ALL") {
            filteredBookings = filteredBookings.filter(b => b.status === status);
        }
        if (roomType && roomType !== "ALL") {
            filteredBookings = filteredBookings.filter(b => b.roomType === roomType);
        }
        if (date) {
            filteredBookings = filteredBookings.filter(b => 
                b.check_in_date <= date && b.check_out_date >= date
            );
        }
        
        return filteredBookings;
    },
    
    async getBooking(id) {
        const booking = MOCK_BOOKINGS.find(b => b.booking_id === parseInt(id));
        if (!booking) throw new Error('Booking not found');
        return booking;
    },
    
    async updateStatus(id, status) {
        const booking = MOCK_BOOKINGS.find(b => b.booking_id === parseInt(id));
        if (!booking) throw new Error('Booking not found');
        booking.status = status;
        return booking;
    },
    
    async updateBooking(id, body) {
        const booking = MOCK_BOOKINGS.find(b => b.booking_id === parseInt(id));
        if (!booking) throw new Error('Booking not found');
        Object.assign(booking, body);
        return booking;
    },
    
    async deleteBooking(id) {
        const index = MOCK_BOOKINGS.findIndex(b => b.booking_id === parseInt(id));
        if (index === -1) throw new Error('Booking not found');
        MOCK_BOOKINGS.splice(index, 1);
        return null;
    }
};

export const api = {
    // SCRU-177
    async listBookings({ status, roomType, date } = {}) {
        try {
            const params = new URLSearchParams();
            if (status && status !== "ALL") params.set("status", status);
            if (roomType && roomType !== "ALL") params.set("roomType", roomType);
            if (date) params.set("date", date);
            const qs = params.toString() ? `?${params.toString()}` : "";
            return await request(`/bookings${qs}`);
        } catch (error) {
            if (useMockData || error.message.includes('Unable to connect') || error.message.includes('HTML') || error.message.includes('JSON')) {
                console.warn('Using mock data for development:', error.message);
                return await mockApi.listBookings({ status, roomType, date });
            }
            throw error;
        }
    },
    
    async getBooking(id) {
        try {
            return await request(`/bookings/${id}`);
        } catch (error) {
            if (useMockData || error.message.includes('Unable to connect') || error.message.includes('HTML') || error.message.includes('JSON')) {
                console.warn('Using mock data for development:', error.message);
                return await mockApi.getBooking(id);
            }
            throw error;
        }
    },

    // SCRU-178
    async updateStatus(id, status) {
        try {
            return await request(`/bookings/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status }),
            });
        } catch (error) {
            if (useMockData || error.message.includes('Unable to connect') || error.message.includes('HTML') || error.message.includes('JSON')) {
                console.warn('Using mock data for development:', error.message);
                return await mockApi.updateStatus(id, status);
            }
            throw error;
        }
    },

    // SCRU-179
    async updateBooking(id, body) {
        try {
            return await request(`/bookings/${id}`, {
                method: "PUT",
                body: JSON.stringify(body),
            });
        } catch (error) {
            if (useMockData || error.message.includes('Unable to connect') || error.message.includes('HTML') || error.message.includes('JSON')) {
                console.warn('Using mock data for development:', error.message);
                return await mockApi.updateBooking(id, body);
            }
            throw error;
        }
    },

    // SCRU-180
    async deleteBooking(id) {
        try {
            return await request(`/bookings/${id}`, { method: "DELETE" });
        } catch (error) {
            if (useMockData || error.message.includes('Unable to connect') || error.message.includes('HTML') || error.message.includes('JSON')) {
                console.warn('Using mock data for development:', error.message);
                return await mockApi.deleteBooking(id);
            }
            throw error;
        }
    },
};
