import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchPortScanHistory } from '../portScanSlice';
import PortScanHistoryTable from '../components/portScanHistoryTable';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

const PortScanHistoryPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        history,
        historyStatus,
        historyError
    } = useSelector((state) => state.portScan);

    useEffect(() => {
        if (clientId && historyStatus === 'idle') { // Fetch only if needed
            dispatch(fetchPortScanHistory(clientId));
        }
    }, [clientId, historyStatus, dispatch]);

    let content;

    if (historyStatus === 'loading') {
        content = <Loader />;
    } else if (historyStatus === 'succeeded') {
        content = <PortScanHistoryTable scanHistory={history} />;
    } else if (historyStatus === 'failed') {
        content = <ErrorMessage message={historyError} />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Port Scan History
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to={`/tenant/${clientId}/port-scan/new`}
                >
                    New Scan
                </Button>
            </Box>
            {content}
        </Box>
    );
};

export default PortScanHistoryPage;