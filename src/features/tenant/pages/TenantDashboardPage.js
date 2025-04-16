import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

const TenantDashboardPage = () => {
    const { currentUser, currentTenantInfo } = useSelector(state => state.tenants);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome to {currentTenantInfo?.clientName || 'Dashboard'}, {currentUser?.userName || 'User'}!
            </Typography>
            <Typography>
                This is your tenant-specific dashboard.
            </Typography>
        </Box>
    );
};

export default TenantDashboardPage;