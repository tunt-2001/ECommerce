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
        // --- SỬA LOGIC ĐIỀU HƯỚNG TẠI ĐÂY ---
        if (user.role === 'Admin') {
            // Nếu là Admin, chuyển hướng đến trang dashboard của admin
            return <Navigate to="/admin/dashboard" replace />;
        }
        // Nếu là User, hiển thị trang chủ
        return <HomePage />;
    }
    
    // Nếu chưa đăng nhập, hiển thị trang chủ
    return <HomePage />;
};

export default LandingPage;