import React, { useContext } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, IconButton } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../contexts/AuthContext';

const drawerWidth = 240;

const AdminLayout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
        { text: 'Products', icon: <ShoppingCartIcon />, path: '/admin/products' }, // Sẽ tạo sau
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' }, // Sẽ tạo sau
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* THANH APPBAR Ở TRÊN */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        ADMIN ECOMMERCE
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout} title="Logout">
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* THANH SIDEBAR BÊN CẠNH */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding component={RouterLink} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* PHẦN NỘI DUNG CHÍNH CỦA TRANG */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet /> {/* Đây là nơi nội dung của các trang con (Dashboard, Category...) sẽ được render */}
            </Box>
        </Box>
    );
};

export default AdminLayout;