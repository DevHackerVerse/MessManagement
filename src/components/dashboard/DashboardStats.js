import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { 
    PeopleOutline as UsersIcon, 
    RestaurantMenu as MealsIcon, 
    Payment as PaymentsIcon, 
    Feedback as FeedbackIcon 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon }) => (
    <Paper elevation={3} style={{ padding: 16, textAlign: 'center' }}>
        {icon}
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
    </Paper>
);

const DashboardStats = ({ stats }) => {
    const statItems = [
        { 
            title: 'Total Users', 
            value: stats.totalUsers, 
            icon: <UsersIcon fontSize="large" /> 
        },
        { 
            title: 'Total Meals', 
            value: stats.totalMeals, 
            icon: <MealsIcon fontSize="large" /> 
        },
        { 
            title: 'Total Payments', 
            value: stats.totalPayments, 
            icon: <PaymentsIcon fontSize="large" /> 
        },
        { 
            title: 'Pending Feedbacks', 
            value: stats.pendingFeedbacks, 
            icon: <FeedbackIcon fontSize="large" /> 
        }
    ];

    return (
        <Grid container spacing={3}>
            {statItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatCard 
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardStats;