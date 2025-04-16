import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClients } from '../clientSlice';
import ClientListTable from '../components/ClientListTable';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

const ClientsListPage = () => {
    const dispatch = useDispatch();
    const { items: clients, status, error } = useSelector((state) => state.clients);

    useEffect(() => {
        // Fetch clients only if they haven't been fetched successfully yet
        if (status === 'idle') {
            dispatch(fetchClients());
        }
    }, [status, dispatch]);

    let content;

    if (status === 'loading') {
        content = <Loader />;
    } else if (status === 'succeeded') {
        content = <ClientListTable clients={clients} />;
    } else if (status === 'failed') {
        content = <ErrorMessage message={error} />;
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Add clients
                </Typography>
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