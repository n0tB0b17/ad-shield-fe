import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// Define more colors if needed
const COLORS = ['#8884d8', '#82ca9d', '#FFC107', '#FF8042', '#00C49F', '#FFBB28'];

// Shorten long User Agent strings for display in legend/tooltip if needed
const formatUserAgent = (ua) => {
    if (!ua) return 'Unknown';
    // Basic shortening (you might need more sophisticated parsing)
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Postman')) return 'Postman';
    if (ua.includes('curl/')) return 'cURL';
    if (ua.length > 30) {
        return ua.substring(0, 27) + '...';
    }
    return ua;
};

const UserAgentDistributionChart = ({ data }) => {
    const theme = useTheme();
    const chartData = data.map((entry) => ({
        name: formatUserAgent(entry.user_agent),
        originalAgent: entry.user_agent,
        value: entry.count,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill={theme.palette.success.main}
                    dataKey="value"
                    nameKey="name"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${props.payload.originalAgent}: ${value}`, null]} />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default UserAgentDistributionChart;