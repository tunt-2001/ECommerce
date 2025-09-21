import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Box, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/orders/${id}`);
            setOrder(response.data);
        } catch (error) {
            toast.error("Could not fetch order details.");
            console.error("Fetch order detail error:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!order) {
        return <Typography variant="h5" align="center" sx={{ mt: 4 }}>Order not found.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Order #{order.id}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Order Details</Typography>
                        <Typography><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</Typography>
                        <Typography><strong>Status:</strong> {order.status}</Typography>
                        <Typography><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Shipping Address</Typography>
                        <Typography>{order.shippingAddress}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>Items</Typography>
                <List disablePadding>
                    {order.items.map((item) => (
                        <ListItem key={item.productId} disableGutters divider>
                            <ListItemText 
                                primary={item.productName}
                                secondary={`Quantity: ${item.quantity}`}
                            />
                            <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default OrderDetailPage;