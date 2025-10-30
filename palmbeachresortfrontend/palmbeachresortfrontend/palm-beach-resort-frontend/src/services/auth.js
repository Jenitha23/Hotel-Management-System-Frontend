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

    // Check auth status with retry
    checkAuth: async () => {
        try {
            const response = await apiUtils.withRetry(
                () => api.get(AUTH_ENDPOINTS.UNIFIED.ME)
            );
            return response.data;
        } catch (error) {
            console.log('🔐 Not authenticated or session expired');
            throw error;
        }
    },

    // Validate session
    validateSession: async () => {
        try {
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