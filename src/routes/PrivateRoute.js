import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu route yêu cầu quyền cụ thể, kiểm tra xem user có quyền đó không
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Hoặc một trang "Không có quyền"
    }
    
    return children;
};

export default PrivateRoute;