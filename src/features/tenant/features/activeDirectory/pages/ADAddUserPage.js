import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddADUserForm from '../components/ADAddUserForm';

const AddADUserPage = () => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/tenant/${clientId}/ad/manage/users`)}
                sx={{ mb: 2 }}
            >
                Back to Users
            </Button>
            <Paper sx={{ p: { xs: 2, md: 3 } }}> {/* Responsive padding */}
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Add New Active Directory User
                </Typography>
                <AddADUserForm />
            </Paper>
        </Box>
    );
};

export default AddADUserPage;