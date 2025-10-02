import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';

// Material-UI imports
import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    useMediaQuery,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// SignalR
import { HubConnectionBuilder } from '@microsoft/signalr';
import { toast } from 'react-toastify';

// Project Imports
import Header from './BerryAdminLayout/Header';
import Sidebar from './BerryAdminLayout/Sidebar';
import NotificationSection from './BerryAdminLayout/Header/NotificationSection';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MailIcon from '@mui/icons-material/Mail';

// Styled component for the main content area
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${260}px`,
    marginTop: '88px',
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: 0,
        marginTop: '64px',
    }
}));

const AdminLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State cho giao diện
    const [drawerOpen, setDrawerOpen] = useState(true);
    
    // State và logic cho Notifications
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (user) {
            setLoadingNotifications(true);
            try {
                const response = await api.get('/notifications');
                setNotifications(response.data);
            } catch (error) { console.error("Failed to fetch notifications:", error); }
            finally { setLoadingNotifications(false); }
        }
    }, [user]);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    useEffect(() => {
        if (!user) return;
        const hubUrl = process.env.REACT_APP_API_URL.replace("/api", "/notificationHub");
        const connection = new HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();

        connection.on("ReceiveNewOrderNotification", (message, newNotification) => {
            toast.info(`🚀 ${message}`);
            if (newNotification) {
                setNotifications(prev => [newNotification, ...prev]);
            }
        });

        const startConnection = async () => {
            try {
                await connection.start();
                console.log('SignalR Connected in AdminLayout!');
                await connection.invoke("JoinGroup", "Admins");
            } catch (err) { console.error('SignalR Connection Error: ', err); }
        };
        startConnection();
        return () => { connection.stop(); };
    }, [user]);

    const handleMarkAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
        if (unreadIds.length === 0) return;
        try {
            await api.post('/notifications/mark-as-read', unreadIds);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) { toast.error("Failed to mark notifications as read."); }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await api.post('/notifications/mark-as-read', [notification.id]);
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
            } catch (error) { console.error("Failed to mark single notification as read"); }
        }
        if (notification.entityType === 'Order' && notification.relatedEntityId) {
            navigate(`/admin/orders/${notification.relatedEntityId}`);
        }
    };
    
    const handleLeftDrawerToggle = () => { setDrawerOpen(!drawerOpen); };
    const handleLogout = () => { logout(); navigate('/login'); };

    useEffect(() => {
        setDrawerOpen(!matchDownMd);
    }, [matchDownMd]);

    const menuItems = [
        { key: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { key: 'categories', text: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
        { key: 'products', text: 'Products', icon: <ShoppingCartIcon />, path: '/admin/products' },
        { key: 'users', text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { key: 'orders', text: 'Orders', icon: <AssignmentIcon />, path: '/admin/orders' },
        { key: 'marketing', text: 'Marketing', icon: <MailIcon />, path: '/admin/marketing' },
    ];

    const drawerContent = (
        <div>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.key} disablePadding component={RouterLink} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }} onClick={matchDownMd ? handleLeftDrawerToggle : undefined}>
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
            
            <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: theme.palette.background.default, transition: drawerOpen ? theme.transitions.create('width') : 'none' }}>
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <NotificationSection 
                        notifications={notifications}
                        onMarkAsRead={handleMarkAllAsRead}
                        onNotificationClick={handleNotificationClick}
                        isLoading={loadingNotifications}
                    />
                    
                    {/* Component ProfileSection của Berry sẽ được tích hợp ở đây sau, tạm dùng nút Logout */}
                    <IconButton color="inherit" onClick={handleLogout} title='Logout'>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sử dụng Sidebar component đã được làm sạch */}
            <Sidebar drawerOpen={drawerOpen} drawerToggle={handleLeftDrawerToggle} />

            <Main open={drawerOpen}>
                <Outlet />
            </Main>
        </Box>
    );
};

export default AdminLayout;