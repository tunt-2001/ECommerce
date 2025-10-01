import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// Material-UI imports
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// Import các component layout bạn đã copy từ Berry
// Hãy đảm bảo đường dẫn này là chính xác
import Header from './BerryAdminLayout/Header';
import Sidebar from './BerryAdminLayout/Sidebar';

// Đây là component Main, chịu trách nhiệm cho phần nội dung chính
// Bạn có thể copy style này từ file /layout/MainLayout/index.js của Berry
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${260}px`, // drawerWidth của Berry là 260
    marginTop: '88px',
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AdminLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    
    // State để quản lý việc đóng/mở sidebar
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleLeftDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Tự động đóng sidebar trên màn hình nhỏ
    React.useEffect(() => {
        setDrawerOpen(!matchDownMd);
    }, [matchDownMd]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            {/* Header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: drawerOpen ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Sidebar drawerOpen={drawerOpen} drawerToggle={handleLeftDrawerToggle} />

            {/* Main content */}
            <Main open={drawerOpen}>
                {/* <Breadcrumbs navigation={navigation} title titleBottom /> */}
                <Outlet />
            </Main>
        </Box>
    );
};

export default AdminLayout;