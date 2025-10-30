import api from './api';

const taskService = {
    // Admin Task Operations
    createTask: async (taskData) => {
        const response = await api.post('/api/admin/tasks', taskData);
        return response.data;
    },

    getAllTasks: async () => {
        const response = await api.get('/api/admin/tasks');
        return response.data;
    },

    getTaskById: async (taskId) => {
        const response = await api.get(`/api/admin/tasks/${taskId}`);
        return response.data;
    },

    updateTask: async (taskId, taskData) => {
        const response = await api.put(`/api/admin/tasks/${taskId}`, taskData);
        return response.data;
    },

    assignTask: async (taskId, staffId) => {
        const response = await api.post(`/api/admin/tasks/${taskId}/assign/${staffId}`);
        return response.data;
    },

    updateTaskStatus: async (taskId, statusData) => {
        const response = await api.patch(`/api/admin/tasks/${taskId}/status`, statusData);
        return response.data;
    },

    deleteTask: async (taskId) => {
        await api.delete(`/api/admin/tasks/${taskId}`);
    },

    getTasksByStatus: async (status) => {
        const response = await api.get(`/api/admin/tasks/status/${status}`);
        return response.data;
    },

    getTasksByPriority: async (priority) => {
        const response = await api.get(`/api/admin/tasks/priority/${priority}`);
        return response.data;
    },

    getOverdueTasks: async () => {
        const response = await api.get('/api/admin/tasks/overdue');
        return response.data;
    },

    getTasksDueToday: async () => {
        const response = await api.get('/api/admin/tasks/due-today');
        return response.data;
    },

    // Comment Operations
    addComment: async (taskId, commentData) => {
        const response = await api.post(`/api/admin/tasks/${taskId}/comments`, commentData);
        return response.data;
    },

    getTaskComments: async (taskId) => {
        const response = await api.get(`/api/admin/tasks/${taskId}/comments`);
        return response.data;
    },

    // Statistics
    getTaskStatistics: async () => {
        const response = await api.get('/api/admin/tasks/statistics');
        return response.data;
    },

    // Staff Task Operations
    getStaffTasks: async () => {
        const response = await api.get('/api/staff/tasks');
        return response.data;
    },

    getStaffTask: async (taskId) => {
        const response = await api.get(`/api/staff/tasks/${taskId}`);
        return response.data;
    },

    updateStaffTaskStatus: async (taskId, statusData) => {
        const response = await api.patch(`/api/staff/tasks/${taskId}/status`, statusData);
        return response.data;
    },

    getStaffTaskStatistics: async () => {
        const response = await api.get('/api/staff/tasks/statistics');
        return response.data;
    },

    addStaffComment: async (taskId, commentData) => {
        const response = await api.post(`/api/staff/tasks/${taskId}/comments`, commentData);
        return response.data;
    },

    // Get staff members for assignment (you'll need to create this endpoint)
    getAllStaff: async () => {
        try {
            // This is a placeholder - you'll need to create a staff endpoint
            // For now, return empty array or mock data
            return [];
        } catch (error) {
            console.error('Error fetching staff:', error);
            return [];
        }
        const response = await api.get('/api/admin/staff');
        return response.data;
    }
};

export default taskService;