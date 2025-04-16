import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addClient, resetAddClientStatus } from '../clientSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import InputAdornment from '@mui/material/InputAdornment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';

const ClientAddForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addClientStatus, addClientError } = useSelector((state) => state.clients);

    const [formData, setFormData] = useState({
        clientName: '',
        description: '',
        organizationType: '',
        headQuarter: '',
        adminUserName: '',
        adminEmail: '',
        adminPassword: '',
        primaryColorHex: '#007BFF', // Default color
        secondaryColorHex: '#6C757D', // Default color
    });

    const [formErrors, setFormErrors] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Organization Details', 'Admin Information', 'Branding'];

    // Reset status when component unmounts or on successful submission
    useEffect(() => {
        return () => {
            dispatch(resetAddClientStatus());
        };
    }, [dispatch]);

    // Handle successful submission
    useEffect(() => {
        if (addClientStatus === 'succeeded') {
            navigate('/clients'); // Redirect to client list
            // Optionally show a success message before redirecting
        }
    }, [addClientStatus, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Basic validation clear on change
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const errors = {};

        if (step === 0) {
            if (!formData.clientName.trim()) errors.clientName = 'Client Name is required';
            if (!formData.description.trim()) errors.description = 'Description is required';
            if (!formData.organizationType.trim()) errors.organizationType = 'Organization Type is required';
            if (!formData.headQuarter.trim()) errors.headQuarter = 'Headquarter is required';
        } else if (step === 1) {
            if (!formData.adminUserName.trim()) errors.adminUserName = 'Admin Username is required';
            if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errors.adminEmail = 'Email address is invalid';
            if (!formData.adminPassword) errors.adminPassword = 'Admin Password is required';
            else if (formData.adminPassword.length < 8) errors.adminPassword = 'Password must be at least 8 characters';
        } else if (step === 2) {
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.primaryColorHex)) errors.primaryColorHex = 'Invalid HEX color';
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.secondaryColorHex)) errors.secondaryColorHex = 'Invalid HEX color';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Returns true if no errors
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.clientName.trim()) errors.clientName = 'Client Name is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.organizationType.trim()) errors.organizationType = 'Organization Type is required';
        if (!formData.headQuarter.trim()) errors.headQuarter = 'Headquarter is required';
        if (!formData.adminUserName.trim()) errors.adminUserName = 'Admin Username is required';
        if (!formData.adminEmail.trim()) errors.adminEmail = 'Admin Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) errors.adminEmail = 'Email address is invalid';
        if (!formData.adminPassword) errors.adminPassword = 'Admin Password is required';
        else if (formData.adminPassword.length < 8) errors.adminPassword = 'Password must be at least 8 characters';
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.primaryColorHex)) errors.primaryColorHex = 'Invalid HEX color';
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(formData.secondaryColorHex)) errors.secondaryColorHex = 'Invalid HEX color';

        setFormErrors(errors);
        return Object.keys(errors).length === 0; // Returns true if no errors
    };

    const handleNextStep = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBackStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
        dispatch(addClient(formData));
    };

    const handleCancel = () => {
        navigate('/clients');
    };

    const getBackgroundColor = (step) => {
        if (step === 2) {
            // For the branding step, show a gradient of the selected colors
            return `linear-gradient(135deg, ${alpha(formData.primaryColorHex, 0.1)} 0%, ${alpha(formData.secondaryColorHex, 0.1)} 100%)`;
        }
        return '#fff';
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: 'transparent',
                            mt: 2
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    color: formData.primaryColorHex
                                }}
                            >
                                <BusinessIcon sx={{ mr: 1 }} />
                                Organization Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="clientName"
                                        label="Client Name"
                                        name="clientName"
                                        autoComplete="organization"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        error={!!formErrors.clientName}
                                        helperText={formErrors.clientName}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="organizationType"
                                        label="Organization Type"
                                        name="organizationType"
                                        value={formData.organizationType}
                                        onChange={handleChange}
                                        error={!!formErrors.organizationType}
                                        helperText={formErrors.organizationType}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CategoryIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        name="description"
                                        multiline
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChange}
                                        error={!!formErrors.description}
                                        helperText={formErrors.description}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="headQuarter"
                                        label="Headquarter Location"
                                        name="headQuarter"
                                        value={formData.headQuarter}
                                        onChange={handleChange}
                                        error={!!formErrors.headQuarter}
                                        helperText={formErrors.headQuarter}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocationOnIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 1:
                return (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: 'transparent',
                            mt: 2
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    color: formData.primaryColorHex
                                }}
                            >
                                <PersonAddIcon sx={{ mr: 1 }} />
                                Administrator Account
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="adminUserName"
                                        label="Admin Username"
                                        name="adminUserName"
                                        autoComplete="username"
                                        value={formData.adminUserName}
                                        onChange={handleChange}
                                        error={!!formErrors.adminUserName}
                                        helperText={formErrors.adminUserName}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="adminEmail"
                                        label="Admin Email Address"
                                        name="adminEmail"
                                        autoComplete="email"
                                        value={formData.adminEmail}
                                        onChange={handleChange}
                                        error={!!formErrors.adminEmail}
                                        helperText={formErrors.adminEmail}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="adminPassword"
                                        label="Admin Password"
                                        type="password"
                                        id="adminPassword"
                                        autoComplete="new-password"
                                        value={formData.adminPassword}
                                        onChange={handleChange}
                                        error={!!formErrors.adminPassword}
                                        helperText={formErrors.adminPassword}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: formData.primaryColorHex,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: formData.primaryColorHex,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            case 2:
                return (
                    <Card
                        elevation={0}
                        sx={{
                            backgroundColor: 'transparent',
                            mt: 2
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    color: formData.primaryColorHex
                                }}
                            >
                                <PaletteIcon sx={{ mr: 1 }} />
                                Brand Colors
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 3,
                                    background: `linear-gradient(135deg, ${formData.primaryColorHex} 0%, ${formData.secondaryColorHex} 100%)`,
                                    color: '#fff',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {formData.clientName || "Your Organization"}
                                </Typography>
                                <Typography variant="body2">
                                    Color Preview
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Primary Color
                                    </Typography>
                                    <TextField
                                        required
                                        fullWidth
                                        name="primaryColorHex"
                                        type="color"
                                        id="primaryColorHex"
                                        value={formData.primaryColorHex}
                                        onChange={handleChange}
                                        error={!!formErrors.primaryColorHex}
                                        helperText={formErrors.primaryColorHex || "This will be used for primary UI elements"}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& input[type="color"]': {
                                                height: '56px',
                                                padding: '0',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                border: 'none',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                                        {formData.primaryColorHex}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Secondary Color
                                    </Typography>
                                    <TextField
                                        required
                                        fullWidth
                                        name="secondaryColorHex"
                                        type="color"
                                        id="secondaryColorHex"
                                        value={formData.secondaryColorHex}
                                        onChange={handleChange}
                                        error={!!formErrors.secondaryColorHex}
                                        helperText={formErrors.secondaryColorHex || "This will be used for accents and highlights"}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& input[type="color"]': {
                                                height: '56px',
                                                padding: '0',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                border: 'none',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                                        {formData.secondaryColorHex}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', fontStyle: 'italic' }}>
                                These colors will define the look and feel of the tenant interface.
                            </Typography>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <Paper
            sx={{
                p: 4,
                maxWidth: 800,
                margin: 'auto',
                mt: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                background: getBackgroundColor(activeStep),
                transition: 'background 0.3s ease'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
                    sx={{ mr: 2 }}
                >
                    Back to clients
                </Button>
                <Typography variant="h5" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    Register New Client/Tenant
                </Typography>
            </Box>

            {addClientStatus === 'failed' && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                    }}
                >
                    {addClientError || 'Failed to add client. Please try again.'}
                </Alert>
            )}

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" noValidate>
                {renderStepContent(activeStep)}

                <Box sx={{ display: 'flex', mt: 4, justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={activeStep === 0 ? handleCancel : handleBackStep}
                        sx={{
                            px: 3,
                            borderColor: alpha(formData.primaryColorHex, 0.5),
                            color: formData.primaryColorHex,
                            '&:hover': {
                                borderColor: formData.primaryColorHex,
                                backgroundColor: alpha(formData.primaryColorHex, 0.04)
                            }
                        }}
                    >
                        {activeStep === 0 ? 'Cancel' : 'Back'}
                    </Button>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={addClientStatus === 'loading'}
                            sx={{
                                px: 4,
                                py: 1,
                                backgroundColor: formData.primaryColorHex,
                                '&:hover': {
                                    backgroundColor: alpha(formData.primaryColorHex, 0.9)
                                }
                            }}
                        >
                            {addClientStatus === 'loading' ? (
                                <CircularProgress size={24} sx={{ color: '#fff' }} />
                            ) : (
                                'Create Client'
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNextStep}
                            sx={{
                                px: 4,
                                py: 1,
                                backgroundColor: formData.primaryColorHex,
                                '&:hover': {
                                    backgroundColor: alpha(formData.primaryColorHex, 0.9)
                                }
                            }}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default ClientAddForm;