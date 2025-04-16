import React from 'react';
import TenantLoginForm from '../components/TenantLoginForm';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const TenantLoginPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 180px)',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, mt: -8 }}>
                <TenantLoginForm />
            </Paper>
        </Box>
    );
};

export default TenantLoginPage;