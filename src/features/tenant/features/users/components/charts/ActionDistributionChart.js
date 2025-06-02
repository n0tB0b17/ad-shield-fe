import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';


// Define colors (you can expand this list)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FFFF', '#FF19AF'];

// Shorten long action keys for display
const formatActionKey = (key) => {
    if (key.length > 25) {
         return key.substring(0, 22) + '...';
    }
    return key;
};

const ActionDistributionChart = ({ data }) => {
     const theme = useTheme();
     // Optional: Sort data or take top N if too many categories
     const chartData = data.map((entry) => ({
         name: formatActionKey(entry.key), // Use formatted key for label/legend
         originalKey: entry.key, // Keep original for tooltip
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
                    // label={renderCustomizedLabel} // Can add labels if needed
                    outerRadius={80}
                    fill={theme.palette.primary.main} // Base fill
                    dataKey="value"
                    nameKey="name"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${props.payload.originalKey}: ${value}`, null]} />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={10} wrapperStyle={{fontSize: '11px'}}/>
            </PieChart>
        </ResponsiveContainer>
    );
};


export default ActionDistributionChart;