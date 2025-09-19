import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach Basic Auth from localStorage if present
api.interceptors.request.use(
    (config) => {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth) {
            try {
                const { username, password } = JSON.parse(adminAuth);
                const token = btoa(`${username}:${password}`);
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Basic ${token}`;
            } catch { /* ignore parse errors */ }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle Spring Boot ProblemDetail
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.detail) {
            error.message = error.response.data.detail;
        } else if (error.response?.data?.message) {
            error.message = error.response.data.message;
        } else if (error.response?.status) {
            error.message = `Request failed with status ${error.response.status}`;
        }
        return Promise.reject(error);
    }
);

export default api;