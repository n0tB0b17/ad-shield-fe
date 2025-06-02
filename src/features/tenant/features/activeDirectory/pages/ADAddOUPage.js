import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddADOUForm from '../components/ADAddOUForm';

const AddADOUPage = () => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    return (
        <Box sx={{ maxWidth: 700, margin: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/tenant/${clientId}/ad/manage/ou`)} 
                sx={{ mb: 2 }}
            >
                Back to Organizational Units
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Add New Organizational Unit (OU)
                </Typography>
                <AddADOUForm />
            </Paper>
        </Box>
    );
};

export default AddADOUPage;