import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Box, Grid, Select, MenuItem, FormControl } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../../api/axiosConfig';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, newCustomers: 0 });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [period, setPeriod] = useState('last7days');

    const fetchDashboardData = useCallback(async () => {
        try {
            // Gọi song song 2 API để tăng tốc độ
            const [statsRes, chartRes] = await Promise.all([
                api.get(`/admin/dashboard/stats?period=${period}`),
                api.get(`/admin/dashboard/revenue-chart?period=${period}`)
            ]);
            
            setStats(statsRes.data);

            // Chuẩn bị dữ liệu cho biểu đồ
            const labels = chartRes.data.map(d => new Date(d.date).toLocaleDateString('en-GB'));
            const data = chartRes.data.map(d => d.revenue);
            
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Daily Revenue',
                        data: data,
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            });

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    }, [period]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Revenue Overview' },
        },
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">Dashboard</Typography>
                <FormControl size="small">
                    <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="last7days">Last 7 Days</MenuItem>
                        <MenuItem value="week">This Week</MenuItem>
                        <MenuItem value="month">This Month</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid container spacing={3}>
                {/* Các thẻ thống kê */}
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">Total Revenue</Typography>
                        <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                         <Typography color="text.secondary">Total Orders</Typography>
                        <Typography variant="h4">{stats.totalOrders}</Typography>
                    </Paper>
                </Grid>
                 <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">New Customers</Typography>
                        <Typography variant="h4">{stats.newCustomers}</Typography>
                    </Paper>
                </Grid>
                {/* Biểu đồ */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Bar options={chartOptions} data={chartData} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;