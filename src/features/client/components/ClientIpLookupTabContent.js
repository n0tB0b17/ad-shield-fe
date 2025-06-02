import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import { fetchClientIpLookups, fetchClientIpLookupStats } from '../clientSlice';
import ClientIpLookupStats from './ClientIpLookupStats';
import ClientIpLookupList from './ClientIpLookupList';
import Loader from '../../../components/common/Loader';

const ClientIpLookupTabContent = ({ clientId }) => {
    const dispatch = useDispatch();
    const { ipLookupStatus, ipLookupStatsStatus } = useSelector((state) => state.clients);

    useEffect(() => {
        if (clientId) {
            if (ipLookupStatsStatus === 'idle') {
                dispatch(fetchClientIpLookupStats(clientId));
            }

            if (ipLookupStatus === 'idle') {
                dispatch(fetchClientIpLookups(clientId));
            }
        }
    }, [clientId, ipLookupStatus, ipLookupStatsStatus, dispatch]);

    const isLoading = ipLookupStatus === 'loading' || ipLookupStatsStatus === 'loading';
    const isIdle = ipLookupStatus === 'idle' || ipLookupStatsStatus === 'idle';

    if (isIdle && isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><Loader /></Box>;
    }

    return (
        <Box>
            <ClientIpLookupStats />

            {/* Render List */}
            <ClientIpLookupList
                clientId={clientId}
                onLookupSelect={(id) => console.log("Selected IP Lookup ID:", id)}
            />
        </Box>
    );
};

export default ClientIpLookupTabContent;