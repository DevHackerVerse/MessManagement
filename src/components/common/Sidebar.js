import React from 'react';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText 
} from '@mui/material';
import { 
    Dashboard as DashboardIcon, 
    People as UsersIcon, 
    RestaurantMenu as MealsIcon, 
    Payment as PaymentsIcon, 
    MessPlanList as MessPlans,
    Feedback as FeedbackIcon, 
    ExitToApp as LogoutIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

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
            text: 'Payments', 
            icon: <PaymentsIcon />, 
            path: '/payments' 
        },
        { 
            text: 'Feedbacks', 
            icon: <FeedbackIcon />, 
            path: '/feedbacks' 
        },
        { 
            text: 'MessPlans', 
            icon: <MealsIcon />, 
            path: '/mess-plans' 
        },
        { 
            text: 'Logout', 
            icon: <LogoutIcon />, 
            onClick: logout 
        }
    ];

    return (
        <Drawer variant="permanent">
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        key={item.text}
                        button 
                        component={item.path ? Link : 'div'}
                        to={item.path}
                        onClick={item.onClick}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;