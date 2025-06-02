import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddUserForm from '../components/AddUserForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const AddUserPage = () => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/tenant/${clientId}/users/list`)}
                    sx={{ mr: 2 }}
                >
                    Back to Users
                </Button>
            </Box>
            <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 700, margin: 'auto' }}>
                <Typography variant="h5" component="h1" align='center'>
                    Add New User
                </Typography>
                <AddUserForm />
            </Paper>
        </Box>
    );
};

export default AddUserPage;