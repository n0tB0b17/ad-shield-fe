import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Updated imports from usersSlice
import { fetchUserById, clearSelectedUser, fetchUserStats, clearUserStats, resetUpdateStatus } from '../usersSlice';
import UserDetailDisplay from '../components/UserDetailDisplay';
import UserStatsSection from '../components/UserStatsSection';
import EditUserModal from '../components/EditUserModal';
import Loader from '../../../../../components/loading/loading';
import ErrorMessage from '../../../../../components/loading/error';
import NotFoundAnimation from '../../../../../components/loading/notFound';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert'; // For update feedback

const UserDetailPage = () => {
    const { clientId, userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedUser,
        detailStatus,
        detailError,
        updateStatus,
        updateError,
        roles
    } = useSelector((state) => state.users);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (clientId && userId) {
            dispatch(fetchUserById({ clientId, userId }));
            dispatch(fetchUserStats({ clientId, userId }));
        }
    
        return () => {
            dispatch(clearSelectedUser()); 
            dispatch(resetUpdateStatus());
        };
    }, [clientId, userId, dispatch]);

    useEffect(() => {
        if (updateStatus === 'failed' || updateStatus === 'succeeded') {
            const timer = setTimeout(() => {
                dispatch(resetUpdateStatus());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [updateStatus, dispatch]);

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };


    let detailContent;
    if (detailStatus === 'loading') {
        detailContent = <Loader message="loading user's content" />;
    } else if (detailStatus === 'succeeded' && selectedUser) {
        detailContent = <UserDetailDisplay userData={selectedUser} onEditClick={handleOpenEditModal} />;
    } else if (detailStatus === 'failed') {
        detailContent = <ErrorMessage message={detailError || 'Could not load user details.'} />;
    } else if (detailStatus !== 'loading' && !selectedUser) {
        detailContent = <NotFoundAnimation message="User details not found." />
    }


    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/tenant/${clientId}/users/list`)} sx={{ mr: 2 }}>
                        Back to Users
                    </Button>
                </Box>
            </Box>

            {updateStatus === 'succeeded' && <Alert severity="success" sx={{ mb: 2 }}>User updated successfully.</Alert>}
            {updateStatus === 'failed' && <Alert severity="error" sx={{ mb: 2 }}>{updateError || 'Failed to update user.'}</Alert>}

            <UserStatsSection userId={userId} />

            <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, mt: 3 }}>
                {detailContent}
            </Paper>

            {selectedUser && (
                <EditUserModal
                    open={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    currentUserData={selectedUser}
                />
            )}
        </Box>
    );
};

export default UserDetailPage;