import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns'; // For formatting dates

const DetailItem = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4} sx={{ mb: 1.5, wordBreak: 'break-word' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
            {label}
        </Typography>
        <Typography variant="body1">{value || '-'}</Typography>
    </Grid>
);

const PortScanDetailDisplay = ({ scanDetail }) => {

    if (!scanDetail) {
        return <Typography>Scan details not available.</Typography>;
    }

    const formatDuration = (durationNs) => {
        if (!durationNs) return '-';
        const seconds = durationNs / 1_000_000_000;
        return `${seconds.toFixed(2)} seconds`;
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString.startsWith("0001-01-01")) return '-';
        try {
            return format(new Date(dateString), 'PPpp'); // e.g., Aug 21, 2024, 4:30:00 PM
        } catch (e) {
            return dateString; // Fallback
        }
    };

    const openPorts = scanDetail.scanResultDetail?.filter(p => p.status === 'open') || [];
    const closedFilteredPorts = scanDetail.scanResultDetail?.filter(p => p.status !== 'open') || [];


    return (
        <Card sx={{ mt: 1 }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    Scan Summary: {scanDetail.targetAddress}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Scan ID: {scanDetail.id}
                </Typography>

                <Grid container spacing={1}>
                    <DetailItem label="Target Address" value={scanDetail.targetAddress} />
                    <DetailItem label="Requested Ports" value={scanDetail.requestedPortRange} />
                    <DetailItem label="Status" value={
                        <Chip
                            label={scanDetail.status}
                            size="small"
                            color={scanDetail.status === 'success' ? 'success' : (scanDetail.status === 'failed' ? 'error' : 'default')}
                        />
                    } />
                    <DetailItem label="Scan Start" value={formatDate(scanDetail.scanStartTime)} />
                    <DetailItem label="Scan End" value={formatDate(scanDetail.scanEndTime)} />
                    <DetailItem label="Duration" value={formatDuration(scanDetail.scanDuration)} />
                    <DetailItem label="Scan Requested At" value={formatDate(scanDetail.createdAt)} />
                    <DetailItem label="Requested By User ID" value={scanDetail.userId} />
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Open Ports ({openPorts.length})
                </Typography>
                {openPorts.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small" aria-label="open ports table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Port</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Version</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {openPorts.map((portInfo, index) => (
                                    <TableRow key={`${portInfo.port}-${index}`}>
                                        <TableCell component="th" scope="row">{portInfo.port}</TableCell>
                                        <TableCell>
                                            <Chip label={portInfo.status} size="small" color="success" variant="outlined" />
                                        </TableCell>
                                        <TableCell>{portInfo.service || '-'}</TableCell>
                                        <TableCell sx={{ wordBreak: 'break-all' }}>{portInfo.version || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body2" color="text.secondary">No open ports found in this scan.</Typography>
                )}


                {/* Optionally display closed/filtered ports */}
                {closedFilteredPorts.length > 0 && (
                    <>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            Closed / Filtered Ports ({closedFilteredPorts.length})
                        </Typography>
                        {/* You could add another table here if needed */}
                        <Typography variant="body2" color="text.secondary">
                            {closedFilteredPorts.length} other ports were scanned but found closed or filtered.
                        </Typography>
                    </>
                )}

            </CardContent>
        </Card>
    );
};

export default PortScanDetailDisplay;