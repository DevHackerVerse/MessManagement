import api from '../utils/api';
import { BASE_URL } from '../utils/constants';

export const messPlanService = {
    getAllMessPlans: async () => {
        try {
            const response = await api.get(`${BASE_URL}/api/mess-plans`);
            console.log('Mess Plans Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch mess plans', error);
            throw error;
        }
    },

    createMessPlan: async (planData) => {
        try {
            const response = await api.post(`${BASE_URL}/api/mess-plans`, planData);
            return response.data;
        } catch (error) {
            console.error('Failed to create mess plan', error);
            throw error;
        }
    },

    updateMessPlan: async (planId, planData) => {
        try {
            const response = await api.put(`${BASE_URL}/api/mess-plans/${planId}`, planData);
            return response.data;
        } catch (error) {
            console.error('Failed to update mess plan', error);
            throw error;
        }
    },

    deleteMessPlan: async (planId) => {
        try {
            await api.delete(`${BASE_URL}/api/mess-plans/${planId}`);
        } catch (error) {
            console.error('Failed to delete mess plan', error);
            throw error;
        }
    }
};