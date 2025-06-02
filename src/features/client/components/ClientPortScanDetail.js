// src/features/client/components/ClientPortScanDetail.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { clearSelectedPortScan } from '../clientSlice'; // Action to clear detail

const ClientPortScanDetail = ({ onBackToList }) => {
    const dispatch = useDispatch();
    const { selectedPortScan, portScanDetailStatus, portScanDetailError } = useSelector((state) => state.clients);

    const handleBack = () => {
        dispatch(clearSelectedPortScan()); // Clear redux state
        onBackToList(); // Notify parent to switch view
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const formatDuration = (durationNs) => {
        if (typeof durationNs !== 'number' || isNaN(durationNs)) return 'N/A';
        const seconds = (durationNs / 1e9).toFixed(2);
        return `${seconds} seconds`;
    };

    if (portScanDetailStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>;
    }

    if (portScanDetailStatus === 'failed') {
        return (
            <Box sx={{ mt: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
                    Back to Scan List
                </Button>
                <Alert severity="error">{portScanDetailError || 'Failed to load port scan details.'}</Alert>
            </Box>
        );
    }

    if (!selectedPortScan) {
        // This case might happen briefly if the state clears before unmounting
        // or if the user somehow accesses this state without a selected scan
        return (
            <Box sx={{ mt: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
                    Back to Scan List
                </Button>
                <Typography sx={{ textAlign: 'center' }}>No scan details available.</Typography>
            </Box>
        );
    }

    const {
        id,
        target_address,
        requested_port_range,
        scan_start_time,
        scan_end_time,
        scan_duration,
        status,
        scan_result_detail = [], // Default to empty array
        user_id, // Might want to display this or fetch user info
        created_at
    } = selectedPortScan;


    return (
        <Box sx={{ mt: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
                Back to Scan List
            </Button>
            <Card>
                <CardHeader
                    title={`Port Scan Details: ${target_address}`}
                    subheader={`Scan ID: ${id}`}
                    action={
                        <Chip
                            label={status}
                            size="small"
                            color={status === 'success' ? 'success' : (status === 'failed' ? 'error' : 'default')}
                        />
                    }
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                />
                <CardContent>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Target Address:</Typography>
                            <Typography variant="body1" fontWeight="medium">{target_address}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Requested Port Range:</Typography>
                            <Typography variant="body1" fontWeight="medium">{requested_port_range}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Scan Start Time:</Typography>
                            <Typography variant="body1" fontWeight="medium">{formatDateTime(scan_start_time)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Scan End Time:</Typography>
                            <Typography variant="body1" fontWeight="medium">{formatDateTime(scan_end_time)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Duration:</Typography>
                            <Typography variant="body1" fontWeight="medium">{formatDuration(scan_duration)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Initiated By User ID:</Typography>
                            <Typography variant="body1" fontWeight="medium">{user_id || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Record Created At:</Typography>
                            <Typography variant="body1" fontWeight="medium">{formatDateTime(created_at)}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom component="div">
                        Scan Results ({scan_result_detail.length} ports checked)
                    </Typography>
                    {scan_result_detail.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small" aria-label="scan result details table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Port</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Service</TableCell>
                                        <TableCell>Version</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {scan_result_detail.map((detail, index) => (
                                        <TableRow key={`${detail.address}-${detail.port}-${index}`}>
                                            <TableCell>{detail.port}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={detail.status}
                                                    size="small"
                                                    color={detail.status === 'open' ? 'success' : 'default'}
                                                    variant={detail.status === 'open' ? 'filled' : 'outlined'}
                                                />
                                            </TableCell>
                                            <TableCell>{detail.service || '-'}</TableCell>
                                            <TableCell>{detail.version || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ mt: 1, fontStyle: 'italic' }}>No detailed results available for this scan.</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClientPortScanDetail;