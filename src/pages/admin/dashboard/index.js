import { useEffect, useState, useCallback } from 'react';
import { Grid } from '@mui/material';
import api from '../../../api/axiosConfig';
import { toast } from 'react-toastify';
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';

const BerryDashboard = () => {
    // State quản lý loading và dữ liệu
    const [isLoading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [period, setPeriod] = useState('last7days'); 

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, chartRes] = await Promise.all([
                api.get(`/admin/dashboard/stats`, { params: { period } }),
                api.get(`/admin/dashboard/revenue-chart`, { params: { period } })
            ]);
            
            setStats(statsRes.data);

            // Chuẩn bị dữ liệu cho biểu đồ
            const labels = chartRes.data.map(d => new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
            const dataValues = chartRes.data.map(d => d.revenue);
            setChartData({ labels, dataValues });

        } catch (error) {
            toast.error("Failed to fetch dashboard data.");
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <Grid container spacing={3}>
            {/* Hàng 1 */}
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        {/* Truyền isLoading và dữ liệu thật xuống component con */}
                        <EarningCard isLoading={isLoading} value={stats?.totalRevenue} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} value={stats?.totalOrders} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                    </Grid>
                </Grid>
            </Grid>
            {/* Hàng 2 */}
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {/* Truyền isLoading và dữ liệu thật xuống component biểu đồ */}
                        <TotalGrowthBarChart isLoading={isLoading} chartData={chartData} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/* <PopularCard isLoading={isLoading} /> */}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BerryDashboard;