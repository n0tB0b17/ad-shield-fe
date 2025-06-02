import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// Define consistent colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Helper to process IP stats for charts (top N)
const processIpData = (ipStats, topN = 10) => {
    if (!ipStats) return [];
    return Object.entries(ipStats)
        .map(([ip, count]) => ({ ip, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
};

// Helper to process Protocol Distribution data
const processProtocolData = (protocolDist) => {
    if (!protocolDist) return [];
    return Object.entries(protocolDist)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0); // Only show protocols with packets
};

// Helper to process TTL data
const processTtlData = (ttlStats) => {
    if (!ttlStats) return [];
    return Object.entries(ttlStats)
        .map(([ttl, count]) => ({ ttl: parseInt(ttl, 10), count }))
        .sort((a, b) => a.ttl - b.ttl); // Sort by TTL value
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



const PcapNetworkAnalysis = ({ networkData }) => {

    if (!networkData) {
        return <Typography>Network analysis data not available.</Typography>;
    }

    const topIpData = processIpData(networkData.IPStats, 10);
    const protocolData = processProtocolData(networkData.ProtocolDist);
    const ttlData = processTtlData(networkData.TTLStats);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Network Layer Summary</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}><Typography><b>Total Packets:</b> {networkData.TotalPacket?.toLocaleString() || '-'}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography><b>Fragmented:</b> {networkData.FragmentedPackets?.toLocaleString() || '0'}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography><b>Reassembled Flows:</b> {networkData.ReassembledFlows?.toLocaleString() || '0'}</Typography></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12, md: 4 }}>
                    <ChartContainer title="Protocol Distribution">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={protocolData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {protocolData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Grid>

                {/* Top Talkers (IPs) Bar Chart */}
                <Grid item size={{ xs: 12, md: 4 }}>
                    <ChartContainer title={`Top ${topIpData.length} IP Addresses by Packet Count`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topIpData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="ip" type="category" width={100} interval={0} fontSize="0.8rem" />
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Bar dataKey="count" fill="#8884d8" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Grid>

                {/* TTL Distribution Bar Chart */}
                <Grid item size={{ xs: 12, md: 4 }}>
                    <ChartContainer title="Time-To-Live (TTL) Distribution">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ttlData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="ttl" label={{ value: 'TTL Value', position: 'insideBottom', offset: -5 }} />
                                <YAxis label={{ value: 'Packet Count', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Grid>

            </Grid>
        </Box>
    );
};

export default PcapNetworkAnalysis;