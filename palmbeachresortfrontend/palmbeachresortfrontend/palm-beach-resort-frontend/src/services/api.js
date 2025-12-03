import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Essential for session cookies
    timeout: 30000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Log outgoing requests
api.interceptors.request.use(
    (config) => {
        // Add timestamp to track request timing
        config.metadata = { startTime: new Date() };

        console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params
        });

        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
    (response) => {
        const endTime = new Date();
        const startTime = response.config.metadata?.startTime;
        const duration = startTime ? endTime - startTime : 'Unknown';

        console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            duration: `${duration}ms`,
            data: response.data
        });

        return response;
    },
    (error) => {
        const endTime = new Date();
        const startTime = error.config?.metadata?.startTime;
        const duration = startTime ? endTime - startTime : 'Unknown';

        // Enhanced error logging
        if (error.response) {
            // Server responded with error status
            console.error(`❌ API Error ${error.response.status}: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                status: error.response.status,
                duration: `${duration}ms`,
                data: error.response.data,
                headers: error.response.headers
            });

            // Handle specific HTTP status codes
            switch (error.response.status) {
                case 401:
                    console.warn('🔐 Unauthorized - User needs to login');
                    // You could trigger logout here if needed
                    break;
                case 403:
                    console.warn('🚫 Forbidden - User lacks permissions');
                    break;
                case 404:
                    console.warn('🔍 Not Found - Endpoint does not exist');
                    break;
                case 500:
                    console.error('💥 Server Error - Backend issue');
                    break;
                default:
                    console.warn(`⚠️ HTTP Error ${error.response.status}`);
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('🌐 Network Error: No response received', {
                url: error.config?.url,
                method: error.config?.method,
                duration: `${duration}ms`
            });
        } else {
            // Something else happened
            console.error('⚡ Setup Error:', error.message);
        }

        // Enhanced error object with more context
        const enhancedError = {
            ...error,
            message: getErrorMessage(error),
            timestamp: new Date().toISOString(),
            url: error.config?.url,
            method: error.config?.method
        };

        return Promise.reject(enhancedError);
    }
);

// Helper function to get user-friendly error messages
function getErrorMessage(error) {
    if (error.response?.data) {
        const data = error.response.data;

        // Handle validation errors from Spring Boot
        if (data.errors) {
            const validationErrors = Object.values(data.errors).join(', ');
            return `Validation failed: ${validationErrors}`;
        }

        // Handle custom error messages from backend
        if (data.message) {
            return data.message;
        }

        // Handle Spring Security errors
        if (data.error) {
            return `${data.error}: ${data.message || 'Please check your credentials'}`;
        }
    }

    if (error.code === 'ECONNABORTED') {
        return 'Request timeout - Please try again';
    }

    if (error.message === 'Network Error') {
        return 'Network error - Please check your connection and ensure the backend is running';
    }

    return error.message || 'An unexpected error occurred';
}

// API health check function
export const checkApiHealth = async () => {
    try {
        const response = await api.get('/actuator/health');
        return {
            status: 'healthy',
            data: response.data
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message
        };
    }
};

// Utility functions for common API patterns
export const apiUtils = {
    // Handle API calls with loading states
    withLoading: async (apiCall, setLoading = null) => {
        try {
            if (setLoading) setLoading(true);
            const response = await apiCall;
            return response;
        } finally {
            if (setLoading) setLoading(false);
        }
    },

    // Retry mechanism for failed requests
    withRetry: async (apiCall, maxRetries = 3, delay = 1000) => {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await apiCall();
                console.log(`✅ Request succeeded on attempt ${attempt}`);
                return result;
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);

                // Don't retry on 4xx errors (client errors)
                if (error.response?.status >= 400 && error.response?.status < 500) {
                    break;
                }

                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    const waitTime = delay * Math.pow(2, attempt - 1);
                    console.log(`⏳ Retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        throw lastError;
    }
};

// Export the configured axios instance
export default api;