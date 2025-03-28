import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Mess Management System
                </Typography>
                {user && (
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;