import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { formatDistanceToNowStrict, format } from 'date-fns';
import DeleteItem from '@mui/icons-material/Delete'
import { generateReport, initiateDownload, clearGenerationStatus } from '../../report/reportSlice';
import { deletePcapData, resetDeleteStatus } from '../pcapSlice'
import LoadingAnimation from '../../../../../components/loading/loading'


const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0001-01-01")) return '-';
    try {
        const date = new Date(dateString);
        const now = new Date();
        if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000 * 7) {
            return formatDistanceToNowStrict(date, { addSuffix: true });
        }
        return format(date, 'PP p');
    } catch (e) {
        return dateString;
    }
};


const PcapHistoryTable = ({ pcapHistory }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { deleteStatus } = useSelector(state => state.pcapScan);
    const reportStates = useSelector((state) => state.report.generationStatus);
    const { clientId } = useParams();

    const handleRowClick = (pcapId) => {
        navigate(`/tenant/${clientId}/pcap/detail/${pcapId}`);
    };

    const handleDeleteRow = (event, pcapId) => {
        event.stopPropagation()
        if (clientId && pcapId) {
            dispatch(deletePcapData({ clientId, pcapId }));
        } else {
            console.error("Client ID or Pcap ID is missing for delete operation.");
        }
    }

    const handleGeneratePcapReport = async (event, pcapItem) => {
        event.stopPropagation();
        const reportData = {
            contentType: 'PCAP_REPORT',
            contentId: pcapItem.id,
            fileName: `pcap_analysis_report_${pcapItem.originalFileName?.split('.')[0] || 'pcap'}_${pcapItem.id.slice(-6)}.pdf`,
        };

        try {
            await dispatch(generateReport({ clientId, reportData })).unwrap();
        } catch (rejectedValueOrSerializedError) {
            console.error("PCAP Report generation failed:", rejectedValueOrSerializedError);
        }
    };

    const handleDownloadPcapReport = (event, downloadUrl, fileName) => {
        event.stopPropagation();
        const download_base_url = process.env.REACT_APP_API_BASE_URL;
        const fullDownloadUrl = `${download_base_url}${downloadUrl}`;

        dispatch(initiateDownload({
            downloadUrl: fullDownloadUrl,
            fileName: fileName
        }));
    };


    useEffect(() => {
        return () => {
            dispatch(resetDeleteStatus());
        };
    }, [dispatch, resetDeleteStatus]);




    if (!pcapHistory || pcapHistory.length === 0) {
        return <LoadingAnimation message='No Pcap files uploaded yet, upload pcap file to view it here :)' />;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="pcap history table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Original Filename</TableCell>
                        <TableCell>File Size</TableCell>
                        <TableCell>Uploaded At</TableCell>
                        <TableCell> Uploaded By </TableCell>
                        <TableCell>File Hash (SHA256)</TableCell>
                        <TableCell align="center">Report</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pcapHistory.map((pcap) => {
                        const currentReportState = reportStates[pcap.id] || { status: 'idle', error: null, data: null };
                        const isLoadingReport = currentReportState.status === 'loading';
                        const isReportGenerated = currentReportState.status === 'succeeded' && currentReportState.data?.download_url;
                        const hasReportError = currentReportState.status === 'failed';
                        return (
                            <TableRow
                                key={pcap.id}
                                hover
                                onClick={() => handleRowClick(pcap.id)}
                                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <Tooltip title={pcap.originalFileName}>
                                        <span>{pcap.originalFileName}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{formatBytes(pcap.fileSizeBytes)}</TableCell>
                                <TableCell>{formatDate(pcap.uploadedAt)}</TableCell>
                                <TableCell> {pcap.uploadedBy} </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <Tooltip title={pcap.fileHash}>
                                        <span>{pcap.fileHash?.substring(0, 32)}...</span>
                                    </Tooltip>
                                </TableCell>

                                <TableCell
                                    align="center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {isLoadingReport ? (
                                        <CircularProgress size={24} />
                                    ) : hasReportError ? (
                                        <Tooltip title={currentReportState.error || "Failed to generate report"}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<PostAddIcon />} // ICON
                                                onClick={(event) => handleGeneratePcapReport(event, pcap)}
                                            >
                                                Retry
                                            </Button>
                                        </Tooltip>
                                    ) : isReportGenerated && currentReportState.data ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<CloudDownloadIcon />} // ICON
                                            onClick={(event) => handleDownloadPcapReport(
                                                event,
                                                currentReportState.data.download_url,
                                                currentReportState.data.filename
                                            )}
                                        >
                                            Download
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<PostAddIcon />} // ICON
                                            onClick={(event) => handleGeneratePcapReport(event, pcap)}
                                        >
                                            Generate
                                        </Button>
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <Tooltip title="Delete record">
                                        <IconButton
                                            size="small"
                                            onClick={(event) => handleDeleteRow(event, pcap.id)}
                                            color="error"
                                        >
                                            <DeleteItem />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PcapHistoryTable;