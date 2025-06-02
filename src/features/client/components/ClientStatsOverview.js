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
import Paper from '@mui/material/Paper';
import { formatDateTime } from '../../../utils/formatting';
import LoadingClientAnimation from '../../../components/loading/loading';
import ErrorAnimation from '../../../components/loading/error';
import NotFoundAnimation from '../../../components/loading/notFound';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ClientStatsOverview = () => {
    const { clientStats, clientStatsStatus, clientStatsError } = useSelector((state) => state.clients);

    if (clientStatsStatus === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, minHeight: 150 }}>
                <LoadingClientAnimation message='Loading Clients stats...' />
            </Box>
        );
    }

    if (clientStatsStatus === 'failed') {
        return <ErrorAnimation message={`Could not load client statistics: ${clientStatsError || 'Unknown error'}`} />
    }

    if (!clientStats || clientStatsStatus !== 'succeeded') {
        return <NotFoundAnimation message='Stats not found' />
    }

    // Prepare data for charts
    const orgTypeData = clientStats.organization_types?.map(item => ({
        name: item.type || 'Unknown',
        value: item.count,
    })) || [];

    const emailDomainData = clientStats.admin_email_domains?.map(item => ({
        name: item.domain || 'Unknown',
        value: item.count,
    })) || [];

    const clientsByMonthData = clientStats.clients_by_creation_month?.map(item => ({
        name: item.month,
        Clients: item.count,
    })) || [];

    const newestClient = clientStats.newest_client;
    const oldestClient = clientStats.oldest_client;

    return (
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>Clients Overview</Typography>
            
            <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
                <Grid item xs={12} sm={12} md={4}>
                    <Card sx={{ 
                        textAlign: 'center', 
                        height: '100%', 
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: 3,
                        width: '100%'
                    }}>
                        <CardContent>
                            <Typography color="text.secondary" variant="h6" gutterBottom>Total Clients</Typography>
                            <Typography variant="h3" color="primary">{clientStats.total_clients ?? 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Card sx={{ 
                        height: '100%', 
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: 3,
                        width: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Newest Client</Typography>
                            {newestClient ? (
                                <>
                                    <Typography variant="h6" sx={{ mb: 1 }}>{newestClient.client_name}</Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Joined: {formatDateTime(newestClient.created_at)}
                                    </Typography>
                                </>
                            ) : <Typography variant="h6">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Card sx={{ 
                        height: '100%', 
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: 3,
                        width: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>Oldest Client</Typography>
                            {oldestClient ? (
                                <>
                                    <Typography variant="h6" sx={{ mb: 1 }}>{oldestClient.client_name}</Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Joined: {formatDateTime(oldestClient.created_at)}
                                    </Typography>
                                </>
                            ) : <Typography variant="h6">N/A</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* second row */}
            <Grid container spacing={2}>
                {orgTypeData.length > 0 && (
                    <Grid item size={4}>
                        <Card sx={{ 
                            height: '100%', 
                            minHeight: '500px',
                            boxShadow: 3,
                            width: '100%'
                        }}>
                            <CardContent sx={{ height: '100%', width: '100%', p: 2 }}>
                                <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                                    Organization Types
                                </Typography>
                                <Box sx={{ width: '100%', height: '450px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={orgTypeData}
                                                cx="50%"
                                                cy="45%"
                                                labelLine={true}
                                                outerRadius="70%"
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {orgTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend 
                                                layout="vertical" 
                                                verticalAlign="bottom" 
                                                align="center"
                                                wrapperStyle={{ paddingTop: '20px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Admin Email Domains Chart */}
                {emailDomainData.length > 0 && (
                    <Grid item size={4}>
                        <Card sx={{ 
                            height: '100%', 
                            minHeight: '500px',
                            boxShadow: 3,
                            width: '100%'
                        }}>
                            <CardContent sx={{ height: '100%', width: '100%', p: 2 }}>
                                <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                                    Admin Email Domains
                                </Typography>
                                <Box sx={{ width: '100%', height: '450px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={emailDomainData}
                                                cx="50%"
                                                cy="45%"
                                                labelLine={true}
                                                outerRadius="70%"
                                                fill="#82ca9d"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {emailDomainData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend 
                                                layout="vertical" 
                                                verticalAlign="bottom" 
                                                align="center"
                                                wrapperStyle={{ paddingTop: '20px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Clients by Creation Month Chart */}
                {clientsByMonthData.length > 0 && (
                    <Grid item size={4}>
                        <Card sx={{ 
                            height: '100%', 
                            minHeight: '500px',
                            boxShadow: 3,
                            width: '100%'
                        }}>
                            <CardContent sx={{ height: '100%', width: '100%', p: 2 }}>
                                <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                                    New Clients by Month
                                </Typography>
                                <Box sx={{ width: '100%', height: '450px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={clientsByMonthData} 
                                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="name" 
                                                angle={-45} 
                                                textAnchor="end" 
                                                height={60}
                                                interval={0}
                                            />
                                            <YAxis allowDecimals={false} />
                                            <RechartsTooltip />
                                            <Legend 
                                                verticalAlign="top" 
                                                height={36}
                                            />
                                            <Bar 
                                                dataKey="Clients" 
                                                fill="#ffc658"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default ClientStatsOverview;


