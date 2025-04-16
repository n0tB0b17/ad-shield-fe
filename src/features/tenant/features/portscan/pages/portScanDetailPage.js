import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortScanById, clearSelectedScan } from '../portScanSlice';
import PortScanDetailDisplay from '../components/portScanDetail';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';

const PortScanDetailPage = () => {
    const { clientId, scanId } = useParams(); // Get both params
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedScan,
        detailStatus,
        detailError
    } = useSelector((state) => state.portScan);

    useEffect(() => {
        if (clientId && scanId) {
            dispatch(fetchPortScanById({ clientId, scanId }));
        }
        // Cleanup on unmount
        return () => {
            dispatch(clearSelectedScan());
        };
    }, [clientId, scanId, dispatch]);

    let content;

    if (detailStatus === 'loading') {
        content = <Loader />;
    } else if (detailStatus === 'succeeded' && selectedScan) {
        content = <PortScanDetailDisplay scanDetail={selectedScan} />;
    } else if (detailStatus === 'failed') {
        content = <ErrorMessage message={detailError || 'Could not load scan details.'} />;
    } else if (detailStatus !== 'loading' && !selectedScan) {
        content = <Typography sx={{ mt: 3 }}>Scan details not found.</Typography>
    }


    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/tenant/${clientId}/port-scan/history`)}
                    sx={{ mr: 2 }}
                >
                    Back to History
                </Button>
                <Typography variant="h5" component="h1">
                    Scan Details
                </Typography>
            </Box>
            {content}
        </Box>
    );
};

export default PortScanDetailPage;