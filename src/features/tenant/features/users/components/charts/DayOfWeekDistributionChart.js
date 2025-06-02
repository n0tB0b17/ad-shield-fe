import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DayOfWeekDistributionChart = ({ data }) => {
    const theme = useTheme();

    const weeklyData = DAY_NAMES.map((dayName, index) => {
        const apiData = data.find(item => item.day_of_week === index);
        return {
            dayName: dayName,
            count: apiData ? apiData.count : 0, // Use count from API or 0 if not found
        };
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayName" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="count" name="Activities" fill={theme.palette.warning.main} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DayOfWeekDistributionChart;