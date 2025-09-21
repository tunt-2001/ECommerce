import React, { useContext } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                        E-Commerce Store
                    </Typography>
                    {user ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/my-orders">My Orders</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                    )}
                </Toolbar>
            </AppBar>
            <main>
                <Outlet />
            </main>
        </Box>
    );
};

export default MainLayout;