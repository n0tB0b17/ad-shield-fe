import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchAllUsers, deleteUser, resetDeleteStatus } from '../usersSlice';
import UserListTable from '../components/UserListTable';
import DeleteUserConfirmationDialog from '../components/DeleteUserConfirmationDialog';
import LoadingAnimation from '../../../../../components/loading/loading';
import ErrorMessageAnimation from '../../../../../components/loading/error';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert'; // For delete feedback
import SuccessRedirectAnimation from '../../../../../components/loading/success';

const UsersListPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        list: users,
        listStatus,
        listError,
        deleteStatus, // Track delete status
        deleteError
    } = useSelector((state) => state.users);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState({ id: null, name: '' });

    // Fetch users
    useEffect(() => {
        if (clientId && listStatus === 'idle') {
            dispatch(fetchAllUsers(clientId));
        }
    }, [clientId, listStatus, dispatch]);

    // Reset delete status when component mounts or status changes
    useEffect(() => {
        if (deleteStatus === 'failed' || deleteStatus === 'succeeded') {
            const timer = setTimeout(() => {
                dispatch(resetDeleteStatus());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [deleteStatus, dispatch]);


    const handleDeleteRequest = (userId, userName) => {
        setUserToDelete({ id: userId, name: userName });
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setUserToDelete({ id: null, name: '' }); // Reset selection
    };

    const handleConfirmDelete = () => {
        if (userToDelete.id) {
            dispatch(deleteUser({ clientId, userId: userToDelete.id }));
        }
        handleCloseDeleteDialog(); // Close dialog immediately
    };

    let content;

    if (listStatus === 'loading') {
        content = <LoadingAnimation message='loading users...' />;
    } else if (listStatus === 'succeeded') {
        content = <UserListTable users={users} onDeleteClick={handleDeleteRequest} />;
    } else if (listStatus === 'failed') {
        content = <ErrorMessageAnimation message={listError} />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Manage Users
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to={`/tenant/${clientId}/users/add`} // Link to add page
                >
                    Add User
                </Button>
            </Box>

            {deleteStatus === 'succeeded' && <SuccessRedirectAnimation message='User deleted successfully.' />}
            {deleteStatus === 'failed' && <ErrorMessageAnimation message={deleteError || 'Failed to delete user.'} />}


            {content}

            <DeleteUserConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                userName={userToDelete.name}
            />
        </Box>
    );
};

export default UsersListPage;