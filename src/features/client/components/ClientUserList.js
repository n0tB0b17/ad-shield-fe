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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { formatDateTime, formatRelativeTime } from '../../../utils/formatting'; // Adjust path
import LoadingAnimation from '../../../components/loading/loading'
import ErrorAnimation from '../../../components/loading/error'
import NotFound from '../../../components/loading/notFound'

// Accept clientId and onUserSelect for detail view action
const ClientUserList = ({ clientId, onUserSelect }) => {
    const { users, userStatus, userError } = useSelector((state) => state.clients);

    const handleRowClick = (user) => {
        if (onUserSelect) {
            onUserSelect(user); // Pass the whole user object
        }
    };

    if (userStatus === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <LoadingAnimation message='loading users data...' />
        </Box>;
    }

    if (userStatus === 'failed') {
        return <ErrorAnimation message={userError || 'Failed to load user list.'} />;
    }

    if (!users || users.length === 0) {
        return <NotFound message='No users found for this client.' />
    }

    return (
        <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Client Users</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="client user list table">
                    <TableHead sx={{ backgroundColor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Role ID</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                hover
                                onClick={() => handleRowClick(user)}
                                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.userName}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.firstName || '-'}</TableCell>
                                <TableCell>{user.lastName || '-'}</TableCell>
                                <TableCell>
                                    <Tooltip title="Role lookup needed for name" placement="top">
                                        <span>{user.roleId}</span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={formatDateTime(user.createdAt)} placement="top">
                                        <span>{formatRelativeTime(user.createdAt)}</span>
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

export default ClientUserList;