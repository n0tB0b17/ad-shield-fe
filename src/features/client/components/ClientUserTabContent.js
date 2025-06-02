// src/features/client/components/ClientUserTabContent.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import {
    fetchClientUsers,
    fetchClientUserStats,
    fetchClientUserDetailStats,
    clearSelectedUser // Action to clear detail state
} from '../clientSlice';
import ClientUserStats from './ClientUserStats';
import ClientUserList from './ClientUserList';
import ClientUserDetail from './ClientUserDetail';
import Loader from '../../../components/common/Loader';

const ClientUserTabContent = ({ clientId }) => {
    const dispatch = useDispatch();
    const { userStatus, userStatsStatus } = useSelector((state) => state.clients);

    // Local state to manage which view is active (list or detail)
    const [selectedUser, setSelectedUser] = useState(null); // Store the basic user object

    // Fetch overall stats and list when component mounts or clientId changes
    useEffect(() => {
        if (clientId) {
            if (userStatsStatus === 'idle') {
                dispatch(fetchClientUserStats(clientId));
            }
            if (userStatus === 'idle') {
                dispatch(fetchClientUsers(clientId));
            }
        }

    }, [clientId, userStatus, userStatsStatus, dispatch]);

    // Fetch detail stats when a user is selected
    useEffect(() => {
        if (selectedUser?.id && clientId) {
            // Fetch details for the selected user
            dispatch(fetchClientUserDetailStats({ clientId, userId: selectedUser.id }));
        }
    }, [selectedUser, clientId, dispatch]);

    const handleUserSelect = (user) => {
        setSelectedUser(user); // Set the selected user locally
    };

    const handleBackToList = () => {
        setSelectedUser(null); // Clear local selection
        dispatch(clearSelectedUser()); // Clear detail state in Redux
    };

    // Determine initial loading state
    const isLoadingInitial = (userStatus === 'idle' || userStatsStatus === 'idle') ||
                             (userStatus === 'loading' || userStatsStatus === 'loading');

    if (isLoadingInitial && !selectedUser) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><Loader /></Box>;
    }

    return (
        <Box>
            {selectedUser ? (
                // Render Detail View
                <ClientUserDetail
                    user={selectedUser}
                    onBackToList={handleBackToList}
                />
            ) : (
                 // Render List and Stats View
                <>
                    <ClientUserStats />
                    <ClientUserList
                        clientId={clientId}
                        onUserSelect={handleUserSelect}
                    />
                </>
            )}
        </Box>
    );
};

export default ClientUserTabContent;