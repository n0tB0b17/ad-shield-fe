import React from 'react';
import AddADGroupForm from '../components/ADAddGroupForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

const AddADGroupPage = () => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    return (
        <Box sx={{ maxWidth: 700, margin: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/tenant/${clientId}/ad/manage/groups`)}
                sx={{ mb: 2 }}
            >
                Back to Groups
            </Button>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Add New Active Directory Group
                </Typography>
                <AddADGroupForm />
            </Paper>
        </Box>
    );
};

export default AddADGroupPage;