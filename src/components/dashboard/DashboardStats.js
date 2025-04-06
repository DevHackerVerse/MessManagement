import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { 
    PeopleOutline as UsersIcon, 
    RestaurantMenu as MealsIcon, 
    Payment as PaymentsIcon, 
    Feedback as FeedbackIcon 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper 
        elevation={6} 
        sx={{
            padding: 3,
            textAlign: 'center',
            borderRadius: 4,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease-in-out',
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            border: `1px solid ${color}30`,
            height: '100%',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.2)',
            }
        }}
    >
        <Box 
            sx={{
                backgroundColor: `${color}20`,
                borderRadius: '50%',
                padding: 2,
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {React.cloneElement(icon, { sx: { fontSize: 40, color: color } })}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>{title}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>{value.toLocaleString()}</Typography>
    </Paper>
);

const DashboardStats = ({ stats }) => {
    const statItems = [
        { title: 'Total Users', value: stats.totalUsers, icon: <UsersIcon />, color: '#4361EE' },
        { title: 'Total Meals', value: stats.totalMeals, icon: <MealsIcon />, color: '#3A0CA3' },
        { title: 'Total Payments', value: stats.totalPayments, icon: <PaymentsIcon />, color: '#4CC9F0' },
        { title: 'Pending Feedbacks', value: stats.pendingFeedbacks, icon: <FeedbackIcon />, color: '#F72585' }
    ];

    return (
        <Box 
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: { xs: 2, sm: 4, md: 6 },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('/images/dashboard-bg.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    opacity: 0.08,
                    zIndex: -1
                }
            }}
        >
            <Grid container spacing={4} sx={{ maxWidth: "1400px", margin: "0 auto" }}>
                <Grid item xs={12}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            textAlign: "center", 
                            mb: 6, 
                            fontWeight: 700,
                            background: "linear-gradient(45deg, #4361EE, #F72585)",
                            backgroundClip: "text",
                            textFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        Dashboard Overview
                    </Typography>
                </Grid>
                {statItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard 
                            title={item.title} 
                            value={item.value} 
                            icon={item.icon} 
                            color={item.color} 
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DashboardStats;