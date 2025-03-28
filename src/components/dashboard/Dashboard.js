import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { dashboardService } from '../../services/dashboardService';
import DashboardStats from './DashboardStats';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMeals: 0,
        totalPayments: 0,
        pendingFeedbacks: 0
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const dashboardData = await dashboardService.getDashboardStats();
                setStats(dashboardData);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <DashboardStats stats={stats} />
        </div>
    );
};

export default Dashboard;