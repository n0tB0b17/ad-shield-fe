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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PaletteIcon from '@mui/icons-material/Palette';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Custom color picker boxes
const ColorBox = styled(Box)(({ theme, color }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: color,
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: theme.shadows[2],
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: theme.shadows[4],
    },
}));

// Predefined color palette options
const primaryColorOptions = [
    '#1976D2', // Blue
    '#2E7D32', // Green
    '#C62828', // Red
    '#7B1FA2', // Purple
    '#F57C00', // Orange
    '#00796B', // Teal
    '#212121', // Dark
];

const secondaryColorOptions = [
    '#42A5F5', // Light Blue
    '#81C784', // Light Green
    '#EF5350', // Light Red
    '#BA68C8', // Light Purple
    '#FFB74D', // Light Orange
    '#4DB6AC', // Light Teal
    '#757575', // Gray
];

const ClientAddForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addClientStatus, addClientError } = useSelector((state) => state.clients);

    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Organization Details', 'Admin Account', 'Brand Colors'];

    const [formData, setFormData] = useState({
        clientName: '',
        description: '',
        organizationType: '',
        headQuarter: '',
        adminUserName: '',
        adminEmail: '',
        adminPassword: '',
        primaryColorHex: '#1976D2', // Default color
        secondaryColorHex: '#42A5F5', // Default color
    });

    const [formErrors, setFormErrors] = useState({});
    const [customColorMode, setCustomColorMode] = useState({
        primary: false,
        secondary: false,
    });

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
        }
    }, [addClientStatus, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Basic validation clear on change
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
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

    const validateCompleteForm = () => {
        let valid = true;
        for (let i = 0; i < steps.length; i++) {
            valid = validateStep(i) && valid;
        }
        return valid;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateCompleteForm()) {
            return; // Stop submission if validation fails
        }
        dispatch(addClient(formData));
    };

    const handleColorSelect = (colorType, color) => {
        setFormData((prev) => ({ ...prev, [`${colorType}ColorHex`]: color }));
        setCustomColorMode((prev) => ({ ...prev, [colorType]: false }));
    };

    const toggleCustomColor = (colorType) => {
        setCustomColorMode((prev) => ({ ...prev, [colorType]: !prev[colorType] }));
    };

    // Preview component to show how the colors would look together
    const ColorPreview = () => (
        <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                Preview Your Colors
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', mb: 2, width: '100%', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: formData.primaryColorHex,
                            mr: 2,
                            '&:hover': {
                                backgroundColor: formData.primaryColorHex,
                                opacity: 0.9,
                            },
                        }}
                    >
                        Primary Button
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: formData.secondaryColorHex,
                            '&:hover': {
                                backgroundColor: formData.secondaryColorHex,
                                opacity: 0.9,
                            },
                        }}
                    >
                        Secondary Button
                    </Button>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 1,
                        border: `2px solid ${formData.primaryColorHex}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ color: formData.primaryColorHex, fontWeight: 'bold' }}
                    >
                        Primary Text Sample
                    </Typography>
                    <Box
                        sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: formData.secondaryColorHex,
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );

    // Step content for each step
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="clientName"
                                    label="Client/Organization Name"
                                    name="clientName"
                                    autoComplete="organization"
                                    autoFocus
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    error={!!formErrors.clientName}
                                    helperText={formErrors.clientName}
                                    InputProps={{
                                        startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="organizationType"
                                    label="Organization Type"
                                    name="organizationType"
                                    placeholder="e.g. Healthcare, Education, Tech"
                                    value={formData.organizationType}
                                    onChange={handleChange}
                                    error={!!formErrors.organizationType}
                                    helperText={formErrors.organizationType}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="headQuarter"
                                    label="Headquarter Location"
                                    name="headQuarter"
                                    placeholder="City, Country"
                                    value={formData.headQuarter}
                                    onChange={handleChange}
                                    error={!!formErrors.headQuarter}
                                    helperText={formErrors.headQuarter}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="description"
                                    label="Organization Description"
                                    name="description"
                                    multiline
                                    rows={3}
                                    placeholder="Brief description of the organization and its purpose"
                                    value={formData.description}
                                    onChange={handleChange}
                                    error={!!formErrors.description}
                                    helperText={formErrors.description}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Admin Account Information
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    This account will have full administrative privileges for this tenant.
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
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
                                                startAdornment: <AdminPanelSettingsIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="adminEmail"
                                            label="Admin Email Address"
                                            name="adminEmail"
                                            autoComplete="email"
                                            type="email"
                                            value={formData.adminEmail}
                                            onChange={handleChange}
                                            error={!!formErrors.adminEmail}
                                            helperText={formErrors.adminEmail}
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
                                            helperText={
                                                formErrors.adminPassword ||
                                                'Password must be at least 8 characters long'
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                            Select Brand Colors
                        </Typography>

                        {/* Primary Color Selection */}
                        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PaletteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="subtitle2">Primary Color</Typography>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    {primaryColorOptions.map((color) => (
                                        <Tooltip title={color} key={color}>
                                            <ColorBox
                                                color={color}
                                                onClick={() => handleColorSelect('primary', color)}
                                                sx={{
                                                    border: formData.primaryColorHex === color ? '3px solid #000' : '2px solid #fff',
                                                }}
                                            />
                                        </Tooltip>
                                    ))}
                                    <Tooltip title="Custom Color">
                                        <IconButton
                                            onClick={() => toggleCustomColor('primary')}
                                            sx={{
                                                border: '1px dashed #aaa',
                                                borderRadius: '50%',
                                                ml: 1
                                            }}
                                        >
                                            <PaletteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>

                                {customColorMode.primary && (
                                    <TextField
                                        fullWidth
                                        name="primaryColorHex"
                                        label="Custom Primary Color (HEX)"
                                        type="color"
                                        id="primaryColorHex"
                                        value={formData.primaryColorHex}
                                        onChange={handleChange}
                                        error={!!formErrors.primaryColorHex}
                                        helperText={formErrors.primaryColorHex || "Click to pick custom color"}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& input[type="color"]': {
                                                height: '40px',
                                                padding: '5px',
                                                cursor: 'pointer'
                                            }
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* Secondary Color Selection */}
                        <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <PaletteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="subtitle2">Secondary Color</Typography>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                    {secondaryColorOptions.map((color) => (
                                        <Tooltip title={color} key={color}>
                                            <ColorBox
                                                color={color}
                                                onClick={() => handleColorSelect('secondary', color)}
                                                sx={{
                                                    border: formData.secondaryColorHex === color ? '3px solid #000' : '2px solid #fff',
                                                }}
                                            />
                                        </Tooltip>
                                    ))}
                                    <Tooltip title="Custom Color">
                                        <IconButton
                                            onClick={() => toggleCustomColor('secondary')}
                                            sx={{
                                                border: '1px dashed #aaa',
                                                borderRadius: '50%',
                                                ml: 1
                                            }}
                                        >
                                            <PaletteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>

                                {customColorMode.secondary && (
                                    <TextField
                                        fullWidth
                                        name="secondaryColorHex"
                                        label="Custom Secondary Color (HEX)"
                                        type="color"
                                        id="secondaryColorHex"
                                        value={formData.secondaryColorHex}
                                        onChange={handleChange}
                                        error={!!formErrors.secondaryColorHex}
                                        helperText={formErrors.secondaryColorHex || "Click to pick custom color"}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& input[type="color"]': {
                                                height: '40px',
                                                padding: '5px',
                                                cursor: 'pointer'
                                            }
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <ColorPreview />
                    </Box>
                );
            default:
                return 'Unknown step';
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
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #f9f9f9, #ffffff)'
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{
                    fontWeight: 600,
                    mb: 4,
                    color: '#263238',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '50%',
                        width: 100,
                        height: 4,
                        backgroundColor: '#1976D2',
                        transform: 'translateX(-50%)',
                        borderRadius: 4
                    }
                }}
            >
                Register New Client
            </Typography>

            {addClientStatus === 'failed' && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    {addClientError || 'Failed to add client. Please try again.'}
                </Alert>
            )}

            <Stepper
                activeStep={activeStep}
                sx={{
                    mb: 4,
                    '& .MuiStepLabel-root .Mui-completed': {
                        color: '#2E7D32', // Custom color for completed steps
                    },
                    '& .MuiStepLabel-root .Mui-active': {
                        color: '#1976D2', // Custom color for active step
                    }
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
                {getStepContent(activeStep)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'medium',
                        }}
                    >
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    px: 4,
                                    py: 1.2,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'medium',
                                    boxShadow: 2,
                                }}
                                disabled={addClientStatus === 'loading'}
                                startIcon={addClientStatus === 'loading' ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                            >
                                {addClientStatus === 'loading' ? 'Creating...' : 'Create Client'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.2,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'medium',
                                    boxShadow: 2,
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default ClientAddForm;