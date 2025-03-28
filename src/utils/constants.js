// API Base URL
export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE_TOKEN: '/auth/validate'
};

// User Endpoints
export const USER_ENDPOINTS = {
    GET_ALL: '/admin/users',
    CREATE: '/admin/users',
    UPDATE: '/admin/users',
    DELETE: '/admin/users'
};

// Meal Endpoints
export const MEAL_ENDPOINTS = {
    GET_ALL: '/meals',
    CREATE: '/meals',
    UPDATE: '/meals',
    DELETE: '/meals',
    TODAY_MEALS: '/meals/today'
};

// Mess Plan Endpoints
export const MESS_PLAN_ENDPOINTS = {
    GET_ALL: '/admin/mess-plans',
    CREATE: '/admin/mess-plans',
    UPDATE: '/admin/mess-plans',
    DELETE: '/admin/mess-plans'
};

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
    GET_ALL: '/api/payments/all',
    PENDING: '/api/payments/pending',
    VERIFY: '/api/payments',
    REJECT: '/api/payments'
};

// Feedback Endpoints
export const FEEDBACK_ENDPOINTS = {
    GET_ALL: '/admin/feedbacks',
    PENDING: '/admin/feedbacks/pending',
    RESOLVE: '/admin/feedbacks'
};

// Meal Types
export const MEAL_TYPES = {
    BREAKFAST: 'BREAKFAST',
    LUNCH: 'LUNCH',
    DINNER: 'DINNER'
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
};

// Feedback Status
export const FEEDBACK_STATUS = {
    PENDING: 'PENDING',
    REVIEWED: 'REVIEWED',
    RESOLVED: 'RESOLVED'
};

// Validation Rules
export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: {
        MIN_LENGTH: 8,
        REQUIRES_UPPERCASE: true,
        REQUIRES_LOWERCASE: true,
        REQUIRES_NUMBER: true
    }
};

// Storage Keys
export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token'
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Unauthorized access. Please login again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.'
};

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
    PAGE_SIZE: 10,
    INITIAL_PAGE: 0
};