import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchADUserById, clearSelectedUser } from '../adSlice';
import ADUserDetailDisplay from '../components/ADUserDetailDisplay';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const ADUserDetailPage = () => {
    const { clientId, userDN: encodedUserDN } = useParams(); // Get encoded DN
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedUser,
        userDetailStatus,
        userDetailError,
        connectionDetails // Needed for API call
    } = useSelector((state) => state.ad);

    const userDN = encodedUserDN ? decodeURIComponent(encodedUserDN) : null;

    useEffect(() => {
        if (connectionDetails && userDN && userDetailStatus === 'idle') {
            dispatch(fetchADUserById({ clientId, connectionDetails, dn: userDN }));
        }
        return () => {
            dispatch(clearSelectedUser());
        };
    }, [clientId, connectionDetails, userDN, userDetailStatus, dispatch]);


    let content;

    if (!connectionDetails) {
        content = <ErrorMessage message="Active Directory connection details not found. Please connect first." />;
    } else if (userDetailStatus === 'loading') {
        content = <Loader />;
    } else if (userDetailStatus === 'succeeded' && selectedUser) {
        content = <ADUserDetailDisplay user={selectedUser} />;
    } else if (userDetailStatus === 'failed') {
        content = <ErrorMessage message={userDetailError || 'Could not load user details.'} />;
    } else if (userDetailStatus !== 'loading' && !selectedUser) {
        content = <Typography sx={{ mt: 3 }}>User details not found for the specified DN.</Typography>
    }


    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/tenant/${clientId}/ad/manage/users`)}
                sx={{ mb: 2 }}
            >
                Back to Users
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
                    Active Directory User Details
                </Typography>
                {content}
            </Paper>
        </Box>
    );
};

export default ADUserDetailPage;