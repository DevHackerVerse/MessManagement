export const formatDate = (dateString, options = {}) => {
    // If no date is provided
    if (!dateString) return 'N/A';

    try {
        // Create a Date object
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        // Default formatting options
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };

        // Merge default options with provided options
        const formattingOptions = { ...defaultOptions, ...options };

        // Format the date
        return new Intl.DateTimeFormat('en-US', formattingOptions).format(date);
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid Date';
    }
};

// Additional utility functions
export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

export const parseDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return isValidDate(dateString) ? date : null;
    } catch (error) {
        console.error('Date parsing error:', error);
        return null;
    }
};