import React from 'react';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';

const DashboardPage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Ví dụ về một vài thẻ thống kê */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Total Revenue
                        </Typography>
                        <Typography component="p" variant="h4">
                            $3,024.00
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            on 24 Sep, 2025
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            New Orders
                        </Typography>
                        <Typography component="p" variant="h4">
                            15
                        </Typography>
                        <Typography color="text.secondary" sx={{ flex: 1 }}>
                            since last week
                        </Typography>
                    </Paper>
                </Grid>
                 {/* Bạn có thể thêm các thẻ khác ở đây */}
            </Grid>
        </Container>
    );
};

export default DashboardPage;