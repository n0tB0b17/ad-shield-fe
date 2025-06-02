import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchADGroupById, clearSelectedGroup } from '../adSlice';
import ADGroupDetailDisplay from '../components/ADGroupDetailDisplay';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const ADGroupDetailPage = () => {
    const { clientId, groupDN: encodedGroupDN } = useParams(); // Get encoded DN
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedGroup,
        groupDetailStatus,
        groupDetailError,
        connectionDetails // Needed for API call
    } = useSelector((state) => state.ad);

    // Decode the DN from the URL parameter
    const groupDN = encodedGroupDN ? decodeURIComponent(encodedGroupDN) : null;

    useEffect(() => {
        // Fetch only if we have connection details, a valid DN, and haven't fetched yet
        if (connectionDetails && groupDN && groupDetailStatus === 'idle') {
            dispatch(fetchADGroupById({ clientId, connectionDetails, dn: groupDN }));
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearSelectedGroup());
        };
    }, [clientId, connectionDetails, groupDN, groupDetailStatus, dispatch]);


    let content;

    if (!connectionDetails) {
        content = <ErrorMessage message="Active Directory connection details not found. Please connect first." />;
    } else if (groupDetailStatus === 'loading') {
        content = <Loader />;
    } else if (groupDetailStatus === 'succeeded' && selectedGroup) {
        content = <ADGroupDetailDisplay group={selectedGroup} />;
    } else if (groupDetailStatus === 'failed') {
        content = <ErrorMessage message={groupDetailError || 'Could not load group details.'} />;
    } else if (groupDetailStatus !== 'loading' && !selectedGroup) {
        content = <Typography sx={{ mt: 3 }}>Group details not found for the specified DN.</Typography>
    }


    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/tenant/${clientId}/ad/manage/groups`)}
                sx={{ mb: 2 }}
            >
                Back to Groups
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
                    Active Directory Group Details
                </Typography>
                {content}
            </Paper>
        </Box>
    );
};

export default ADGroupDetailPage;