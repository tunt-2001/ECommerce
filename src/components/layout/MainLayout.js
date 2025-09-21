import React, { useContext } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext); // Lấy user
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                        E-Commerce Store
                    </Typography>
                    
                    {/* === THÊM ĐIỀU KIỆN Ở ĐÂY === */}
                    {/* Chỉ hiển thị Icon Giỏ hàng và Nút My Orders/Logout nếu người dùng đã đăng nhập */}
                    {user ? (
                        <>
                            <IconButton component={RouterLink} to="/cart" size="large" aria-label="show cart items" color="inherit">
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                            <Button color="inherit" component={RouterLink} to="/my-orders">My Orders</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        // Nếu chưa đăng nhập, chỉ hiển thị nút Login
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