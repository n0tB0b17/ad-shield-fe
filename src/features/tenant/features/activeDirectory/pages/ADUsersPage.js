import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchADUsers } from '../adSlice';
import ADUsersTable from '../components/ADUsersTable';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';

const ADUsersPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        users,
        usersStatus, // This status will be reset to 'idle' after successful user add
        usersError,
        connectionDetails,
        isConnected
    } = useSelector((state) => state.ad);

    useEffect(() => {
        // Fetch users if:
        // 1. Connected and connection details exist
        // 2. usersStatus is 'idle' (initial load or after successful addUser which resets usersStatus)
        if (isConnected && connectionDetails && usersStatus === 'idle') {
            dispatch(fetchADUsers({ clientId, connectionDetails }));
        }
    }, [clientId, isConnected, connectionDetails, usersStatus, dispatch]);

    let content;

     if (!isConnected || !connectionDetails) {
        content = <Alert severity="warning">Active Directory connection not established. Please connect first.</Alert>;
    } else if (usersStatus === 'loading') {
        content = <Loader />;
    } else if (usersStatus === 'succeeded') {
        content = <ADUsersTable users={users} />;
    } else if (usersStatus === 'failed') {
        content = <ErrorMessage message={usersError} />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box /> 
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to={`/tenant/${clientId}/ad/manage/users/add`}
                    disabled={!isConnected || !connectionDetails}
                >
                    Add User
                </Button>
            </Box>
            {content}
        </Box>
    );
};

export default ADUsersPage;