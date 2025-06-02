import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// Helper to process Protocol Stats for charts
const processAppProtocolData = (protocolStats) => {
    if (!protocolStats) return [];
    return Object.entries(protocolStats)
        .filter(([name, stats]) => stats?.PacketCount > 0) // Only include protocols with packets
        .map(([name, stats]) => ({ name, count: stats.PacketCount }));
};

// Helper for DNS Domains
const processDnsDomainData = (dnsStats, topN = 15) => {
    if (!dnsStats?.Domains) return [];
    return Object.entries(dnsStats.Domains)
        .map(([domain, count]) => ({ domain, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
};

// Helper for TLS Versions
const processTlsVersionData = (tlsVersions) => {
    if (!tlsVersions) return [];
    return Object.entries(tlsVersions)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);
};

const ChartContainer = ({ title, children, height = 400 }) => ( // Increase default height
    <Paper elevation={1} sx={{ p: 2, height: height, display: 'flex', flexDirection: 'column' }}>
        <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'medium', flexShrink: 0 }} // Prevent title shrinking
        >
            {title}
        </Typography>
        {/* This Box needs to grow to fill the remaining space */}
        <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
            {/* ResponsiveContainer will take 100% of this Box */}
            {children}
        </Box>
    </Paper>
);


const PcapApplicationAnalysis = ({ appData, tlsData }) => {

    if (!appData) {
        return <Typography>Application analysis data not available.</Typography>;
    }

    const appProtocolData = processAppProtocolData(appData.ProtocolStats);
    const dnsDomainData = processDnsDomainData(appData.ProtocolStats?.DNS, 15);
    const dnsAnomalies = appData.ProtocolStats?.DNS?.Anomalies;
    const tlsVersionData = processTlsVersionData(tlsData?.Versions);


    return (
        <Box>
            <Typography variant="h6" gutterBottom>Application Layer Summary</Typography>

            <Grid container spacing={2}> {/* Ensure adequate spacing */}
                {/* App Protocol Packet Counts Bar Chart */}
                <Grid item size={{ xs: 12, md: 4 }}>
                    <ChartContainer title="Application Protocol Packet Counts">
                        <ResponsiveContainer width="100%" height="100%">
                            {/* Added specific margins for labels */}
                            <BarChart data={appProtocolData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                {/* Increased width for YAxis labels */}
                                <YAxis dataKey="name" type="category" width={80} interval={0} fontSize="0.9rem" />
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Bar dataKey="count" fill={COLORS[0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Grid>

                {/* TLS Version Distribution Pie Chart */}
                {tlsVersionData && tlsVersionData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <ChartContainer title="TLS Version Distribution">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tlsVersionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100} // Slightly larger radius
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {tlsVersionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => value.toLocaleString()} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </Grid>
                )}

                {/* Top DNS Domains Bar Chart */}
                {dnsDomainData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 8 }}> {/* Keep this full width */}
                        <ChartContainer title={`Top ${dnsDomainData.length} DNS Domains Queried`} height={450}> {/* Give this specific chart more height */}
                            <ResponsiveContainer width="100%" height="100%">
                                {/* Increased bottom margin for angled labels */}
                                <BarChart data={dnsDomainData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    {/* Ensure height is sufficient in XAxis for angled labels */}
                                    <XAxis dataKey="domain" angle={-45} textAnchor="end" interval={0} height={90} fontSize="0.75rem" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => value.toLocaleString()} />
                                    <Legend verticalAlign="top" wrapperStyle={{ top: -5, right: 0 }} />
                                    <Bar dataKey="count" fill={COLORS[1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </Grid>
                )}

                {/* DNS Anomalies List */}
                {dnsAnomalies && Object.keys(dnsAnomalies).length > 0 && (
                    <Grid item size={{ xs: 12, md: 2 }}>
                        <Paper elevation={1} sx={{ p: 2, height: '100%' /* Make paper fill grid item height */ }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>DNS Anomalies Detected</Typography>
                            <List dense sx={{ maxHeight: 300, overflow: 'auto' /* Add scroll if list is long */ }}>
                                {Object.entries(dnsAnomalies).map(([anomaly, count]) => (
                                    <ListItem key={anomaly} disablePadding>
                                        <ListItemText primary={anomaly} secondary={`Count: ${count}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                )}

            </Grid>
        </Box>
    );
};

export default PcapApplicationAnalysis;