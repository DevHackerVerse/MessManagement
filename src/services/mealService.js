import api from '../utils/api';

export const mealService = {
    getAllMeals: async () => {
        try {
            const response = await api.get('/meals');
            return response.data;
        } catch (error) {
            console.error('Error getting all meals:', error);
            throw error;
        }
    },
    
    createMeal: async (mealData) => {
        try {
            console.log('Creating meal with data:', mealData);
            const response = await api.post('/meals', mealData);
            console.log('Create meal response:', response);
            return response.data;
        } catch (error) {
            console.error('Error creating meal:', error);
            throw error;
        }
    },
    
    updateMeal: async (mealId, mealData) => {
        try {
            console.log(`Updating meal ID ${mealId} with data:`, mealData);
            if (!mealId) {
                throw new Error('Meal ID is required for update operation');
            }
            const response = await api.put(`/meals/${mealId}`, mealData);
            console.log('Update meal response:', response);
            return response.data;
        } catch (error) {
            console.error(`Error updating meal ${mealId}:`, error);
            throw error;
        }
    },
    
    deleteMeal: async (mealId) => {
        try {
            await api.delete(`/meals/${mealId}`);
        } catch (error) {
            console.error(`Error deleting meal ${mealId}:`, error);
            throw error;
        }
    }
};