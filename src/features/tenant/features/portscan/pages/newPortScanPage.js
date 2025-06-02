import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import NewPortScanForm from '../components/newPortScanForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NewPortScanPage = () => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto' }}>
            <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/tenant/${clientId}/port-scan/history`)}
                    sx={{ mr: 2 }}
                >
                    Back to History
                </Button>
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