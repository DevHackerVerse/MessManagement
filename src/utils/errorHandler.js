// Create a centralized error handling utility
// utils/errorHandler.js
export const handleError = (error) => {
    // Log error
    console.error('Error:', error);

    // Determine error message
    const errorMessage = error.response?.data?.message 
        || error.message 
        || 'An unexpected error occurred';

    // Show notification
    // You can integrate with toast or snackbar
    return errorMessage;
};