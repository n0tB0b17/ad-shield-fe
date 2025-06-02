import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const HourlyDistributionChart = ({ data }) => {
    const theme = useTheme();
     // Ensure data covers all 24 hours, even if count is 0, and sort by hour
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
    data.forEach(item => {
        if (item.hour >= 0 && item.hour < 24) {
            hourlyData[item.hour].count = item.count;
        }
    });

     const formatHour = (hour) => `${hour.toString().padStart(2, '0')}:00`; // Format as HH:00

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={hourlyData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={formatHour} tick={{ fontSize: 11 }} interval={2} /> {/* Show every 3 hours approx */}
                <YAxis allowDecimals={false}/>
                <Tooltip formatter={(value, name, props) => [`${formatHour(props.payload.hour)}: ${value}`, null]}/>
                {/* <Legend /> */}
                <Bar dataKey="count" name="Activities" fill={theme.palette.secondary.main} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HourlyDistributionChart;