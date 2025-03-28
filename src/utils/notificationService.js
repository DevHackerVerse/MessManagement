// utils/notificationService.js
import { toast } from 'react-toastify';

export const NotificationService = {
    success: (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
        });
    },
    error: (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
        });
    },
    info: (message) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 3000,
        });
    }
};