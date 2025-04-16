import React from 'react';
import NewPortScanForm from '../components/newPortScanForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const NewPortScanPage = () => {
    return (
        <Box sx={{ maxWidth: 600, margin: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Initiate New Port Scan
                </Typography>
                <NewPortScanForm />
            </Paper>
        </Box>
    );
};

export default NewPortScanPage;