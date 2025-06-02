import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { formatDistanceToNowStrict } from 'date-fns';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import Tooltip from '@mui/material/Tooltip'; // Optional: for better UX
import { deleteLookupById, resetDeleteStatus } from '../ipLookupSlice';
import NotFoundAnimation from '../../../../../components/loading/notFound'
import ErrorAnimation from '../../../../../components/loading/error'

const IpLookupHistoryTable = ({ lookupHistory }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { deleteStatus, deleteError } = useSelector((state) => state.ipLookup);

    useEffect(() => {
        setTimeout(() => {
            dispatch(resetDeleteStatus())
        }, 3000)
    }, [dispatch, resetDeleteStatus])

    const handleRowClick = (lookupId) => {
        if (lookupId) {
            navigate(`/tenant/${clientId}/ip-lookup/detail/${lookupId}`);
        }
    };

    const handleDeleteClick = (event, lookupId) => {
        event.stopPropagation();
        if (clientId && lookupId) {
            dispatch(deleteLookupById({ clientId, lookupId }));
        }

    };

    if (!lookupHistory || lookupHistory.length === 0) {
        return <NotFoundAnimation message='No lookup history found.' />
    }

    let errorContent;
    if (deleteStatus === "failed") {
        errorContent = <ErrorAnimation message={deleteError || "unable to delete ip-lookup history"} />
    }

    return (
        <TableContainer component={Paper}>
            {errorContent}
            <Table sx={{ minWidth: 650 }} aria-label="ip lookup history table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Target Queried</TableCell>
                        <TableCell>Resolved IP</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>ISP / Organization</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lookupHistory.slice().reverse().map((lookup) => ( // Show newest first
                        <TableRow
                            key={lookup.id}
                            hover
                            onClick={() => { handleRowClick(lookup.id) }}
                            sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Chip label={lookup.target} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{lookup.ip || '-'}</TableCell>
                            <TableCell>{lookup.countryCode || '-'}</TableCell>
                            <TableCell>{lookup.isp || '-'}</TableCell>
                            <TableCell>
                                {lookup.createdAt ? formatDistanceToNowStrict(new Date(lookup.createdAt), { addSuffix: true }) : '-'}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Delete Record">
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        color="error"
                                        onClick={(event) => handleDeleteClick(event, lookup.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    {/* </span> */}

                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default IpLookupHistoryTable;