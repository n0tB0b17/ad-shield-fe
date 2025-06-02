import React from 'react';
import { useSelector } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
    PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from 'recharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { formatDateTime } from '../../../utils/formatting'; // Adjust path
import NotFoundAnimation from '../../../components/loading/notFound';
import LoadingClientAnimation from '../../../components/loading/loading';
import ErrorAnimation from '../../../components/loading/error';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ClientUserDetail = ({ user, onBackToList }) => {
    const { selectedUserStats, selectedUserStatsStatus, selectedUserStatsError } = useSelector((state) => state.clients);

    if (!user) {
        return (
            <Box sx={{ mt: 2 }}>
                <NotFoundAnimation message='User information not available.' />
            </Box>
        );
    }

    // Prepare data for charts *after* loading check
    let actionDistributionData = [];
    let activityTimelineData = [];
    let hourlyDistributionData = [];
    let ipDistributionData = [];

    if (selectedUserStatsStatus === 'succeeded' && selectedUserStats) {
        actionDistributionData = selectedUserStats.action_distribution?.map(item => ({
            name: item.key,
            value: item.count,
        })) || [];

        activityTimelineData = selectedUserStats.activity_timeline?.map(item => ({
            name: item.date, // Assuming date is a string like "YYYY-MM-DD"
            Activities: item.count,
        })) || [];

        hourlyDistributionData = selectedUserStats.hourly_distribution?.map(item => ({
            name: `${item.hour}:00`,
            Activities: item.count
        })) || [];

        ipDistributionData = selectedUserStats.ip_address_distribution?.map(item => ({
            name: item.ip_address,
            value: item.count
        })) || [];
    }

    const dayMap = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' };


    return (
        <Box sx={{ mt: 2 }}>
            <Card sx={{ mb: 3 }}>
                <CardHeader
                    title={`Activity Details for ${user.userName}`}
                    subheader={`Email: ${user.email} | Role ID: ${user.roleId}`}
                />
                <CardContent>
                    {/* Could add more basic user details here */}
                </CardContent>
            </Card>

            {/* Loading/Error for Stats */}
            {selectedUserStatsStatus === 'loading' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <LoadingClientAnimation message='loading user stats' />
                </Box>
            )}
            {selectedUserStatsStatus === 'failed' && (
                <ErrorAnimation message={selectedUserStatsError || 'Failed to load user activity stats.'} />
            )}

            {/* Stats Content */}
            {selectedUserStatsStatus === 'succeeded' && selectedUserStats && (
                <Grid container spacing={3}>
                    {/* Key Metrics */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: 'center' }}> <CardContent> <Typography color="text.secondary" gutterBottom>Total Actions</Typography> <Typography variant="h5">{selectedUserStats.total_activity_count ?? 0}</Typography> </CardContent> </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: 'center' }}> <CardContent> <Typography color="text.secondary" gutterBottom>Unique Actions</Typography> <Typography variant="h5">{selectedUserStats.unique_action_count ?? 0}</Typography> </CardContent> </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: 'center' }}> <CardContent> <Typography color="text.secondary" gutterBottom>First Activity</Typography> <Typography variant="body2">{formatDateTime(selectedUserStats.first_activity_timestamp)}</Typography> </CardContent> </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: 'center' }}> <CardContent> <Typography color="text.secondary" gutterBottom>Last Activity</Typography> <Typography variant="body2">{formatDateTime(selectedUserStats.last_activity_timestamp)}</Typography> </CardContent> </Card>
                    </Grid>

                    {/* Action Distribution Chart */}
                    {actionDistributionData.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>Action Distribution</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={actionDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                                {actionDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Hourly Distribution Chart */}
                    {hourlyDistributionData.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>Activity by Hour (UTC)</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={hourlyDistributionData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <RechartsTooltip />
                                            <Bar dataKey="Activities" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Activity Timeline Chart */}
                    {activityTimelineData.length > 0 && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>Activity Timeline</Typography>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={activityTimelineData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <RechartsTooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="Activities" stroke="#0088FE" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* IP Address List */}
                    {selectedUserStats.unique_ip_addresses && selectedUserStats.unique_ip_addresses.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader title={`Unique Source IPs (${selectedUserStats.unique_ip_address_count})`} />
                                <CardContent sx={{ maxHeight: 250, overflow: 'auto' }}>
                                    <List dense>
                                        {selectedUserStats.unique_ip_addresses.map((ip, index) => (
                                            <ListItem key={index} disablePadding>
                                                <Chip label={ip} size="small" />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* User Agent List */}
                    {selectedUserStats.unique_user_agents && selectedUserStats.unique_user_agents.length > 0 && (
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardHeader title={`Unique User Agents (${selectedUserStats.unique_user_agent_count})`} />
                                <CardContent sx={{ maxHeight: 250, overflow: 'auto' }}>
                                    <List dense>
                                        {selectedUserStats.unique_user_agents.map((ua, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemText primary={ua} primaryTypographyProps={{ variant: 'caption' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                </Grid>
            )}
        </Box>
    );
};

export default ClientUserDetail;