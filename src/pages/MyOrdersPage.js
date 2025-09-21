import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Box, CircularProgress, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
        } catch (error) {
            toast.error("Could not fetch your orders.");
            console.error("Fetch orders error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const getStatusChipColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'success';
            case 'shipped':
                return 'info';
            case 'processing':
                return 'warning';
            case 'canceled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">You haven't placed any orders yet.</Typography>
                    <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip label={order.status} color={getStatusChipColor(order.status)} size="small" />
                                    </TableCell>
                                    <TableCell>{order.itemCount}</TableCell>
                                    <TableCell align="right">
                                        <Button component={RouterLink} to={`/orders/${order.id}`}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default MyOrdersPage;