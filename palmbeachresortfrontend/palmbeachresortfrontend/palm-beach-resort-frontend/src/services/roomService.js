import api, { apiUtils } from './api';
import { ROOM_ENDPOINTS } from '../utils/constants';

export const roomService = {
    // Customer endpoints
    getAvailableRooms: () =>
        api.get(ROOM_ENDPOINTS.CUSTOMER.GET_ALL),

    getRoomById: (id) =>
        api.get(`${ROOM_ENDPOINTS.CUSTOMER.GET_BY_ID}/${id}`),

    getRoomsByType: (roomType) =>
        api.get(`${ROOM_ENDPOINTS.CUSTOMER.GET_BY_TYPE}/${roomType}`),

    getRoomsByPriceRange: (minPrice, maxPrice) =>
        api.get(ROOM_ENDPOINTS.CUSTOMER.GET_BY_PRICE_RANGE, {
            params: { minPrice, maxPrice }
        }),

    searchRooms: (filters) =>
        api.get(ROOM_ENDPOINTS.CUSTOMER.SEARCH, {
            params: filters
        }),

    getRoomTypes: () =>
        api.get(ROOM_ENDPOINTS.CUSTOMER.GET_TYPES),

    getSortedRooms: (sortOrder) =>
        api.get(ROOM_ENDPOINTS.CUSTOMER.GET_SORTED, {
            params: { sort: sortOrder }
        }),

    // Admin endpoints - UPDATED WITH DEBUG LOGGING
    getAllRooms: () =>
        api.get(ROOM_ENDPOINTS.ADMIN.GET_ALL),

    createRoom: (roomData) => {
        console.log('🚀 roomService: Sending to API:', roomData); // Debug log
        return api.post(ROOM_ENDPOINTS.ADMIN.CREATE, roomData);
    },

    updateRoom: (id, roomData) => {
        console.log('🚀 roomService: Updating room:', id, roomData);
        return api.put(`${ROOM_ENDPOINTS.ADMIN.UPDATE}/${id}`, roomData);
    },

    updateRoomPartial: (id, updates) =>
        api.patch(`${ROOM_ENDPOINTS.ADMIN.UPDATE}/${id}`, updates),

    deleteRoom: (id) =>
        api.delete(`${ROOM_ENDPOINTS.ADMIN.DELETE}/${id}`),

    checkRoomNumber: (roomNumber) =>
        api.get(`${ROOM_ENDPOINTS.ADMIN.CHECK_ROOM_NUMBER}/${roomNumber}`),

    // Utility methods with error handling
    getAvailableRoomsSafe: async () => {
        try {
            const response = await apiUtils.withRetry(
                () => roomService.getAvailableRooms()
            );
            return { success: true, data: response.data };
        } catch (error) {
            return apiUtils.handleError(error);
        }
    },

    createRoomSafe: async (roomData) => {
        try {
            const response = await roomService.createRoom(roomData);
            return { success: true, data: response.data };
        } catch (error) {
            return apiUtils.handleError(error);
        }
    },

    // Bulk operations
    createMultipleRooms: async (roomsData) => {
        const results = [];
        for (const roomData of roomsData) {
            const result = await roomService.createRoomSafe(roomData);
            results.push(result);
        }
        return results;
    }
};