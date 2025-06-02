import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import ResponsiveChartWrapper from './ResponsiveChartWrapper';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PieChartComponent = ({
  data,
  title,
  dataKey = 'value',
  nameKey = 'name',
  height,
  colors = COLORS,
  CustomTooltip,
  customLabel,
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
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={customLabel || (({ name, percent }) => 
            percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''
          )}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveChartWrapper>
  );
};

export default PieChartComponent; 