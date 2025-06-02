import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import ADConnectForm from '../components/ADConnectForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

const ADConnectPage = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const { isConnected, connectionError, connectionStatus } = useSelector((state) => state.ad);

    useEffect(() => {
        if (isConnected) {
            navigate(`/tenant/${clientId}/ad/manage/groups`, { replace: true });
        }
        // Dependency array ensures this runs when isConnected changes
    }, [isConnected, navigate, clientId]);

    return (
        <Box sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/tenant/${clientId}/ad/connections`)}
                sx={{ mr: 2 }}
            >
                Back to connections
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Connect to Active Directory
                </Typography>
                {connectionStatus === 'failed' && connectionError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{connectionError}</Alert>
                )}
                <ADConnectForm />
            </Paper>
        </Box>
    );
};

export default ADConnectPage;