import api from '../utils/api';

export const feedbackService = {
    getPendingFeedbacks: async () => {
        try {
            const response = await api.get('/api/feedbacks/pending');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    resolveFeedback: async (feedbackId, response) => {
        try {
            const result = await api.post(`/feedbacks/${feedbackId}/resolve`, null, {
                params: { response }
            });
            return result.data;
        } catch (error) {
            throw error;
        }
    },

    getAllFeedbacks: async () => {
        try {
            const response = await api.get('/feedbacks/all');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};