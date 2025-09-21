import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <Container>
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    403 - Access Denied
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You do not have permission to view this page.
                </Typography>
                <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
                    Go to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default UnauthorizedPage;