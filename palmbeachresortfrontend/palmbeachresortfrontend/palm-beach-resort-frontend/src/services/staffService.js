// services/staffService.js
import api from './api';

export const staffService = {
    // Get all staff members - ✅ MATCHES BACKEND: GET /api/staff
    getAllStaff: () =>
        api.get('/staff'),

    // Get staff by ID - ✅ MATCHES BACKEND: GET /api/staff/{id}
    getStaffById: (id) =>
        api.get(`/staff/${id}`),

    // Delete staff - ✅ MATCHES BACKEND: DELETE /api/staff/{id}
    deleteStaff: (id) =>
        api.delete(`/staff/${id}`)

    // Note: Create staff endpoint not available in current backend
    // Staff creation should be handled through authentication/registration system
};