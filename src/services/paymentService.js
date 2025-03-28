import api from '../utils/api';
import { BASE_URL } from '../utils/constants';

export const paymentService = {
    getAllPayments: async () => {
        try {
            const response = await api.get(`${BASE_URL}/api/payments/all`);
            console.log('All Payments:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch all payments', error);
            throw error;
        }
    },

    getPendingPayments: async () => {
        try {
            const response = await api.get(`${BASE_URL}/api/payments/pending`);
            console.log('Pending Payments:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch pending payments', error);
            throw error;
        }
    },

    verifyPayment: async (paymentId, remarks) => {
        try {
            const response = await api.post(`${BASE_URL}/api/payments/${paymentId}/verify`, null, {
                params: { remarks }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to verify payment', error);
            throw error;
        }
    },

    rejectPayment: async (paymentId, reason) => {
        try {
            const response = await api.post(`${BASE_URL}/api/payments/${paymentId}/reject`, null, {
                params: { reason }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to reject payment', error);
            throw error;
        }
    }
};