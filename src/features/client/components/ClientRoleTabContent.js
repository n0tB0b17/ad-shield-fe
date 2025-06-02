import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import {
    fetchClientRoles,
    fetchClientRoleStats,
    resetRoleMutationStatus,
    deleteClientRole
} from '../clientSlice';
import ClientRoleStats from './ClientRoleStats';
import ClientRoleList from './ClientRoleList';
import Loader from '../../../components/loading/loading';
import AddRoleModal from './AddRoleModal';
import ConfirmationModal from '../../../components/common/Confirmation';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';

const ClientRoleTabContent = ({ clientId }) => {
    const dispatch = useDispatch();
    const {
        roleStatus,
        roleStatsStatus,
        addRoleStatus,
        deleteRoleStatus,
        deleteRoleError
    } = useSelector((state) => state.clients);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null); // Store ID of role to delete

    useEffect(() => {
        if (clientId) {
            if (roleStatsStatus === 'idle') {
                dispatch(fetchClientRoleStats(clientId));
            }
            if (roleStatus === 'idle') {
                dispatch(fetchClientRoles(clientId));
            }
        }
    }, [clientId, roleStatus, roleStatsStatus, dispatch]);

    useEffect(() => {
        if (!confirmModalOpen && (deleteRoleStatus === 'succeeded' || deleteRoleStatus === 'failed')) {
            dispatch(resetRoleMutationStatus());
            setRoleToDelete(null); // Clear the role ID
        }
    }, [confirmModalOpen, deleteRoleStatus, dispatch]);

    const handleOpenAddModal = () => setAddModalOpen(true);
    const handleCloseAddModal = () => setAddModalOpen(false);

    const handleOpenConfirmModal = (roleId) => {
        setRoleToDelete(roleId);
        setConfirmModalOpen(true);
    };
    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (roleToDelete) {
            dispatch(deleteClientRole({ clientId, roleId: roleToDelete }))
                .unwrap()
                .then(() => {
                    console.log("Role deleted successfully");
                    dispatch(fetchClientRoleStats(clientId));
                })
                .catch((error) => {
                    console.error("Failed to delete role:", error);
                })
                .finally(() => {
                    setConfirmModalOpen(false);
                });
        }
    };

    const isLoadingInitial = (roleStatus === 'idle' || roleStatsStatus === 'idle') ||
        (roleStatus === 'loading' || roleStatsStatus === 'loading');

    if (isLoadingInitial) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><Loader message='loading roles...' /></Box>;
    }

    return (
        <Box>
            <ClientRoleStats />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 1, pb: 1 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddModal}
                    disabled={addRoleStatus === 'loading'}
                >
                    Add Role
                </Button>
            </Box>

            {deleteRoleStatus === 'failed' && deleteRoleError && (
                <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
                    Failed to delete role: {deleteRoleError}
                </Alert>
            )}


            <ClientRoleList
                clientId={clientId}
                onRoleSelect={(role) => console.log("Selected Role:", role)}
                onDeleteClick={handleOpenConfirmModal} 
            />

            <AddRoleModal
                open={addModalOpen}
                onClose={handleCloseAddModal}
                clientId={clientId}
            />

            <ConfirmationModal
                open={confirmModalOpen}
                onClose={handleCloseConfirmModal}
                onConfirm={handleDeleteConfirm}
                title="Confirm Deletion"
                message={`Are you sure you want to delete this role? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={deleteRoleStatus === 'loading'}
            />
        </Box>
    );
};

export default ClientRoleTabContent;