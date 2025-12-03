import api, { apiUtils } from './api';
import { AUTH_ENDPOINTS } from '../utils/constants';

export const authService = {
    // Customer Auth
    registerCustomer: (userData) =>
        api.post(AUTH_ENDPOINTS.CUSTOMER.REGISTER, userData),

    loginCustomer: (credentials) =>
        api.post(AUTH_ENDPOINTS.CUSTOMER.LOGIN, credentials),

    // Staff Auth
    registerStaff: (userData) =>
        api.post(AUTH_ENDPOINTS.STAFF.REGISTER, userData),

    loginStaff: (credentials) =>
        api.post(AUTH_ENDPOINTS.STAFF.LOGIN, credentials),

    // Admin Auth
    registerAdmin: (userData) =>
        api.post(AUTH_ENDPOINTS.ADMIN.REGISTER, userData),

    loginAdmin: (credentials) =>
        api.post(AUTH_ENDPOINTS.ADMIN.LOGIN, credentials),

    // Unified Auth
    unifiedLogin: (credentials) =>
        api.post(AUTH_ENDPOINTS.UNIFIED.LOGIN, credentials),

    // Common Auth
    logout: (userType) => {
        // Clear localStorage on logout
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userFullName');

        if (userType) {
            return api.post(AUTH_ENDPOINTS[userType]?.LOGOUT || AUTH_ENDPOINTS.UNIFIED.LOGOUT);
        }
        return api.post(AUTH_ENDPOINTS.UNIFIED.LOGOUT);
    },

    getCurrentUser: (userType) => {
        if (userType) {
            return api.get(AUTH_ENDPOINTS[userType]?.ME || AUTH_ENDPOINTS.UNIFIED.ME);
        }
        return api.get(AUTH_ENDPOINTS.UNIFIED.ME);
    },

    // Check auth status - TEMPORARY FIX using unified endpoint
    checkAuth: async () => {
        try {
            console.log('🔐 Checking auth status...');

            // TEMPORARY FIX: Always use unified endpoint
            // The specific endpoints (/api/admin/auth/me, /api/staff/auth/me, /api/customers/auth/me)
            // are being blocked by SessionAuthenticationFilter on backend
            console.log('🔐 Using unified endpoint /api/auth/me (temporary fix)');
            const response = await api.get(AUTH_ENDPOINTS.UNIFIED.ME);

            // If successful, update localStorage with role
            if (response.data && response.data.success && response.data.role) {
                console.log('✅ Auth successful, updating localStorage with role:', response.data.role);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userEmail', response.data.email);
                localStorage.setItem('userFullName', response.data.fullName);
            }

            return response.data;
        } catch (error) {
            console.log('🔐 Unified auth check failed:', error.message);

            // Don't clear localStorage here - might be temporary issue
            // Return a failed response instead of throwing
            return {
                success: false,
                message: 'Not authenticated',
                error: error.message
            };
        }
    },

    // Validate session
    validateSession: async () => {
        try {
            // Use unified endpoint
            const response = await api.get(AUTH_ENDPOINTS.UNIFIED.ME);
            return {
                isValid: true,
                user: response.data
            };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    }
};