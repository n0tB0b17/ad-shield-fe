import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ResponsiveChartWrapper from './ResponsiveChartWrapper';

const BarChartComponent = ({
  data,
  title,
  dataKey,
  barColor,
  xAxisKey = 'name',
  height,
  CustomTooltip,
  paperProps,
  containerProps
}) => {
  return (
    <ResponsiveChartWrapper 
      title={title}
      height={height}
      paperProps={paperProps}
      containerProps={containerProps}
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar dataKey={dataKey} fill={barColor} />
      </BarChart>
    </ResponsiveChartWrapper>
  );
};

export default BarChartComponent; 