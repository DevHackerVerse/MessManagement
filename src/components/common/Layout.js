import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" />;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Sidebar />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    marginLeft: '240px' 
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;