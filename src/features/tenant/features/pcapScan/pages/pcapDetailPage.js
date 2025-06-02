import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPcapDetail, clearSelectedPcap } from '../pcapSlice';
import PcapDetailTabs from '../components/pcapDetailTabs';
import LoadingAnimation from '../../../../../components/loading/loading';
import ErrorMessage from '../../../../../components/loading/error';
import NotFoundAnimation from '../../../../../components/loading/notFound'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const PcapDetailPage = () => {
    const { clientId, pcapId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedPcapAnalysis,
        detailStatus,
        detailError
    } = useSelector((state) => state.pcapScan);

    useEffect(() => {
        if (clientId && pcapId) {
            dispatch(fetchPcapDetail({ clientId, pcapId }));
        }
        // Cleanup on unmount
        return () => {
            dispatch(clearSelectedPcap());
        };
    }, [clientId, pcapId, dispatch]);

    let content;

    if (detailStatus === 'loading') {
        content = <LoadingAnimation message="waiting for pcap file to come" />;
    } else if (detailStatus === 'succeeded' && selectedPcapAnalysis) {
        content = <PcapDetailTabs analysisData={selectedPcapAnalysis} />;
    } else if (detailStatus === 'failed') {
        content = <ErrorMessage message={detailError || 'Could not load Pcap analysis details.'} />;
    } else if (detailStatus !== 'loading' && !selectedPcapAnalysis) {
         content = <NotFoundAnimation message='Pcap analysis data not found or analysis is incomplete.' />;
    }

    return (
        <Box>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                 <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/tenant/${clientId}/pcap/history`)}
                    sx={{ mr: 2 }}
                >
                    Back to History
                </Button>
                <Typography variant="h5" component="h1">
                     Pcap Analysis Details
                </Typography>
             </Box>
             <Paper elevation={2} sx={{ p: { xs: 1, sm: 2, md: 3 }, mt: 1 }}>
                {content}
             </Paper>
        </Box>
    );
};

export default PcapDetailPage;