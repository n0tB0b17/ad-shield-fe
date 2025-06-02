import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchADOUs } from '../adSlice';
import ADOUsTable from '../components/ADOuTable';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';

const ADOUsPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const {
        ous,
        ousStatus,
        ousError,
        connectionDetails,
        isConnected,
        addOUStatus
    } = useSelector((state) => state.ad);

    useEffect(() => {
        if (isConnected && connectionDetails && ousStatus === 'idle') {
            dispatch(fetchADOUs({ clientId, connectionDetails }));
        }
    }, [clientId, isConnected, connectionDetails, ousStatus, dispatch]);

    let content;

    if (!isConnected || !connectionDetails) {
        content = <Alert severity="warning">Active Directory connection not established. Please connect first.</Alert>;
    } else if (ousStatus === 'loading') {
        content = <Loader />;
    } else if (ousStatus === 'succeeded') {
        content = <ADOUsTable ous={ous} />;
    } else if (ousStatus === 'failed') {
        content = <ErrorMessage message={ousError} />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* <Box /> */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to={`/tenant/${clientId}/ad/manage/ou/add`}
                    disabled={!isConnected || !connectionDetails}
                >
                    Add OU
                </Button>
            </Box>
            {content}
        </Box>
    );
};

export default ADOUsPage;