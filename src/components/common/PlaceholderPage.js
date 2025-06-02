import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ConstructionIcon from '@mui/icons-material/Construction'; // Example Icon

const PlaceholderPage = ({ title }) => (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        <ConstructionIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
            {title || 'Under Construction'}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
            This feature is currently being developed. Please check back later!
        </Typography>
    </Box>
);

export default PlaceholderPage;