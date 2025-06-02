import React from 'react';
import { useSelector } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from 'recharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import LoadingAnimation from '../../../components/loading/loading'
import ErrorAnimation from '../../../components/loading/error'
import NotFound from '../../../components/loading/notFound'
import { formatDateTime } from '../../../utils/formatting'; // Adjust path

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
            {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


const ClientUserStats = () => {
    const { userStats, userStatsStatus, userStatsError } = useSelector((state) => state.clients);
    if (userStatsStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingAnimation message='loading users stats ' />
        </Box>;
    }

    if (!userStats || userStatsStatus !== 'succeeded') {
        return <NotFound message='No User statistics available.' />
    }

    if (userStatsStatus === 'failed') {
        return <ErrorAnimation message={userStatsError || 'Failed to load User statistics.'} />
    }



    // Prepare data for charts
    const emailDomainData = userStats.email_domains?.map(item => ({
        name: item.domain || 'Unknown',
        value: item.count,
    })) || [];

    const signupsByHourData = userStats.signups_by_hour?.map(item => ({
        name: `${item.hour}:00`,
        Signups: item.count,
    })) || [];

    // Note: Role distribution only has role_id. We can display that or fetch role names separately.
    const roleDistributionData = userStats.role_distribution?.map(item => ({
        name: item.role_id || 'Unknown Role ID', // Display ID for now
        value: item.count,
    })) || [];

    const newestUser = userStats.newest_user;
    const oldestUser = userStats.oldest_user;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>User Statistics Overview</Typography>
            <Grid container spacing={3}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Users</Typography>
                            <Typography variant="h4">{userStats.total_users ?? 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader title="Newest User" titleTypographyProps={{ variant: 'subtitle2', align: 'center' }} sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 0, textAlign: 'center' }}>
                            {newestUser ? (
                                <>
                                    <Typography variant="body1" title={newestUser.email}>{newestUser.user_name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Joined: {formatDateTime(newestUser.created_at)}</Typography>
                                </>
                            ) : <Typography variant="body2">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader title="Oldest User" titleTypographyProps={{ variant: 'subtitle2', align: 'center' }} sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 0, textAlign: 'center' }}>
                            {oldestUser ? (
                                <>
                                    <Typography variant="body1" title={oldestUser.email}>{oldestUser.user_name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Joined: {formatDateTime(oldestUser.created_at)}</Typography>
                                </>
                            ) : <Typography variant="body2">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                {/* Add more key stats cards if needed */}

                {/* Email Domain Chart */}
                {emailDomainData.length > 0 && (
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Email Domains</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={emailDomainData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            // label={renderCustomizedLabel} // Use custom label if needed
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                        >
                                            {emailDomainData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Role Distribution Chart */}
                {roleDistributionData.length > 0 && (
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Role Distribution (by ID)</Typography>
                                <Typography variant="caption" color="text.secondary">Note: Role names require separate lookup.</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={roleDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${value}`} // Show count on label
                                            outerRadius={80}
                                            fill="#82ca9d"
                                            dataKey="value"
                                            nameKey="name" // Will show Role ID
                                        >
                                            {roleDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value, name) => [`Count: ${value}`, `Role ID: ${name}`]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Signups by Hour Chart */}
                {signupsByHourData.length > 0 && (
                    <Grid item xs={12} lg={8}> {/* Allow more width */}
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Signups by Hour (UTC)</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={signupsByHourData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="Signups" fill="#ffc658" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

            </Grid>
        </Box>
    );
};

export default ClientUserStats;