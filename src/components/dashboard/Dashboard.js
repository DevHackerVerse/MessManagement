import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { dashboardService } from '../../services/dashboardService';
import DashboardStats from './DashboardStats';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMeals: 0,
        totalPayments: 0,
        pendingFeedbacks: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const dashboardData = await dashboardService.getDashboardStats();
                setStats(dashboardData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            background: "linear-gradient(to bottom, #f5f7fa, #c3cfe2)",
            minHeight: "100vh"
        }}>
            <DashboardStats stats={stats} />
        </Box>
    );
};

export default Dashboard;