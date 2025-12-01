// services/staffService.js
import api from './api';

export const staffService = {
    // Get all staff members - ✅ MATCHES BACKEND: GET /api/staff
    getAllStaff: () =>
        api.get('/api/staff'),

    // Get staff by ID - ✅ MATCHES BACKEND: GET /api/staff/{id}
    getStaffById: (id) =>
        api.get(`/api/staff/${id}`),

    // Delete staff - ✅ MATCHES BACKEND: DELETE /api/staff/{id}
    deleteStaff: (id) =>
        api.delete(`/api/staff/${id}`)

    // Note: Create staff endpoint not available in current backend
    // Staff creation should be handled through authentication/registration system
};