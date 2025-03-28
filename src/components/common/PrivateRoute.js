import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;