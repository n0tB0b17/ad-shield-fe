// src/features/client/components/ClientPcapList.js
import React from 'react';
import { useSelector } from 'react-redux';
import ErrorAnimation from '../../../components/loading/error'
import NotFoundAnimation from '../../../components/loading/notFound'
import LoadingAnimation from '../../../components/loading/loading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { formatBytes, formatDateTime, formatRelativeTime } from '../../../utils/formatting';
import { Link as RouterLink } from 'react-router-dom';


const ClientPcapList = ({ clientId, onPcapSelect }) => {
    const { pcaps, pcapStatus, pcapError } = useSelector((state) => state.clients);
    const handleRowClick = (pcapId) => {
        if (onPcapSelect) {
            onPcapSelect(pcapId);
            // Example: navigate(`/clients/${clientId}/pcap/${pcapId}`);
        }
        console.log("PCAP Row clicked (implement detail view):", pcapId);
    };

    if (pcapStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingAnimation />
        </Box>;
    }


    if (!pcaps || pcaps.length === 0) {
        return <NotFoundAnimation message='No PCAP files found for this client' />;
    }

    if (pcapStatus === 'failed') {
        return <ErrorAnimation message={pcapError || 'Failed to load PCAP list.'} />;
    }


    return (
        <Box sx={{ px: 2, pb: 2 }}> {/* Add padding */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Uploaded PCAP Files</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="client pcap list table">
                    <TableHead sx={{ backgroundColor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>Original Filename</TableCell>
                            <TableCell>File Size</TableCell>
                            <TableCell>Uploaded At</TableCell>
                            <TableCell>Uploaded By (ID)</TableCell>
                            <TableCell>Last Analyzed</TableCell>
                            <TableCell>Content Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pcaps.map((pcap) => (
                            <TableRow
                                key={pcap.id}
                                hover
                                onClick={() => handleRowClick(pcap.id)}
                                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Tooltip title={pcap.storedFileName || ''} placement="top-start">
                                        <span>{pcap.originalFileName}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{formatBytes(pcap.fileSizeBytes)}</TableCell>
                                <TableCell>
                                    <Tooltip title={formatDateTime(pcap.uploadedAt)} placement="top">
                                        <span>{formatRelativeTime(pcap.uploadedAt)}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{pcap.uploadedBy}</TableCell>
                                <TableCell>
                                    {pcap.lastAnalyzedTime ? formatDateTime(pcap.lastAnalyzedTime) : 'Never'}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={pcap.contentType || ''} placement="top-start">
                                        {/* Truncate long content types for display */}
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                            {pcap.contentType?.split(';')[0] || 'N/A'}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ClientPcapList;