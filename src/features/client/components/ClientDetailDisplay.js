import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

const ClientDetailDisplay = ({ client }) => {
    const navigate = useNavigate();
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

    // Handle invalid updatedAt date
    const isValidDate = (date) => date !== '0001-01-01T00:00:00Z';
    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Get initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Function to handle navigation to tenant login
    const handleNavigateToTenant = () => {
        navigate(`/tenant/${id}/login`);
    };

    // Generate a lighter shade of primary color for backgrounds
    const lightPrimaryColor = alpha(primaryColor, 0.1);

    return (
        <Card
            sx={{
                maxWidth: 800,
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
        </Card>
    );
};

export default ClientDetailDisplay;