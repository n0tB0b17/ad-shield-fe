import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchPortScanHistory, resetDeleteStatus } from '../portScanSlice';
import PortScanHistoryTable from '../components/portScanHistoryTable';
import PortScanDashboard from '../components/portScanCharts';
import Loader from '../../../../../components/loading/loading';
import ErrorMessage from '../../../../../components/loading/error';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';


const PortScanHistoryPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        history,
        historyStatus,
        historyError,
        deleteStatus,
        deleteError
    } = useSelector((state) => state.portScan);

    const isInitialMount = useRef(true);
    useEffect(() => {
        if (clientId) {
            if (historyStatus === 'idle') {
                dispatch(fetchPortScanHistory(clientId));
            }
        }
    }, [clientId, dispatch, historyStatus]);


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (deleteStatus === "succeeded") {
            dispatch(fetchPortScanHistory(clientId));
            dispatch(resetDeleteStatus());
        }
    }, [deleteStatus, clientId, dispatch]);

    let content;
    let dashboard;

    if (historyStatus === 'loading') {
        content = <Loader message='loading detected services...' />;
    } else if (historyStatus === 'succeeded') {
        dashboard = <PortScanDashboard scanHistory={history} />;
        content = <PortScanHistoryTable scanHistory={history} />;
    } else if (historyStatus === 'failed') {
        content = <ErrorMessage message={historyError} />;
    }

    let animationContent;

    if (deleteStatus === "loading") {
        animationContent = <Loader message='deleting record...' />
    } else if (deleteStatus === "failed") {
        animationContent = <ErrorMessage message={deleteError} />
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Service detection
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

            {dashboard}
            {dashboard && <Divider sx={{ my: 3 }} />} {/* Show divider only if dashboard exists */}

            {animationContent && (
                <>
                    {animationContent}
                    <Divider sx={{ my: 3 }} />
                </>
            )}

            {content}
        </Box>
    );
};

export default PortScanHistoryPage;