import { BASE_URL } from '../utils/constants';
import api from '../utils/api' // Define your actual API base URL

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserMessPlan: async (userId) => {
        try {
            const response = await api.get(`${BASE_URL}/api/user/${userId}/mess-plan`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user mess plan', error);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/admin/users', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            await api.delete(`/admin/users/${userId}`);
        } catch (error) {
            throw error;
        }
    }
};
