import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchADGroups } from '../adSlice';
import ADGroupsTable from '../components/ADGroupsTable';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

const ADGroupsPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        groups,
        groupsStatus,
        groupsError,
        connectionDetails // Needed to fetch groups
    } = useSelector((state) => state.ad);

    useEffect(() => {
        // Fetch groups only if connected and haven't fetched yet or need refresh
        if (connectionDetails && groupsStatus === 'idle') {
            dispatch(fetchADGroups({ clientId, connectionDetails }));
        }
        // Add dependency on connectionDetails to refetch if connection changes (might not be needed if disconnect clears data)
    }, [clientId, connectionDetails, groupsStatus, dispatch]);

    let content;

    if (groupsStatus === 'loading') {
        content = <Loader />;
    } else if (groupsStatus === 'succeeded') {
        content = <ADGroupsTable groups={groups} />;
    } else if (groupsStatus === 'failed') {
        content = <ErrorMessage message={groupsError} />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* Title can be inferred from the Tab */}
                {/* <Typography variant="h6" component="h2"> Active Directory Groups </Typography> */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to={`/tenant/${clientId}/ad/manage/groups/add`} // Link to Add Group page
                >
                    Add Group
                </Button>
            </Box>
            {content}
        </Box>
    );
};

export default ADGroupsPage;