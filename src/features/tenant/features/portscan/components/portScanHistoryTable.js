import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport, initiateDownload, clearGenerationStatus } from '../../report/reportSlice';
import { deletePortScan, resetDeleteStatus, fetchPortScanHistory } from '../portScanSlice';
import Table from '@mui/material/Table';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import LoadingAnimation from '../../../../../components/loading/loading'
import { formatDistanceToNowStrict } from 'date-fns';


const PortScanHistoryTable = ({ scanHistory }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { deleteStatus } = useSelector((state) => state.portScan);
    const reportStates = useSelector((state) => state.report.generationStatus);

    useEffect(() => {
        return () => {
            setTimeout(() => {
                dispatch(resetDeleteStatus());
            }, 500)
        }
    }, [dispatch, deleteStatus, resetDeleteStatus]);

    const handleRowClick = (scanId) => {
        navigate(`/tenant/${clientId}/port-scan/detail/${scanId}`);
    };

    const handleDeleteClick = (event, scanId) => {
        event.stopPropagation();
        if (clientId && scanId) {
            dispatch(deletePortScan({ clientId, scanId }));
        }
    };

    if (!scanHistory || scanHistory.length === 0) {
        return <LoadingAnimation message='No scan history found, scan any port to view it here :)' />;
    }

    const formatDuration = (durationNs) => {
        if (!durationNs) return '-';
        const seconds = durationNs / 1_000_000_000;
        return `${seconds.toFixed(2)}s`;
    };


    const handleGenerateReport = async (event, scan) => {
        event.stopPropagation();
        const reportData = {
            contentType: 'PORT_REPORT',
            contentId: scan.id,
            fileName: `port_scan_report_${scan.targetAddress.replace(/\./g, '_')}_${scan.id.slice(-6)}.pdf`,
        };

        try {
            await dispatch(generateReport({ clientId, reportData })).unwrap();
            console.log("Report generation initiated for:", scan.id);
        } catch (rejectedValueOrSerializedError) {
            console.error("Report generation failed (caught by unwrap):", rejectedValueOrSerializedError);
        }
    };

    const handleDownloadReport = (event, downloadUrl, fileName) => {
        event.stopPropagation();

        const download_base_url = process.env.REACT_APP_API_BASE_URL;
        const fullDownloadUrl = `${download_base_url}${downloadUrl}`;
        dispatch(initiateDownload({
            downloadUrl: fullDownloadUrl,
            fileName: fileName
        }));
    };


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="port scan history table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Target Address</TableCell>
                        <TableCell>Port Range</TableCell>
                        <TableCell> CreatedBy </TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Scanned At</TableCell>
                        <TableCell align='center'>Report</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scanHistory.slice().reverse().map((scan) => {
                        const currentReportState = reportStates[scan.id] || { status: 'idle', error: null, data: null };
                        const isLoading = currentReportState.status === 'loading';
                        const isGenerated = currentReportState.status === 'succeeded' && currentReportState.data?.download_url;
                        const hasError = currentReportState.status === 'failed';

                        return (
                            <TableRow
                                key={scan.id}
                                hover
                                onClick={() => handleRowClick(scan.id)}
                                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {scan.targetAddress}
                                </TableCell>
                                <TableCell>{scan.requestedPortRange}</TableCell>
                                <TableCell> {scan.userId} </TableCell>
                                <TableCell>
                                    <Chip
                                        label={scan.status}
                                        size="small"
                                        color={scan.status === 'success' ? 'success' : (scan.status === 'failed' ? 'error' : 'default')}
                                    />
                                </TableCell>
                                <TableCell>{formatDuration(scan.scanDuration)}</TableCell>
                                <TableCell>
                                    {scan.createdAt ? formatDistanceToNowStrict(new Date(scan.createdAt), { addSuffix: true }) : '-'}
                                </TableCell>

                                <TableCell
                                    align="center"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} />
                                    ) : hasError ? (
                                        <Tooltip title={currentReportState.error || "Failed to generate"}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<PostAddIcon />} // ICON
                                                onClick={(event) => handleGenerateReport(event, scan)}
                                            >
                                                Retry
                                            </Button>
                                        </Tooltip>
                                    ) : isGenerated && currentReportState.data ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<CloudDownloadIcon />} // ICON
                                            onClick={(event) => handleDownloadReport(
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
                                            onClick={(event) => handleGenerateReport(event, scan)}
                                        >
                                            Generate
                                        </Button>
                                    )}
                                </TableCell>


                                <TableCell
                                    align="center"
                                    className="action-cell"
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{ padding: '6px' }}
                                >
                                    <Tooltip title="Delete Scan Record">
                                        <IconButton
                                            aria-label="delete scan"
                                            size="small"
                                            color="error"
                                            onClick={(event) => handleDeleteClick(event, scan.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
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

export default PortScanHistoryTable;