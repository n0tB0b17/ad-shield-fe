import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { formatDateTime } from '../../../../../../utils/formatting';

const ActivityTimelineChart = ({ data }) => {
    const theme = useTheme();
    const formattedData = data.map(item => ({
        ...item,
        dateFormatted: formatDateTime(new Date(item.date), 'MMM d')
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={formattedData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Activities" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ActivityTimelineChart;