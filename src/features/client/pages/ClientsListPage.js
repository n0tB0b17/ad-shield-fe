import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClients, fetchClientStats } from '../clientSlice';
import ClientListTable from '../components/ClientListTable';
import LoadingAnimation from '../../../components/loading/loading'
import ErrorAnimation from '../../../components/loading/error'
import NotFoundAnimation from '../../../components/loading/notFound';
import ClientStatsOverview from '../components/ClientStatsOverview';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

const ClientsListPage = () => {
    const dispatch = useDispatch();
    const { items: clients, status, error } = useSelector((state) => state.clients);
    const { clientStatsStatus } = useSelector((state) => state.clients);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchClients());
        }

        if (clientStatsStatus === 'idle') {
            dispatch(fetchClientStats());
        }
    }, [status, clientStatsStatus, dispatch]);

    let content;
    if (status === 'loading') {
        content = <LoadingAnimation />;
    } else if (status === 'succeeded') {
        content = <ClientListTable clients={clients} />;
    } else if (clients.length === 0) {
        content = <NotFoundAnimation message='client not found' />
    } else if (status === 'failed') {
        content = <ErrorAnimation message={error} />;
    }

    return (
        <div>
            <ClientStatsOverview />
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/clients/add"
                >
                    Add New Client
                </Button>
            </Box>
            {content}
        </div>
    );
};

export default ClientsListPage;