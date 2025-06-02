import React from 'react';
import { useSelector } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from 'recharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { formatDateTime } from '../../../utils/formatting';
import ErrorAnimation from '../../../components/loading/error';
import NotFoundAnimation from '../../../components/loading/notFound';
import LoadingClientAnimation from '../../../components/loading/loading';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ClientIpLookupStats = () => {
    const { ipLookupStats, ipLookupStatsStatus, ipLookupStatsError } = useSelector((state) => state.clients);

    if (ipLookupStatsStatus === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <LoadingClientAnimation message='Loading stats...' />
            </Box>);
    }

    if (ipLookupStatsStatus === 'failed') {
        return <ErrorAnimation message={ipLookupStatsError || 'Failed to load IP Lookup statistics.'} />
    }

    if (!ipLookupStats || ipLookupStatsStatus !== 'succeeded') {
        return <NotFoundAnimation message='No IP Lookup statistics available.' />
    }

    const countryData = ipLookupStats.countries?.map(item => ({
        name: item.country || 'Unknown',
        value: item.count,
    })) || [];

    const ispData = ipLookupStats.isps?.map(item => ({
        name: item.isp || 'Unknown',
        value: item.count,
    })) || [];

    const lookupsByHourData = ipLookupStats.lookups_by_hour?.map(item => ({
        name: `${item.hour}:00`,
        Lookups: item.count,
    })) || [];

    const recentLookups = ipLookupStats.recent_lookups || [];

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>IP Lookup Statistics Overview</Typography>
            <Grid container spacing={3}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Lookups</Typography>
                            <Typography variant="h4">{ipLookupStats.total_lookups ?? 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Unique Targets</Typography>
                            <Typography variant="h4">{ipLookupStats.unique_targets ?? 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ textAlign: 'center', height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Unique IPs Found</Typography>
                            <Typography variant="h4">{ipLookupStats.unique_ips ?? 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Country Distribution Chart */}
                {countryData.length > 0 && (
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Lookups by Country</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={countryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {countryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* ISP Distribution Chart */}
                {ispData.length > 0 && (
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Lookups by ISP</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={ispData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#82ca9d"
                                            dataKey="value"
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} // Label with % only if names are long
                                        >
                                            {ispData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                        <Legend layout="vertical" align="right" verticalAlign="middle" formatter={(value, entry) => entry.payload.name} />

                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Recent Lookups List */}
                {recentLookups.length > 0 && (
                    <Grid item xs={12} lg={4}>
                        <Card>
                            <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}> {/* Limit height and make scrollable */}
                                <Typography variant="subtitle1" gutterBottom>Recent Lookups</Typography>
                                <List dense disablePadding>
                                    {recentLookups.map((lookup) => (
                                        <React.Fragment key={lookup.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={lookup.target}
                                                    secondary={`${lookup.ip} • ${lookup.geo_info?.city || ''}, ${lookup.geo_info?.country || ''} • ${formatDateTime(lookup.created_at)}`}
                                                    primaryTypographyProps={{ noWrap: true, title: lookup.target }}
                                                    secondaryTypographyProps={{ noWrap: true, title: `${lookup.ip} • ${lookup.geo_info?.city || ''}, ${lookup.geo_info?.country || ''}` }}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Lookups by Hour Chart */}
                {lookupsByHourData.length > 0 && (
                    <Grid item xs={12}> {/* Full width for this one */}
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Lookups by Hour (UTC)</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={lookupsByHourData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="Lookups" fill="#ffc658" />
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

export default ClientIpLookupStats;