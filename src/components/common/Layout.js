import React from 'react';
import { Box, CssBaseline, Typography, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const theme = useTheme();

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" />;
    }

    return (
        <Box sx={{ 
            display: 'flex',
            minHeight: '100vh',
            background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/api/placeholder/1920/1080')`,
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
        }}>
            <CssBaseline />
            <Sidebar />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 4,
                    marginLeft: { xs: 0, sm: '60px' },
                    transition: theme.transitions.create(['margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Box
                    sx={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                        backdropFilter: 'blur(10px)',
                        padding: 3,
                        minHeight: 'calc(100vh - 64px)'
                    }}
                >
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            mb: 4, 
                            color: theme.palette.primary.main,
                            fontWeight: 700 
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;