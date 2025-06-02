// src/features/client/components/ClientPcapStats.js
import React from 'react';
import { useSelector } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Tooltip as RechartsTooltip // Alias Tooltip to avoid clash with MUI
} from 'recharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { formatBytes } from '../../../utils/formatting'; // Adjust path as needed
import LoadingClientAnimation from '../../../components/loading/loading';
import ErrorAnimation from '../../../components/loading/error';
import NotFoundAnimation from '../../../components/loading/notFound';

// Define some colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ClientPcapStats = () => {
    const { pcapStats, pcapStatsStatus, pcapStatsError } = useSelector((state) => state.clients);

    if (pcapStatsStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingClientAnimation message='loading stats data...' />
        </Box>;
    }

    if (pcapStatsStatus === 'failed') {
        return <ErrorAnimation message={pcapStatsError || 'Failed to load PCAP statistics.'} />;
    }

    if (!pcapStats || pcapStatsStatus !== 'succeeded') {
        return <NotFoundAnimation message='No PCAP statistics available.' />
    }

    // Prepare data for charts
    const contentTypeData = pcapStats.content_type_breakdown?.map(item => ({
        name: item.content_type.split(';')[0] || 'Unknown', // Simplify long content types
        value: item.count,
    })) || [];

    const uploadsByDayData = pcapStats.uploads_by_day || [];
    const uploadsByHourData = pcapStats.uploads_by_hour?.map(item => ({
        name: `${item.hour}:00`, // Format hour for label
        Uploads: item.count,
    })) || [];


    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>PCAP Statistics Overview</Typography>
            <Grid container spacing={2} rowSpacing={2}>
                <Grid container spacing={2}>
                    <Grid item size={{xs: 12, sm: 2, md: 3 }}>
                        <Card sx={{ textAlign: 'center' }}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Total PCAPs</Typography>
                                <Typography variant="h4">{pcapStats.total_pcaps ?? 'N/A'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 2, md: 3 }}>
                        <Card sx={{ textAlign: 'center', }}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Total Storage</Typography>
                                <Typography variant="h4">{formatBytes(pcapStats.total_storage_bytes ?? 0)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 2, md: 3 }}>
                        <Card sx={{ textAlign: 'center', }}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Avg. File Size</Typography>
                                <Typography variant="h4">{formatBytes(pcapStats.average_file_size ?? 0)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item size={{xs: 12, sm: 2, md: 3 }}>
                        <Card sx={{ textAlign: 'center', }}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Analyzed / Unanalyzed</Typography>
                                <Typography variant="h4">{pcapStats.analyzed_count ?? 0} / {pcapStats.unanalyzed_count ?? 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Uploads by Hour Chart */}
                {uploadsByHourData.length > 0 && (
                    <Grid item size={{xs: 12, sm: 2, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Uploads by Hour (UTC)</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={uploadsByHourData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="Uploads" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Content Type Chart */}
                {contentTypeData.length > 0 && (
                    <Grid item size={{xs: 12, sm: 2, md: 3.5 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>Content Type Breakdown</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={contentTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {contentTypeData.map((entry, index) => (
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

                {/* You can add more charts here for uploads_by_day, upload_activity_trend etc. */}

            </Grid>
        </Box>
    );
};

export default ClientPcapStats;