import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const AdminOrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const orderStatuses = ["PendingPayment", "Processing", "Shipped", "Delivered", "Canceled"];

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data);
        } catch (error) {
            toast.error("Could not fetch orders.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { newStatus });
            // Cập nhật lại state ở frontend để giao diện thay đổi ngay lập tức
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            toast.success(`Order #${orderId} status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update order status.");
        }
    };

    const getStatusChipColor = (status) => {
        // ... (hàm getStatusChipColor như trong MyOrdersPage.js)
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Order Management
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <FormControl size="small">
                                        <Select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {orderStatuses.map(status => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminOrderListPage;