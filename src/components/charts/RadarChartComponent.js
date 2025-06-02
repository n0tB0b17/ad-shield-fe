import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import ResponsiveChartWrapper from './ResponsiveChartWrapper';

const RadarChartComponent = ({
  data,
  title,
  dataKey,
  angleAxisKey,
  height = 400,
  color,
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
      <RadarChart outerRadius={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={angleAxisKey} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} />
        <Radar
          name="Port Accessibility"
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.6}
        />
        <Legend />
        <Tooltip content={CustomTooltip} />
      </RadarChart>
    </ResponsiveChartWrapper>
  );
};

export default RadarChartComponent; 