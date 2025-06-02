import React from 'react';
import { useSelector } from 'react-redux';
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
import ErrorAnimation from '../../../components/loading/error'
import NotFoundAnimation from '../../../components/loading/notFound'
import LoadingAnimation from '../../../components/loading/loading';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip'; // To display country code nicely
import { formatDateTime, formatRelativeTime } from '../../../utils/formatting'; // Adjust path

// Accept clientId and onLookupSelect for future detail view link/action
const ClientIpLookupList = ({ clientId, onLookupSelect }) => {
    const { ipLookups, ipLookupStatus, ipLookupError } = useSelector((state) => state.clients);
    const handleRowClick = (lookupId) => {
        if (onLookupSelect) {
            onLookupSelect(lookupId);
            // Example for future: navigate(`/clients/${clientId}/lookup/${lookupId}`);
        }
        console.log("IP Lookup Row clicked (implement detail view):", lookupId);
    };

    if (ipLookupStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingAnimation />
        </Box>;
    }

    if (ipLookupStatus === 'failed') {
        return <ErrorAnimation message={ipLookupError || 'Failed to load IP Lookup list.'} />;
    }

    if (!ipLookups || ipLookups.length === 0) {
        return <NotFoundAnimation message='No IP Lookup history found for this client.' />
    }

    return (
        <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>IP Lookup History</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="client ip lookup list table">
                    <TableHead sx={{ backgroundColor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>Target Queried</TableCell>
                            <TableCell>Resolved IP</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>ISP</TableCell>
                            <TableCell>Organization</TableCell>
                            <TableCell>Lookup Time</TableCell>
                            <TableCell>Queried By (ID)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ipLookups.map((lookup) => (
                            <TableRow
                                key={lookup.id}
                                hover
                                onClick={() => handleRowClick(lookup.id)}
                                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }} title={lookup.target}>
                                        {lookup.target}
                                    </Typography>
                                </TableCell>
                                <TableCell>{lookup.ip}</TableCell>
                                <TableCell>
                                    {lookup.geo_info?.country && (
                                        <Chip
                                            label={lookup.geo_info.country}
                                            size="small"
                                            variant="outlined"
                                            title={lookup.geo_info.country_code}
                                            sx={{ mr: 0.5 }}
                                        />
                                    )}
                                    {lookup.geo_info?.country_code}
                                </TableCell>
                                <TableCell>{lookup.geo_info?.city || '-'}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }} title={lookup.geo_info?.isp}>
                                        {lookup.geo_info?.isp || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }} title={lookup.geo_info?.organization}>
                                        {lookup.geo_info?.organization || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={formatDateTime(lookup.created_at)} placement="top">
                                        <span>{formatRelativeTime(lookup.created_at)}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{lookup.created_by}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ClientIpLookupList;