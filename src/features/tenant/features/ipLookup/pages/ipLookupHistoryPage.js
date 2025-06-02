import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLookupHistory } from '../ipLookupSlice';
import IpLookupHistoryTable from '../components/ipLookupHistoryTable';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingClientAnimation from '../../../../../components/loading/loading';
import ErrorAnimation from '../../../../../components/loading/error';

const IpLookupHistoryPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        history,
        historyStatus,
        historyError
    } = useSelector((state) => state.ipLookup);

    useEffect(() => {
        // Fetch only if idle or if forced refresh is needed
        if (clientId && historyStatus === 'idle') {
            dispatch(fetchLookupHistory(clientId));
        }
    }, [clientId, historyStatus, dispatch]);

    let content;

    if (historyStatus === 'loading') {
        content = <LoadingClientAnimation message='waiting for iplook history to come' />;
    } else if (historyStatus === 'succeeded') {
        content = <IpLookupHistoryTable lookupHistory={history} />;
    } else if (historyStatus === 'failed') {
        content = <ErrorAnimation message={historyError} />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    IP Lookup History
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/tenant/${clientId}/ip-lookup`)}
                >
                    Back to Lookup
                </Button>
            </Box>
            {content}
        </Box>
    );
};

export default IpLookupHistoryPage;