import api from '../utils/api';
import { BASE_URL } from '../utils/constants';

export const dashboardService = {
    getDashboardStats: async () => {
        try {
            const response = await api.get(`${BASE_URL}/api/admin/dashboard/stats`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
            throw error;
        }
    }
};