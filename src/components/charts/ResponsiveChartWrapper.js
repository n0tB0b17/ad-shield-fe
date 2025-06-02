import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

const ResponsiveChartWrapper = ({ 
  title, 
  height = 300, 
  children,
  paperProps = {},
  containerProps = {}
}) => {
  return (
    <Paper 
      sx={{ 
        p: 2, 
        width: '100%',
        minWidth: '650px', // Match table's minWidth
        height, 
        display: 'flex',
        flexDirection: 'column',
        ...paperProps 
      }}
    >
      {title && (
        <Typography 
          variant="subtitle1" 
          align="center" 
          gutterBottom
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        flex: 1,
        '.recharts-wrapper': {
          width: '100% !important',
        }
      }}>
        <ResponsiveContainer 
          width="100%" 
          height="100%" 
          {...containerProps}
        >
          {children}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ResponsiveChartWrapper; 