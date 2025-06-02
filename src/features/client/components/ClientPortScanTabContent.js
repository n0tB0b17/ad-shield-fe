import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClientPortScanList from './ClientPortScanList';
import ClientPortScanDetail from './ClientPortScanDetail';
import { fetchClientPortScans, fetchClientPortScanStats } from '../clientSlice';
import Box from '@mui/material/Box';
import Loader from '../../../components/common/Loader';
import ClientPortScanStats from './ClientPortScanStats';

const ClientPortScanTabContent = ({ clientId }) => {
    const dispatch = useDispatch();
    const [selectedScanId, setSelectedScanId] = useState(null);
    const { portScanStatus, portScanDetailStatus, portScanStatsStatus } = useSelector(state => state.clients);

    useEffect(() => {
        if (clientId) {
            if (portScanStatus === "idle") {
                dispatch(fetchClientPortScans(clientId));
            }

            if (portScanStatsStatus === "idle") {
                dispatch(fetchClientPortScanStats(clientId))
            }
        }

    }, [clientId, portScanStatus, dispatch, selectedScanId, portScanStatsStatus]);

    const handleScanSelect = (scanId) => {
        setSelectedScanId(scanId);
    };

    const handleBackToScanList = () => {
        setSelectedScanId(null);
    };

    if (portScanStatus === 'idle' || (portScanStatus === 'loading' && !selectedScanId)) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><Loader /></Box>;
    }


    return (
        <Box>
            {selectedScanId ? (
                <ClientPortScanDetail onBackToList={handleBackToScanList} />
            ) : (<>
                <ClientPortScanStats />
                <ClientPortScanList clientId={clientId} onScanSelect={handleScanSelect} />
            </>
            )}
        </Box>
    );
};
export default ClientPortScanTabContent;