import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { useTheme } from '@mui/material/styles';

// Function to truncate long IP addresses if needed (though less common)
const formatIP = (ip) => {
    if (ip.length > 30) { // Example threshold
        return ip.substring(0, 27) + '...';
    }
    return ip;
};

const IpAddressDistributionChart = ({ data, topN = 10 }) => { // Show top 10 IPs by default
    const theme = useTheme();

    // Sort data by count descending and take the top N
    const sortedData = data
        .slice() // Create a copy to avoid mutating original
        .sort((a, b) => b.count - a.count)
        .slice(0, topN)
        .map(item => ({
            ...item,
            ip_address_short: formatIP(item.ip_address) // Use formatted IP for axis
        }));


    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={sortedData}
                layout="vertical" // Horizontal bars often better for long labels
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }} // Adjust left margin for labels
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false}>
                    <Label value="Activity Count" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis
                    dataKey="ip_address_short"
                    type="category"
                    width={120} // Increase width for IP addresses
                    tick={{ fontSize: 10 }}
                    interval={0} // Show all labels
                />
                <Tooltip formatter={(value, name, props) => [`${props.payload.ip_address}: ${value}`, null]} />
                {/* <Legend /> */}
                <Bar dataKey="count" name="Count" fill={theme.palette.info.main} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default IpAddressDistributionChart;