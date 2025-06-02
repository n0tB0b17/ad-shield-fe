import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, resetUpdateStatus, fetchRoles } from '../usersSlice'; // Assuming roles are fetched globally or passed
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useParams } from 'react-router-dom';


const EditUserModal = ({ open, onClose, currentUserData }) => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { updateStatus, updateError, roles, rolesStatus, rolesError } = useSelector((state) => state.users);

    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
        password: '', // Keep password separate, only send if changed
        contactNumber: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Fetch roles if not already loaded
    useEffect(() => {
        if (open && clientId && rolesStatus === 'idle') {
            dispatch(fetchRoles(clientId));
        }
    }, [open, clientId, rolesStatus, dispatch]);


    // Populate form when modal opens and currentUserData is available
    useEffect(() => {
        if (open && currentUserData) {
            setFormData({
                userName: currentUserData.userName || '',
                firstName: currentUserData.firstName || '',
                lastName: currentUserData.lastName || '',
                email: currentUserData.email || '',
                roleId: currentUserData.roleId || '',
                password: '', // Always start with empty password field
                contactNumber: currentUserData.contactNumber?.toString() || '', // Convert number to string for input
            });
            setFormErrors({}); // Clear previous errors
            dispatch(resetUpdateStatus()); // Reset status on open
        }
    }, [open, currentUserData, dispatch]);

    // Close modal on successful update
    useEffect(() => {
        if (updateStatus === 'succeeded') {
            onClose(); // Call the onClose prop passed from parent
        }
    }, [updateStatus, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.userName.trim()) errors.userName = 'Username is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email address is invalid';
        if (!formData.roleId) errors.roleId = 'Role is required';
        // Password validation only if user entered something
        if (formData.password && formData.password.length < 6) {
            errors.password = 'New password must be at least 6 characters';
        }
        if (formData.contactNumber && !/^\d*$/.test(formData.contactNumber)) errors.contactNumber = 'Contact Number must be numeric';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdate = () => {
        if (!validateForm() || !currentUserData?.id) {
            return;
        }
        // Prepare data, conditionally including password
        const userDataToUpdate = { ...formData };
        if (!userDataToUpdate.password || userDataToUpdate.password.trim() === '') {
            delete userDataToUpdate.password; // Don't send empty password
        }

        dispatch(updateUser({
            clientId,
            userId: currentUserData.id,
            userData: userDataToUpdate
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User: {currentUserData?.userName}</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    {updateStatus === 'failed' && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Update failed: {updateError || 'Please check the details and try again.'}
                        </Alert>
                    )}
                    {rolesStatus === 'failed' && (
                        <Alert severity="warning" sx={{ mb: 2 }}>Could not load roles: {rolesError}</Alert>
                    )}
                    <Grid container spacing={2}>
                        {/* Reuse form fields similar to AddUserForm, but map to formData */}
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" required fullWidth name="userName" label="Username"
                                value={formData.userName} onChange={handleChange} error={!!formErrors.userName} helperText={formErrors.userName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense" required error={!!formErrors.roleId}>
                                <InputLabel id="edit-role-select-label">Role</InputLabel>
                                <Select labelId="edit-role-select-label" name="roleId" value={formData.roleId} label="Role" onChange={handleChange} disabled={rolesStatus !== 'succeeded'}>
                                    {rolesStatus === 'loading' && <MenuItem disabled value=""><em>Loading...</em></MenuItem>}
                                    {rolesStatus === 'succeeded' && roles.map((role) => (<MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>))}
                                </Select>
                                {formErrors.roleId && <FormHelperText>{formErrors.roleId}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" fullWidth name="firstName" label="First Name"
                                value={formData.firstName} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" fullWidth name="lastName" label="Last Name"
                                value={formData.lastName} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField margin="dense" required fullWidth name="email" label="Email Address" type="email"
                                value={formData.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" fullWidth name="password" label="New Password (Optional)" type="password"
                                value={formData.password} onChange={handleChange} error={!!formErrors.password} helperText={formErrors.password || "Leave blank to keep current password"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="dense" fullWidth name="contactNumber" label="Contact Number" type="tel"
                                value={formData.contactNumber} onChange={handleChange} error={!!formErrors.contactNumber} helperText={formErrors.contactNumber}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    disabled={updateStatus === 'loading'}
                    startIcon={updateStatus === 'loading' ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserModal;