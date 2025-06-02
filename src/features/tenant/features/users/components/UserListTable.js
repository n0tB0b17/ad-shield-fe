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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // For future update functionality
import { formatDistanceToNowStrict } from 'date-fns';

// Accept onDeleteClick prop from parent page
const UserListTable = ({ users, onDeleteClick }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    const handleRowClick = (userId) => {
        navigate(`/tenant/${clientId}/users/detail/${userId}`);
    };

    const handleDelete = (event, userId, userName) => {
        event.stopPropagation(); // Prevent row click when clicking icon
        onDeleteClick(userId, userName); // Pass ID and name up
    };

    const handleEdit = (event, userId) => {
        event.stopPropagation();
        // Navigate to an edit page (implement later)
        // navigate(`/tenant/${clientId}/users/edit/${userId}`);
        alert(`Edit user ${userId} - Feature coming soon!`);
    };


    if (!users || users.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No users found for this tenant.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role ID</TableCell> {/* Display Role ID for now */}
                        <TableCell>Contact</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.id}
                            hover
                            onClick={() => handleRowClick(user.id)}
                            sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {user.userName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{user.roleId}</TableCell>
                            <TableCell>{user.contactNumber || '-'}</TableCell>
                            <TableCell>
                                {user.createdAt ? formatDistanceToNowStrict(new Date(user.createdAt), { addSuffix: true }) : '-'}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Delete User">
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={(e) => handleDelete(e, user.id, user.userName)}
                                        color="error"
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserListTable;