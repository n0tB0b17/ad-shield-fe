import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addADUser, resetAddUserStatus } from '../adSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const AddADUserForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        addUserStatus,
        addUserError,
        connectionDetails
    } = useSelector((state) => state.ad);

    const [formData, setFormData] = useState({
        samAccountName: '',
        password: '',
        distinguishedName: '', // e.g., CN=Timmy Cold,OU=Sales,DC=domain,DC=local
        userPrincipalName: '', // e.g., timmy@domain.local
        displayName: '',
        givenName: '', // First name
        surName: '',   // Last name
        description: '',
        title: '',
        department: '',
        company: '',
        telephoneNumber: '',
        mobile: ''
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        dispatch(resetAddUserStatus());
        return () => { dispatch(resetAddUserStatus()); };
    }, [dispatch]);

    useEffect(() => {
        if (addUserStatus === 'succeeded') {
            navigate(`/tenant/${clientId}/ad/manage/users`);
        }
    }, [addUserStatus, navigate, clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.samAccountName.trim()) errors.samAccountName = 'SAM Account Name is required';
        if (!formData.password) errors.password = 'Password is required'; // Add strength validation later if needed
        if (!formData.distinguishedName.trim()) {
            errors.distinguishedName = 'Distinguished Name (DN) is required';
        } else if (!/^cn=.+,.*(ou|dc)=.*/i.test(formData.distinguishedName.trim())) {
            errors.distinguishedName = 'DN format seems incorrect (e.g., CN=...,OU=...,DC=...)';
        }
        if (!formData.userPrincipalName.trim()) {
            errors.userPrincipalName = 'User Principal Name (UPN) is required';
        } else if (!/.+@.+\..+/.test(formData.userPrincipalName.trim())) {
            errors.userPrincipalName = 'UPN format seems incorrect (e.g., user@domain.local)';
        }
        if (!formData.givenName.trim()) errors.givenName = 'Given Name (First Name) is required';
        if (!formData.surName.trim()) errors.surName = 'Surname (Last Name) is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm() || !connectionDetails) {
            if (!connectionDetails) {
                setFormErrors(prev => ({ ...prev, _general: 'AD Connection details not found.' }));
            }
            return;
        }
        dispatch(addADUser({
            clientId,
            connectionDetails,
            userData: formData
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {addUserStatus === 'failed' && addUserError && (
                <Alert severity="error" sx={{ mb: 2 }}>{addUserError}</Alert>
            )}
            {formErrors._general && (
                <Alert severity="error" sx={{ mb: 2 }}>{formErrors._general}</Alert>
            )}

            <Typography variant="subtitle1" gutterBottom>Account Information</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField margin="dense" required fullWidth id="samAccountName" label="SAM Account Name (Username)" name="samAccountName" value={formData.samAccountName} onChange={handleChange} error={!!formErrors.samAccountName} helperText={formErrors.samAccountName} autoFocus />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField margin="dense" required fullWidth name="password" label="Password" type="password" id="password" value={formData.password} onChange={handleChange} error={!!formErrors.password} helperText={formErrors.password} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField margin="dense" required fullWidth id="userPrincipalName" label="User Principal Name (UPN)" name="userPrincipalName" placeholder="e.g., username@domain.local" value={formData.userPrincipalName} onChange={handleChange} error={!!formErrors.userPrincipalName} helperText={formErrors.userPrincipalName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField margin="dense" required fullWidth id="distinguishedName" label="Full Distinguished Name (DN)" name="distinguishedName" placeholder="e.g., CN=Full Name,OU=Sales,DC=domain,DC=local" value={formData.distinguishedName} onChange={handleChange} error={!!formErrors.distinguishedName} helperText={formErrors.distinguishedName} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Personal Information</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField margin="dense" required fullWidth id="givenName" label="Given Name (First Name)" name="givenName" value={formData.givenName} onChange={handleChange} error={!!formErrors.givenName} helperText={formErrors.givenName} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField margin="dense" required fullWidth id="surName" label="Surname (Last Name)" name="surName" value={formData.surName} onChange={handleChange} error={!!formErrors.surName} helperText={formErrors.surName} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField margin="dense" fullWidth id="displayName" label="Display Name (Optional)" name="displayName" value={formData.displayName} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                    <TextField margin="dense" fullWidth id="description" label="Description (Optional)" name="description" multiline rows={2} value={formData.description} onChange={handleChange} />
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Organization & Contact (Optional)</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField margin="dense" fullWidth id="title" label="Title" name="title" value={formData.title} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField margin="dense" fullWidth id="department" label="Department" name="department" value={formData.department} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField margin="dense" fullWidth id="company" label="Company" name="company" value={formData.company} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField margin="dense" fullWidth id="telephoneNumber" label="Telephone Number" name="telephoneNumber" value={formData.telephoneNumber} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField margin="dense" fullWidth id="mobile" label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} />
                </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={addUserStatus === 'loading' || !connectionDetails}>
                {addUserStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Add User'}
            </Button>
        </Box>
    );
};

export default AddADUserForm;