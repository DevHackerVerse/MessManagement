import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { 
    Logout as LogoutIcon, 
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    // Function to get initials from name
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppBar 
            position="static" 
            elevation={4}
            sx={{
                background: 'linear-gradient(90deg, rgba(21,101,192,1) 0%, rgba(30,136,229,1) 100%)',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/food.png"), linear-gradient(90deg, rgba(21,101,192,1) 0%, rgba(30,136,229,1) 100%)',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                {isMobile && (
                    <IconButton 
                        size="large" 
                        edge="start" 
                        color="inherit" 
                        aria-label="menu"
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                
                <RestaurantIcon sx={{ mr: 1.5, fontSize: 28 }} />
                
                <Typography 
                    variant="h6" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    Mess Management System
                </Typography>

                {!isMobile && (
                    <Box sx={{ mx: 2 }}>
                        <Button 
                            color="inherit" 
                            startIcon={<DashboardIcon />}
                            sx={{ 
                                mx: 1, 
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Dashboard
                        </Button>
                        <Button 
                            color="inherit"
                            startIcon={<RestaurantIcon />}
                            sx={{ 
                                mx: 1, 
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Mess Plans
                        </Button>
                    </Box>
                )}

                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!isMobile && (
                            <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }}>
                                Welcome, {user.name || 'User'}
                            </Typography>
                        )}
                        
                        <IconButton
                            onClick={handleMenu}
                            size="small"
                            sx={{ 
                                ml: 1,
                                border: '2px solid',
                                borderColor: 'rgba(255,255,255,0.5)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            <Avatar 
                                sx={{ 
                                    width: 32, 
                                    height: 32,
                                    bgcolor: 'secondary.main',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {getInitials(user?.name)}
                            </Avatar>
                        </IconButton>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 1,
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {user?.name || 'User'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {user?.email || 'user@example.com'}
                                </Typography>
                            </Box>
                            
                            <Divider />
                            
                            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                                <ListItemIcon>
                                    <AccountCircleIcon fontSize="small" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            
                            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            
                            <Divider />
                            
                            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                <Typography color="error">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;