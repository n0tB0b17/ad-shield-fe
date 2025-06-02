import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addUser, resetAddStatus, fetchRoles } from '../usersSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ErrorAnimation from '../../../../../components/loading/error'
import FormHelperText from '@mui/material/FormHelperText';


const AddUserForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addStatus, addError, roles, rolesStatus, rolesError } = useSelector((state) => state.users);
    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
        password: '',
        contactNumber: '',
    });
    const [formErrors, setFormErrors] = useState({});

    // Fetch roles when component mounts
    useEffect(() => {
        if (clientId && rolesStatus === 'idle') {
            dispatch(fetchRoles(clientId));
        }
    }, [clientId, rolesStatus, dispatch]);

    // Reset add status on mount/unmount
    useEffect(() => {
        dispatch(resetAddStatus());
        return () => {
            dispatch(resetAddStatus());
        };
    }, [dispatch]);

    // Navigate on successful add
    useEffect(() => {
        if (addStatus === 'succeeded') {
            navigate(`/tenant/${clientId}/users/list`);
        }
    }, [addStatus, navigate, clientId]);

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
        if (!formData.password) errors.password = 'Password is required';
        // Basic password length check
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (!formData.roleId) errors.roleId = 'Role is required';
        if (formData.contactNumber && !/^\d+$/.test(formData.contactNumber)) errors.contactNumber = 'Contact Number must be numeric';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        dispatch(addUser({ clientId, userData: formData }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {addStatus === 'failed' && addError && (
                <ErrorAnimation message={addError} />
            )}
            {rolesStatus === 'failed' && (
                <Alert severity="warning" sx={{ mb: 2 }}>Could not load roles: {rolesError}</Alert>
            )}

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="normal" required fullWidth name="userName" label="Username"
                        value={formData.userName} onChange={handleChange} error={!!formErrors.userName} helperText={formErrors.userName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" required error={!!formErrors.roleId}>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="roleId"
                            name="roleId"
                            value={formData.roleId}
                            label="Role"
                            onChange={handleChange}
                            disabled={rolesStatus !== 'succeeded'}
                        >
                            {rolesStatus === 'loading' && <MenuItem disabled value=""><em>Loading roles...</em></MenuItem>}
                            {rolesStatus === 'succeeded' && roles.length === 0 && <MenuItem disabled value=""><em>No roles found</em></MenuItem>}
                            {rolesStatus === 'succeeded' && roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                            ))}
                        </Select>
                        {formErrors.roleId && <FormHelperText>{formErrors.roleId}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="normal" fullWidth name="firstName" label="First Name"
                        value={formData.firstName} onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="normal" fullWidth name="lastName" label="Last Name"
                        value={formData.lastName} onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="normal" required fullWidth name="email" label="Email Address" type="email"
                        value={formData.email} onChange={handleChange} error={!!formErrors.email} helperText={formErrors.email}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="normal" required fullWidth name="password" label="Password" type="password"
                        value={formData.password} onChange={handleChange} error={!!formErrors.password} helperText={formErrors.password}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin="normal" fullWidth name="contactNumber" label="Contact Number (Optional)" type="tel"
                        value={formData.contactNumber} onChange={handleChange} error={!!formErrors.contactNumber} helperText={formErrors.contactNumber}
                    />
                </Grid>

            </Grid>
            <Button
                type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
                disabled={addStatus === 'loading' || rolesStatus !== 'succeeded'}
            >
                {addStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Add User'}
            </Button>
        </Box>
    );
};

export default AddUserForm;