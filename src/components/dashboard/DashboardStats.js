import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { 
    PeopleOutline as UsersIcon, 
    RestaurantMenu as MealsIcon, 
    Payment as PaymentsIcon, 
    Feedback as FeedbackIcon 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon }) => (
    <Paper 
        elevation={4} 
        style={{
            padding: 20,
            textAlign: 'center',
            borderRadius: 12,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease-in-out',
            backgroundColor: 'rgba(255, 255, 255, 0.85)' // Light transparency for visibility
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
        <div style={{ marginBottom: 8, color: '#1976D2' }}>{icon}</div>
        <Typography variant="h6" style={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="h4" style={{ fontWeight: 700, color: '#333' }}>{value}</Typography>
    </Paper>
);

const DashboardStats = ({ stats }) => {
    const statItems = [
        { title: 'Total Users', value: stats.totalUsers, icon: <UsersIcon fontSize="large" /> },
        { title: 'Total Meals', value: stats.totalMeals, icon: <MealsIcon fontSize="large" /> },
        { title: 'Total Payments', value: stats.totalPayments, icon: <PaymentsIcon fontSize="large" /> },
        { title: 'Pending Feedbacks', value: stats.pendingFeedbacks, icon: <FeedbackIcon fontSize="large" /> }
    ];

    return (
        <div 
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url('https://mir-s3-cdn-cf.behance.net/project_modules/fs/6b12a9177541929.64d821ba17be3.jpg')`, // Change URL to your preferred image
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "40px"
            }}
        >
            <Grid container spacing={3} style={{ maxWidth: "1200px" }}>
                {statItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard title={item.title} value={item.value} icon={item.icon} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default DashboardStats;
