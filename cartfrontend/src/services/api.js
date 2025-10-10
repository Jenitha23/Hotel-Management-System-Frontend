import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Generate a session ID for cart management
export const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

// Add session ID to request headers
api.interceptors.request.use((config) => {
    const sessionId = getSessionId();
    config.headers['X-Session-Id'] = sessionId;
    return config;
});

export const menuAPI = {
    getAll: () => api.get('/menu'),
    getByCategory: (category) => api.get(`/menu/category/${category}`),
    create: (menuItem) => api.post('/menu', menuItem),
    update: (id, menuItem) => api.put(`/menu/${id}`, menuItem),
    delete: (id) => api.delete(`/menu/${id}`),
};

export const cartAPI = {
    get: () => api.get('/cart'),
    addItem: (menuId, quantity) => api.post('/cart/add', { menuId, quantity }),
    updateItem: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
    removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
    clear: () => api.delete('/cart/clear'),
};

export const orderAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getByEmail: (email) => api.get(`/orders?email=${email}`),
    getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
    getBill: (orderNumber) => api.get(`/orders/${orderNumber}/bill`, { responseType: 'blob' }),
    getAll: () => api.get('/orders/all'),
    updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
};

export default api;