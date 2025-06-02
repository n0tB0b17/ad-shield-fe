import React from 'react';
import { useSelector } from 'react-redux';
import {
    ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingClientAnimation from '../../../components/loading/loading';
import ErrorAnimation from '../../../components/loading/error';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles'; // To use theme colors
import NotFoundAnimation from '../../../components/loading/notFound';

// Helper function for consistent chart styling
const ChartWrapper = ({ title, children }) => (
    <Card sx={{ height: '100%' }}>
        <CardHeader title={title} titleTypographyProps={{ variant: 'h6', align: 'center' }} />
        <CardContent sx={{ height: 'calc(100% - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Adjust height if needed */}
            {children}
        </CardContent>
    </Card>
);


const ClientPortScanStats = () => {


    const theme = useTheme();
    const { portScanStats, portScanStatsStatus, portScanStatsError } = useSelector((state) => state.clients);
    // Define consistent colors
    const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main];
    const PIE_COLORS = {
        success: theme.palette.success.light,
        failed: theme.palette.error.light,
    };


    if (portScanStatsStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <LoadingClientAnimation message='Loading stats...' />
        </Box>;
    }

    if (portScanStatsStatus === 'failed') {
        return <ErrorAnimation message={portScanStatsError || 'Failed to load port scan statistics.'} />
    }

    if (!portScanStats || portScanStatsStatus !== 'succeeded') {
        return <NotFoundAnimation message='No statistics available.' />
    }



    // Prepare data for charts
    const scanStatusData = portScanStats.scan_status_breakdown?.map(item => ({ name: item.status, value: item.count })) || [];
    const scansByDayData = portScanStats.scans_by_day?.map(item => ({ name: item.day.substring(0, 3), scans: item.count })) || [];
    const scansByHourData = [...(portScanStats.scans_by_hour || [])].sort((a, b) => a.hour - b.hour).map(item => ({ name: `${item.hour}:00`, scans: item.count }));
    const commonPortsData = portScanStats.most_common_open_ports?.slice(0, 5).map(item => ({ name: `${item.port} (${item.service || 'unknown'})`, count: item.count })) || []; // Top 5
    const commonAddressesData = portScanStats.most_scanned_addresses?.slice(0, 5).map(item => ({ name: item.address, count: item.count })) || []; // Top 5

    // Basic Stats Cards Data
    const basicStats = [
        { label: "Total Scans", value: portScanStats.total_scans },
        { label: "Avg Duration (s)", value: (portScanStats.average_scan_duration / 1e9).toFixed(2) }, // Convert ns to s
    ];

    return (
        <Box sx={{ my: 3 }}> {/* Margin top/bottom */}
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Port Scan Statistics Overview
            </Typography>

            {/* Basic Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                {basicStats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                        <Card sx={{ textAlign: 'center', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary">{stat.value ?? 'N/A'}</Typography>
                                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Grid */}
            <Grid container spacing={1}>
                {/* Most Common Open Ports */}
                {commonPortsData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 2 }} lg={8}>
                        <ChartWrapper title="Top 5 Open Ports">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={commonPortsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <RechartsTooltip />
                                    <Bar dataKey="count" fill={theme.palette.primary.light} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </Grid>
                )}

                {/* Scans by Hour */}
                {scansByHourData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <ChartWrapper title="Scans by Hour of Day">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={scansByHourData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <RechartsTooltip />
                                    <Line type="monotone" dataKey="scans" stroke={theme.palette.secondary.main} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </Grid>
                )}

                {/* Scans by Day */}
                {scansByDayData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 3 }}lg={6}>
                        <ChartWrapper title="Scans by Day of Week">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={scansByDayData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <RechartsTooltip />
                                    <Bar dataKey="scans" fill={theme.palette.success.light} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </Grid>
                )}

                {/* Most Scanned Addresses */}
                {commonAddressesData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 3 }} lg={6}> {/* Adjust grid size as needed */}
                        <ChartWrapper title="Top 5 Scanned Addresses">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={commonAddressesData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}> {/* Increased left margin */}
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" width={100} /> {/* Adjust width if needed */}
                                    <RechartsTooltip />
                                    <Bar dataKey="count" fill={theme.palette.info.light} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </Grid>
                )}

            </Grid>
        </Box>
    );
};

export default ClientPortScanStats;