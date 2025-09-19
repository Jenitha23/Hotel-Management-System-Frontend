import api from './axios.js';

export const listRooms = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.available !== undefined) {
        params.append('available', filters.available);
    }
    if (filters.type && filters.type !== 'ALL') {
        params.append('type', filters.type);
    }

    const response = await api.get(`/api/rooms?${params.toString()}`);
    return response.data;
};

export const getRoom = async (id) => {
    const response = await api.get(`/api/rooms/${id}`);
    return response.data;
};

export const createRoom = async (roomData) => {
    const response = await api.post('/api/admin/rooms', roomData);
    return response.data;
};

export const updateRoom = async (id, roomData) => {
    const response = await api.put(`/api/admin/rooms/${id}`, roomData);
    return response.data;
};

export const deleteRoom = async (id) => {
    const response = await api.delete(`/api/admin/rooms/${id}`);
    return response.data;
};