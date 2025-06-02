import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import Dialog from '@mui/material/Dialog';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteClient, fetchClients, fetchClientStats, resetDeleteStatus } from '../clientSlice'

const ClientDetailDisplay = ({ client }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { deleteStatus, deleteError } = useSelector((state) => state.clients);

    const {
        id,
        clientName,
        description,
        organizationType,
        headQuarter,
        adminName,
        adminEmail,
        primaryColor,
        secondaryColor,
        createdAt,
        updatedAt,
    } = client;

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const isValidDate = (date) => date !== '0001-01-01T00:00:00Z';
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });


    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };


    const handleNavigateToTenant = () => {
        navigate(`/tenant/${id}/login`);
    };

    const handleOpenConfirmDialog = () => {
        dispatch(resetDeleteStatus());
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleConfirmDelete = () => {
        if (id) {
            dispatch(deleteClient(id)).then((result) => {
                if (deleteClient.fulfilled.match(result)) {
                    dispatch(fetchClients())
                    dispatch(fetchClientStats())
                } else {
                    console.log("Client not deleted")
                }
            });
        }
        handleCloseConfirmDialog();
    };

    const isLoading = deleteStatus === 'loading';
    const lightPrimaryColor = alpha(primaryColor, 0.1);

    return (
        <>
            <Card
                sx={{
                    maxWidth: 2000,
                    mx: 'auto',
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(primaryColor, 0.2)}`,
                    '&:hover': {
                        boxShadow: 6,
                        transition: 'box-shadow 0.3s ease-in-out'
                    }
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                bgcolor: primaryColor,
                                color: '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            {getInitials(clientName)}
                        </Avatar>
                    }
                    title={
                        <Typography variant="h5" sx={{
                            fontWeight: 'bold',
                            color: primaryColor
                        }}>
                            {clientName}
                        </Typography>
                    }
                    action={
                        <Button
                            variant="contained"
                            onClick={handleNavigateToTenant}
                            sx={{
                                fontWeight: 'medium',
                                backgroundColor: primaryColor,
                                '&:hover': {
                                    backgroundColor: secondaryColor,
                                    transform: 'translateY(-2px)',
                                    transition: 'transform 0.2s'
                                },
                                boxShadow: 2,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Navigate to Tenant Page
                        </Button>
                    }
                    sx={{
                        backgroundColor: lightPrimaryColor,
                        borderBottom: `3px solid ${primaryColor}`,
                        pb: 2
                    }}
                />
                <CardContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Chip
                            label={organizationType}
                            sx={{
                                backgroundColor: secondaryColor,
                                color: '#fff',
                                fontWeight: 'medium',
                                mr: 2
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontStyle: 'italic'
                            }}
                        >
                            Created: {formatDate(createdAt)}
                            {isValidDate(updatedAt) && ` • Updated: ${formatDate(updatedAt)}`}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 3,
                            p: 2,
                            backgroundColor: alpha(secondaryColor, 0.05),
                            borderLeft: `4px solid ${secondaryColor}`,
                            borderRadius: 1
                        }}
                    >
                        {description || 'No description provided.'}
                    </Typography>

                    <Divider sx={{ mb: 3, borderColor: alpha(primaryColor, 0.2) }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    height: '100%',
                                    backgroundColor: alpha(primaryColor, 0.05),
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: alpha(primaryColor, 0.1),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: primaryColor,
                                        fontWeight: 'bold',
                                        mb: 1
                                    }}
                                >
                                    Headquarters
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {headQuarter}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    height: '100%',
                                    backgroundColor: alpha(secondaryColor, 0.05),
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: alpha(secondaryColor, 0.1),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: secondaryColor,
                                        fontWeight: 'bold',
                                        mb: 1
                                    }}
                                >
                                    Admin
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {adminName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {adminEmail}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    mt: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Primary Color
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                backgroundColor: primaryColor,
                                                borderRadius: '50%',
                                                mr: 1,
                                                border: '2px solid #fff',
                                                boxShadow: 1
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {primaryColor}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                        Secondary Color
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                backgroundColor: secondaryColor,
                                                borderRadius: '50%',
                                                mr: 1,
                                                border: '2px solid #fff',
                                                boxShadow: 1
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {secondaryColor}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider' }}>
                    {deleteStatus === 'failed' && (
                        <Typography color="error" variant="caption" sx={{ mr: 'auto' }}>
                            Error: {deleteError || 'Could not delete client.'}
                        </Typography>
                    )}
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                        onClick={handleOpenConfirmDialog}
                        disabled={isLoading}
                    >
                        Delete Client
                    </Button>
                </CardActions>
            </Card>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the client "<strong>{clientName}</strong>"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isLoading}
                        autoFocus
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ClientDetailDisplay;