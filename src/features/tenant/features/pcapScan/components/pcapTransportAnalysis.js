import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Helper to process Port stats for charts (top N)
const processPortData = (portStats, topN = 15) => {
    if (!portStats) return [];
    return Object.entries(portStats)
        .map(([port, count]) => ({ port, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
};

// Helper for TCP/UDP comparison
const processTcpUdpData = (tcpCount, udpCount) => {
    const data = [];
    if (tcpCount > 0) data.push({ name: 'TCP', value: tcpCount });
    if (udpCount > 0) data.push({ name: 'UDP', value: udpCount });
    return data;
}

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


const PcapTransportAnalysis = ({ transportData }) => {

    if (!transportData) {
        return <Typography>Transport analysis data not available.</Typography>;
    }

    const topPortData = processPortData(transportData.PortStats, 15);
    const tcpUdpData = processTcpUdpData(transportData.TCPPacketCount, transportData.UDPPacketCount);
    // UDP Flood Ports data might not always exist
    const udpFloodData = processPortData(transportData.UDPFloodPorts, 10);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Transport Layer Summary</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}><Typography><b>TCP Packets:</b> {transportData.TCPPacketCount?.toLocaleString() || '0'}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography><b>UDP Packets:</b> {transportData.UDPPacketCount?.toLocaleString() || '0'}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography><b>Retransmissions:</b> {transportData.Retransmissions?.toLocaleString() || '0'}</Typography></Grid>
                <Grid item xs={6} sm={3}><Typography><b>Invalid TCP Flags:</b> {transportData.InvalidTCPFlags?.toLocaleString() || '0'}</Typography></Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* TCP vs UDP Pie Chart */}
                <Grid item size={{ xs: 12, md: 4 }}>
                    <ChartContainer title="TCP vs UDP Packet Count">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tcpUdpData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {tcpUdpData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Grid>

                {/* Top Ports Bar Chart */}
                <Grid item size={{ xs: 12, md: 6 }}>
                    <ChartContainer title={`Top ${topPortData.length} Ports by Packet Count`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPortData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="port" />
                                <YAxis />
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Legend />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </Grid>

                {/* UDP Flood Ports (Conditional) */}
                {udpFloodData.length > 0 && (
                    <Grid item size={{ xs: 12, md: 2 }}>
                        <ChartContainer title={`Top ${udpFloodData.length} UDP Flood Ports`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={udpFloodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="port" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => value.toLocaleString()} />
                                    <Legend />
                                    <Bar dataKey="count" fill={COLORS[2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </Grid>
                )}

            </Grid>
        </Box>
    );
};

export default PcapTransportAnalysis;