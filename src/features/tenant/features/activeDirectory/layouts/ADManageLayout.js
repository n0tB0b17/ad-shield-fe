import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ADManageTabs from '../components/ADManageTabs';
import Loader from '../../../../../components/common/Loader';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { disconnectAD } from '../adSlice'; // Import disconnect action


const ADManageLayout = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { isConnected, connectionStatus, connectionDetails } = useSelector((state) => state.ad);


    if (!isConnected && connectionStatus !== 'loading') {
        return <Navigate to={`/tenant/${clientId}/ad/connect`} replace />;
    }

    const handleDisconnect = () => {
        dispatch(disconnectAD());
    };

    return (
        <Box>
            <Alert severity="info" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Connected to AD: {connectionDetails?.address} (Domain: {connectionDetails?.domainName})
                <Button size="small" variant="outlined" color="warning" onClick={handleDisconnect} sx={{ ml: 2 }}>
                    Disconnect
                </Button>
            </Alert>

            <ADManageTabs />

            <Box sx={{ mt: 3 }}>
                <Outlet /> 
            </Box>
        </Box>
    );
};

export default ADManageLayout;