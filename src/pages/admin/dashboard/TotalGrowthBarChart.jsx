import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import SkeletonTotalGrowthBarChart from '../../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';

const TotalGrowthBarChart = ({ isLoading, chartData }) => {
    const theme = useTheme();
    const [options, setOptions] = useState({});
    const primary = theme.palette.text.primary || '#212121';
    const primaryLight = theme.palette.primary.light || '#e3f2fd';
    const darkLight = theme.palette.dark?.light || '#e0e0e0';
    const grey200 = theme.palette.grey[200] || '#eeeeee';
    const grey500 = theme.palette.grey[500] || '#9e9e9e';
    const primaryDark = theme.palette.primary.dark || '#1976d2';
    const secondaryMain = theme.palette.secondary.main || '#9c27b0';
    const secondaryLight = theme.palette.secondary.light || '#e1bee7';
    const navType = 'light'; 

    useEffect(() => {
        const newOptions = {
            chart: {
                height: 480,
                type: 'bar',
                toolbar: { show: false }
            },
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    borderRadius: 4
                }
            },
            dataLabels: { enabled: false },
            xaxis: {
                categories: chartData?.labels ?? [],
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                show: true,
                labels: {
                    formatter: (value) => `$${value}`
                }
            },
            grid: {
                show: true,
                borderColor: navType === 'dark' ? darkLight : grey200,
            },
            colors: [primaryDark, secondaryMain, secondaryLight] 
        };

        setOptions(newOptions);

    }, [chartData, navType, primary, darkLight, grey200, primaryDark, secondaryMain, secondaryLight]);

    const series = [{
        name: 'Revenue',
        data: chartData?.dataValues ?? []
    }];

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="h5">Total Growth</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {options.chart && <Chart options={options} series={series} type="bar" height={480} />}
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool,
    chartData: PropTypes.object
};

export default TotalGrowthBarChart;