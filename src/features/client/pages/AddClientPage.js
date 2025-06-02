import React from 'react';
import ClientAddForm from '../components/ClientAddForm';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';


const AddClientPage = () => {
    const navigate = useNavigate();

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
            </Box>
            <ClientAddForm />
        </div>
    );
};

export default AddClientPage;