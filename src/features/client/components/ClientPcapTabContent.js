import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import { fetchClientPcaps, fetchClientPcapStats } from '../clientSlice';
import ClientPcapStats from './ClientPcapStats';
import ClientPcapList from './ClientPcapList';
import Loader from '../../../components/common/Loader';

const ClientPcapTabContent = ({ clientId }) => {
    const dispatch = useDispatch();
    const { pcapStatus, pcapStatsStatus } = useSelector((state) => state.clients);

    useEffect(() => {
        if (clientId) {

            if (pcapStatsStatus === 'idle') {
                dispatch(fetchClientPcapStats(clientId));
            }

            if (pcapStatus === 'idle') {
                dispatch(fetchClientPcaps(clientId));
            }
        }

    }, [clientId, pcapStatus, pcapStatsStatus, dispatch]);


    const isLoading = pcapStatus === 'loading' || pcapStatsStatus === 'loading';
    const isIdle = pcapStatus === 'idle' || pcapStatsStatus === 'idle';

    if (isIdle && isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><Loader /></Box>;
    }


    return (
        <Box>
            <ClientPcapStats />

            <ClientPcapList clientId={clientId} onPcapSelect={(id) => console.log("Selected PCAP ID:", id)} />
        </Box>
    );
};

export default ClientPcapTabContent;