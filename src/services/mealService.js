import api from '../utils/api';

export const mealService = {
    getAllMeals: async () => {
        try {
            const response = await api.get('/meals');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createMeal: async (mealData) => {
        try {
            const response = await api.post('/meals', mealData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateMeal: async (mealId, mealData) => {
        try {
            const response = await api.put(`/meals/${mealId}`, mealData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMeal: async (mealId) => {
        try {
            await api.delete(`/meals/${mealId}`);
        } catch (error) {
            throw error;
        }
    }
};