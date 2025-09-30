import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { Link, useLocation, Outlet } from 'react-router-dom';

const MarketingPageLayout = () => {
    const location = useLocation();

    const currentTab = location.pathname.includes('history') 
        ? '/admin/marketing/history' 
        : '/admin/marketing/compose';

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab}>
                    <Tab label="Compose Newsletter" value="/admin/marketing/compose" to="/admin/marketing/compose" component={Link} />
                    <Tab label="History" value="/admin/marketing/history" to="/admin/marketing/history" component={Link} />
                </Tabs>
            </Box>
            <Box sx={{ pt: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};
export default MarketingPageLayout;