import { useEffect, useState, useCallback } from 'react';
import { Grid, Typography } from '@mui/material';
import api from '../../../../api/axiosConfig'; // Đảm bảo đường dẫn đúng
import { toast } from 'react-toastify';

// Import các component con từ thư mục BerryDashboard
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
// Import các component Skeleton
import SkeletonEarningCard from '../../../../ui-component/cards/Skeleton/EarningCard';

const BerryDashboard = () => {
    const [isLoading, setLoading] = useState(true);
    // State để lưu dữ liệu thống kê
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState(null);
    
    // Hàm gọi API, tương tự như trước
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, chartRes] = await Promise.all([
                api.get(`/admin/dashboard/stats`, { params: { period: 'month' } }), // Lấy data cho cả tháng
                api.get(`/admin/dashboard/revenue-chart`, { params: { period: 'month' } })
            ]);
            
            setStats(statsRes.data);

            const labels = chartRes.data.map(d => new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit' }));
            const dataValues = chartRes.data.map(d => d.revenue);
            
            setChartData({ labels, dataValues });

        } catch (error) {
            toast.error("Failed to fetch dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

     return (
        <Grid container spacing={3}>
            {/* Hàng 1 */}
            <Grid container item xs={12} spacing={3}> {/* Thêm 1 Grid container bọc ngoài */}
                <Grid item lg={4} md={6} sm={6} xs={12}>
                    <EarningCard isLoading={loading} value={stats?.totalRevenue} />
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                    <TotalOrderLineChartCard isLoading={loading} value={stats?.totalOrders} />
                </Grid>
                <Grid item lg={4} md={12} sm={12} xs={12}>
                    <Grid container spacing={3}>
                        <Grid item sm={6} xs={12} md={6} lg={12}>
                            {/* Các Card phụ có thể tạm comment nếu chúng gây lỗi */}
                            {/* <TotalIncomeDarkCard isLoading={loading} /> */}
                        </Grid>
                        <Grid item sm={6} xs={12} md={6} lg={12}>
                           {/* <TotalIncomeLightCard isLoading={loading} /> */}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* Hàng 2 */}
            <Grid container item xs={12} spacing={3}> {/* Thêm 1 Grid container bọc ngoài */}
                <Grid item xs={12} md={8}>
                    <TotalGrowthBarChart isLoading={loading} chartData={chartData} />
                </Grid>
                <Grid item xs={12} md={4}>
                    {/* <PopularCard isLoading={loading} /> */}
                </Grid>
            </Grid>
        </Grid>
    );
};
export default BerryDashboard;