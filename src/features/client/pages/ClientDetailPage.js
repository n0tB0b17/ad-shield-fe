import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientById, clearSelectedClient } from '../clientSlice';
import ClientDetailDisplay from '../components/ClientDetailDisplay';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';


const ClientDetailPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedClient, status, error } = useSelector((state) => state.clients);

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClientById(clientId));
        }
        // Cleanup function to clear selected client when component unmounts
        return () => {
            dispatch(clearSelectedClient());
        }
    }, [clientId, dispatch]);

    let content;

    if (status === 'loading') {
        content = <Loader />;
    } else if (status === 'succeeded' && selectedClient) {
        content = <ClientDetailDisplay client={selectedClient} />;
    } else if (status === 'failed') {
        content = <ErrorMessage message={error || 'Could not load client details.'} />;
    } else if (status !== 'loading') {
        // Handle case where fetching finished but client is null (e.g., not found)
        content = <Typography sx={{ mt: 3 }}>Client not found.</Typography>
    }

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/clients')}
                    sx={{ mr: 2 }}
                >
                    Back to List
                </Button>
                <Typography variant="h4" component="h1">
                    Client Details
                </Typography>
            </Box>
            {content}
        </div>
    );
};

export default ClientDetailPage;