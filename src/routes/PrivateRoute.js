import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, roles }) => { // roles bây giờ là tùy chọn
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    }

    // --- LOGIC MỚI ---

    // 1. Nếu chưa đăng nhập, luôn luôn chuyển về trang Login
    if (!user) {
        // Lưu lại trang người dùng đang cố truy cập để có thể quay lại sau khi đăng nhập
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Nếu đã đăng nhập, và route này có yêu cầu quyền cụ thể
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        // Kiểm tra xem quyền của user có trong danh sách yêu cầu không
        // Nếu không, chuyển hướng đến trang Unauthorized
        return <Navigate to="/unauthorized" replace />;
    }
    
    // 3. Nếu đã đăng nhập và không có yêu cầu quyền cụ thể, hoặc có quyền hợp lệ -> cho phép truy cập
    return children;
};

export default PrivateRoute;