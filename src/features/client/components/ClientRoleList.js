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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import { formatDateTime, formatRelativeTime } from '../../../utils/formatting';
import LoadingAnimation from '../../../components/loading/loading'
import ErrorAnimation from '../../../components/loading/error'
import NotFound from '../../../components/loading/notFound'

// Accept clientId and onRoleSelect for future detail view action
const ClientRoleList = ({ clientId, onRoleSelect, onDeleteClick }) => {
    const { roles, roleStatus, roleError } = useSelector((state) => state.clients);

    const handleRowClick = (role) => {
        if (onRoleSelect) {
            onRoleSelect(role); // Pass the whole role object
        }
    };

    const handleDelete = (event, roleId) => {
        event.stopPropagation();
        if (onDeleteClick) {
            onDeleteClick(roleId);
        }
    };

    if (roleStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingAnimation message='loading client roles list' />
        </Box>;
    }

    if (roleStatus === 'failed') {
        return <ErrorAnimation message={roleError || 'Failed to load role list.'} />;
    }

    if (!roles || roles.length === 0) {
        return <NotFound message='user roles not found' />;
    }

    return (
        <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Client Roles</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="client role list table">
                    <TableHead sx={{ backgroundColor: 'grey.200' }}>
                        <TableRow>
                            <TableCell sx={{ width: '15%' }}>Role Name</TableCell>
                            <TableCell sx={{ width: '25%' }}>Description</TableCell>
                            {/* Adjusted width for Permissions */}
                            <TableCell sx={{ width: '30%' }}>Permissions</TableCell>
                            <TableCell sx={{ width: '10%' }}>Created At</TableCell>
                            <TableCell sx={{ width: '10%' }}>Last Updated</TableCell>
                            <TableCell align="right" sx={{ width: '10%' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow
                                key={role.id}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"> {role.name} </TableCell>
                                <TableCell> {/* Description */}
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 250 }} title={role.description}>
                                        {role.description || '-'}
                                    </Typography>
                                </TableCell>

                                {/* === MODIFIED PERMISSIONS CELL === */}
                                <TableCell>
                                    {role.permissions && role.permissions.length > 0 ? (
                                        // Use Box for flex wrapping
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 60, overflowY: 'auto' }}>
                                            {role.permissions.map((permission) => (
                                                <Chip
                                                    key={permission}
                                                    label={permission}
                                                    size="small"
                                                    variant="outlined" // Use outlined or default based on preference
                                                    sx={{ mr: 0.5, mb: 0.5 }} // Add some margin
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        // Display a dash or 'None' if no permissions
                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                    )}
                                </TableCell>
                                {/* === END MODIFIED CELL === */}

                                <TableCell> {/* Created At */}
                                    <Tooltip title={formatDateTime(role.created_at)} placement="top">
                                        <span>{formatRelativeTime(role.created_at)}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell> {/* Updated At */}
                                    {role.updated_at && !role.updated_at.startsWith('0001') ? (
                                        <Tooltip title={formatDateTime(role.updated_at)} placement="top">
                                            <span>{formatRelativeTime(role.updated_at)}</span>
                                        </Tooltip>
                                    ) : ('-')}
                                </TableCell>
                                <TableCell align="right"> {/* Action Column */}
                                    <Tooltip title="Delete Role">
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            color="error"
                                            onClick={(event) => handleDelete(event, role.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
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

export default ClientRoleList;