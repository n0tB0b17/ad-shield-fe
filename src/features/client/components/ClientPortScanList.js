// src/features/client/components/ClientPortScanList.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorAnimation from '../../../components/loading/error'
import NotFoundAnimation from '../../../components/loading/notFound'
import Alert from '@mui/material/Alert';
import { formatDistanceToNow } from 'date-fns';
import Tooltip from '@mui/material/Tooltip';

import { fetchClientPortScanDetail } from '../clientSlice';
import LoadingClientAnimation from '../../../components/loading/loading';

const ClientPortScanList = ({ clientId, onScanSelect }) => {
    const dispatch = useDispatch();
    const { portScans, portScanStatus, portScanError } = useSelector((state) => state.clients);

    const handleRowClick = (serviceId) => {
        dispatch(fetchClientPortScanDetail({ clientId, serviceId }));
        onScanSelect(serviceId);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString(); // Or use a more specific format
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return `${formatDistanceToNow(new Date(dateString))} ago`;
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const formatDuration = (durationNs) => {
        if (typeof durationNs !== 'number' || isNaN(durationNs)) return 'N/A';
        const seconds = (durationNs / 1e9).toFixed(2);
        return `${seconds} s`;
    };

    if (portScanStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <LoadingClientAnimation />
        </Box>;
    }

    if (!portScans || portScans.length === 0) {
        return <NotFoundAnimation message='No port scan data available' />
    }

    if (portScanStatus === 'failed') {
        return <ErrorAnimation message={portScanError || 'Failed to load port scan history.'} />
    }

    

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="client port scan list table">
                <TableHead sx={{ backgroundColor: 'grey.200' }}>
                    <TableRow>
                        <TableCell>Target Address</TableCell>
                        <TableCell>Port Range</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Scan Started</TableCell>
                        <TableCell>Completed</TableCell>
                        <TableCell align="right">Open Ports</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {portScans.map((scan) => (
                        <TableRow
                            key={scan.id} // Use the mapped 'id'
                            hover
                            // onClick={() => handleRowClick(scan.id)} // Pass scan.id
                            sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {scan.target_address}
                            </TableCell>
                            <TableCell>{scan.requested_port_range}</TableCell>
                            <TableCell>
                                <Chip
                                    label={scan.status}
                                    size="small"
                                    color={scan.status === 'success' ? 'success' : (scan.status === 'failed' ? 'error' : 'default')}
                                />
                            </TableCell>
                            <TableCell>{formatDuration(scan.scan_duration)}</TableCell>
                            <TableCell>
                                <Tooltip title={formatDateTime(scan.scan_start_time)} placement="top">
                                    <span>{formatRelativeTime(scan.scan_start_time)}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={formatDateTime(scan.created_at)} placement="top">
                                    <span>{formatRelativeTime(scan.created_at)}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                                {scan.scan_result_detail?.filter(p => p.status === 'open').length || 0}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClientPortScanList;