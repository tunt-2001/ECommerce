import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import HomePage from './HomePage';

const LandingPage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (user) {
        if (user.role === 'Admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <HomePage />;
    }
    
    return <HomePage />;
};

export default LandingPage;