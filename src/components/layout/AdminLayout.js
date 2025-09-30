import React, { useState, useEffect, useContext } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, IconButton, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr'; // Import SignalR
import { toast } from 'react-toastify'; // Import Toast

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';

// Context
import { AuthContext } from '../../contexts/AuthContext';

const drawerWidth = 240;

const AdminLayout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // --- LOGIC KẾT NỐI SIGNALR ---
    useEffect(() => {
        // Xây dựng URL của Hub từ biến môi trường.
        // REACT_APP_API_URL là 'https://localhost:44399/api'
        // Chúng ta cần 'https://localhost:44399/notificationHub'
        const hubUrl = process.env.REACT_APP_API_URL.replace("/api", "/notificationHub");

        // Tạo một đối tượng connection
        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect() // Tự động kết nối lại nếu bị mất kết nối
            .build();
        
        // Định nghĩa hàm sẽ được gọi khi server gửi message 'ReceiveNewOrderNotification'
        connection.on("ReceiveNewOrderNotification", (message) => {
            // Hiển thị thông báo bằng react-toastify
            toast.info(`🚀 ${message}`, {
                position: "top-right",
                autoClose: 10000, // 10 giây
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });

        // Bắt đầu kết nối đến Hub
        const startConnection = async () => {
            try {
                await connection.start();
                console.log('SignalR Connected!');
                // Sau khi kết nối thành công, gửi yêu cầu tham gia vào group "Admins"
                await connection.invoke("JoinGroup", "Admins");
                console.log('Joined "Admins" group.');
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
                // Thử kết nối lại sau 5 giây nếu thất bại
                setTimeout(startConnection, 5000);
            }
        };

        startConnection();

        // Dọn dẹp: Đóng kết nối khi component bị unmount (rời khỏi trang)
        return () => {
            connection.stop();
        };
    }, []); // Mảng rỗng đảm bảo useEffect này chỉ chạy một lần duy nhất

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
        { text: 'Products', icon: <ShoppingCartIcon />, path: '/admin/products' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Orders', icon: <AssignmentIcon />, path: '/admin/orders' },
        { text: 'Marketing', icon: <MailIcon />, path: '/admin/marketing' },
    ];

    const drawerContent = (
        <div>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding component={RouterLink} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }} onClick={isMobile ? handleDrawerToggle : undefined}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>Admin Panel</Typography>
                    <IconButton color="inherit" onClick={handleLogout} title="Logout"><LogoutIcon /></IconButton>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}} open>
                    {drawerContent}
                </Drawer>
            </Box>
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminLayout;