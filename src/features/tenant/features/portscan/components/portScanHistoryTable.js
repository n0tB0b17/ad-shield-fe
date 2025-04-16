import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { formatDistanceToNowStrict } from 'date-fns'; // For relative time


const PortScanHistoryTable = ({ scanHistory }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    const handleRowClick = (scanId) => {
        navigate(`/tenant/${clientId}/port-scan/detail/${scanId}`);
    };

    if (!scanHistory || scanHistory.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No scan history found.</Typography>;
    }

    const formatDuration = (durationNs) => {
        if (!durationNs) return '-';
        const seconds = durationNs / 1_000_000_000;
        return `${seconds.toFixed(2)}s`;
    };


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="port scan history table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Target Address</TableCell>
                        <TableCell>Port Range</TableCell>
                        <TableCell align="right">Open Ports</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Scanned At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scanHistory.slice().reverse().map((scan) => ( // Show newest first
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
                            <TableCell align="right">
                                {scan.scanResultDetail?.filter(p => p.status === 'open').length || 0}
                            </TableCell>
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

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PortScanHistoryTable;