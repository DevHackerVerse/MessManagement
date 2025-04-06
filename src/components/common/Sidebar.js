import React, { useState } from 'react';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Box,
    Typography,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery,
    Avatar,
    Tooltip,
    alpha
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    People as UsersIcon, 
    RestaurantMenu as MealsIcon, 
    Payment as PaymentsIcon, 
    Feedback as FeedbackIcon, 
    ExitToApp as LogoutIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    Restaurant as MessPlanIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const theme = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(!isMobile);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { 
            text: 'Dashboard', 
            icon: <DashboardIcon />, 
            path: '/dashboard' 
        },
        { 
            text: 'Users', 
            icon: <UsersIcon />, 
            path: '/users' 
        },
        { 
            text: 'Meals', 
            icon: <MealsIcon />, 
            path: '/meals' 
        },
        { 
            text: 'Mess Plans', 
            icon: <MessPlanIcon />, 
            path: '/mess-plans' 
        },
        { 
            text: 'Payments', 
            icon: <PaymentsIcon />, 
            path: '/payments' 
        },
        { 
            text: 'Feedbacks', 
            icon: <FeedbackIcon />, 
            path: '/feedbacks' 
        }
    ];

    const drawer = (
        <>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    py: 3,
                    backgroundImage: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                    color: 'white'
                }}
            >
                {isMobile && (
                    <IconButton 
                        onClick={toggleDrawer}
                        sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
                <Avatar 
                    src="https://img.freepik.com/premium-photo/blurred-restaurant-background-with-some-people-eating-chefs-waiters-working-generative-ai_438099-22504.jpg?w=2000" 
                    alt="Admin" 
                    sx={{ 
                        width: 80, 
                        height: 80,
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Admin Portal
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {user?.email || 'admin@example.com'}
                </Typography>
            </Box>
            <Divider />
            <List sx={{ px: 1, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem 
                            key={item.text}
                            button 
                            component={Link}
                            to={item.path}
                            sx={{
                                my: 0.5,
                                borderRadius: 2,
                                backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                color: isActive ? theme.palette.primary.main : 'inherit',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                }
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: isActive ? theme.palette.primary.main : 'inherit',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text} 
                                primaryTypographyProps={{ 
                                    fontWeight: isActive ? 600 : 400 
                                }} 
                            />
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <List sx={{ px: 1, py: 1, mt: 'auto' }}>
                <Tooltip title="Logout">
                    <ListItem 
                        button 
                        onClick={logout}
                        sx={{
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.05),
                                color: theme.palette.error.main
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <LogoutIcon color="error" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Logout" 
                            sx={{ color: theme.palette.error.main }}
                        />
                    </ListItem>
                </Tooltip>
            </List>
        </>
    );

    if (isMobile) {
        return (
            <>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    edge="start"
                    sx={{
                        position: 'fixed',
                        left: 16,
                        top: 16,
                        zIndex: 1199,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={toggleDrawer}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { 
                            width: 240,
                            boxSizing: 'border-box',
                            boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
                    borderRight: 'none'
                },
            }}
        >
            {drawer}
        </Drawer>
    );
};

export default Sidebar;