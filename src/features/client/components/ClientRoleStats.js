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
import LoadingAnimation from '../../../components/loading/loading'
import ErrorAnimation from '../../../components/loading/error'
import NotFound from '../../../components/loading/notFound'
import { formatDateTime } from '../../../utils/formatting';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884d8', '#82ca9d', '#ffc658'];


const ClientRoleStats = () => {
    const { roleStats, roleStatsStatus, roleStatsError } = useSelector((state) => state.clients);

    if (roleStatsStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingAnimation message='loading roles stats' />
        </Box>;
    }

    if (roleStatsStatus === 'failed') {
        return <ErrorAnimation message={roleStatsError || 'Failed to load Role statistics.'} />
    }

    if (!roleStats || roleStatsStatus !== 'succeeded') {
        return <NotFound message='roles stats not found' />;
    }

    // Prepare data for charts
    const commonPermissionsData = roleStats.permission_usage?.most_common_permissions?.map(item => ({
        name: item.permission,
        value: item.count,
    })) || [];

    const rolesByCreationMonthData = roleStats.roles_by_creation_month?.map(item => ({
        name: item.month, // Assumes format like "YYYY-MM"
        RolesCreated: item.count,
    })) || [];

    const newestRole = roleStats.newest_role;
    const oldestRole = roleStats.oldest_role;
    const permissionUsage = roleStats.permission_usage;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>Role Statistics Overview</Typography>
            <Grid container spacing={3}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Roles</Typography>
                            <Typography variant="h4">{roleStats.total_roles ?? 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader title="Newest Role" titleTypographyProps={{ variant: 'subtitle2', align: 'center' }} sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 0, textAlign: 'center' }}>
                            {newestRole ? (
                                <>
                                    <Typography variant="body1" title={newestRole.description}>{newestRole.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Created: {formatDateTime(newestRole.created_at)}</Typography>
                                </>
                            ) : <Typography variant="body2">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader title="Oldest Role" titleTypographyProps={{ variant: 'subtitle2', align: 'center' }} sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 0, textAlign: 'center' }}>
                            {oldestRole ? (
                                <>
                                    <Typography variant="body1" title={oldestRole.description}>{oldestRole.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Created: {formatDateTime(oldestRole.created_at)}</Typography>
                                </>
                            ) : <Typography variant="body2">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                        <CardHeader title="Permission Usage" titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
                        <CardContent sx={{ pt: 1 }}>
                            {permissionUsage ? (
                                <>
                                    <Typography variant="body2">Avg per Role: {permissionUsage.avg_permissions_per_role ?? 'N/A'}</Typography>
                                    <Typography variant="body2">Max in Role: {permissionUsage.max_permissions_in_role ?? 'N/A'}</Typography>
                                </>
                            ) : <Typography variant="body2">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>


                {/* Common Permissions Chart */}
                {commonPermissionsData.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Most Common Permissions</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    {/* Using Bar chart might be better if many permissions */}
                                    <BarChart data={commonPermissionsData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="value" name="Usage Count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Roles by Creation Month Chart */}
                {rolesByCreationMonthData.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Roles Created by Month</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={rolesByCreationMonthData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="RolesCreated" fill="#00C49F" />
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

export default ClientRoleStats;