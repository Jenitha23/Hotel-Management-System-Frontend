import axios from 'axios';

// Change this from 5174 to 8080
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const categoryService = {
    getAll: () => api.get('/categories'),
};

export const menuItemService = {
    getAll: (params = {}) => api.get('/menu-items', { params }),
    getById: (id) => api.get(`/menu-items/${id}`),
    create: (data) => api.post('/menu-items', data),
    update: (id, data) => api.put(`/menu-items/${id}`, data),
    delete: (id) => api.delete(`/menu-items/${id}`),
};

export default api;