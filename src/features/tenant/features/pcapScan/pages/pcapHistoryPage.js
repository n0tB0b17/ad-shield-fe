import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPcapHistory, resetUploadStatus } from '../pcapSlice';
import PcapHistoryTable from '../components/pcapHistoryTable';
import PcapUploadModal from '../components/pcapUploadModal';
import Loader from '../../../../../components/loading/loading';
import ErrorMessage from '../../../../../components/loading/error';
import SuccessMessage from '../../../../../components/loading/success';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Divider } from '@mui/material';

const PcapHistoryPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        history,
        historyStatus,
        historyError,
        deleteStatus,
        deleteError
    } = useSelector((state) => state.pcapScan);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleOpenUploadModal = () => {
        dispatch(resetUploadStatus());
        setIsUploadModalOpen(true);
    };

    const handleCloseUploadModal = (refreshNeeded = false) => {
        setIsUploadModalOpen(false);
        // if (refreshNeeded) {
        //     dispatch(fetchPcapHistory(clientId));
        // }
    };

    useEffect(() => {
        if (clientId && historyStatus === "idle") {
            dispatch(fetchPcapHistory(clientId));
        }
    }, [clientId, historyStatus, dispatch]);

    let content;

    if (historyStatus === 'loading') {
        content = <Loader />;
    } else if (historyStatus === 'succeeded') {
        content = <PcapHistoryTable pcapHistory={history} />;
    } else if (historyStatus === 'failed') {
        content = <ErrorMessage message={historyError} />;
    }

    let deleteContent;
    if (deleteStatus === "failed") {
        deleteContent = <ErrorMessage message={deleteError} />
    } else if (deleteStatus === "succeeded") {
        deleteContent = <SuccessMessage message='record deleted' />
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Pcap Scan History
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={handleOpenUploadModal}
                >
                    Upload Pcap
                </Button>
            </Box>

            {deleteContent}
            <Divider sx={{ mb: 3 }} />
            {content}
            <PcapUploadModal
                open={isUploadModalOpen}
                handleClose={handleCloseUploadModal}
                clientId={clientId}
            />
        </Box>
    );
};

export default PcapHistoryPage;