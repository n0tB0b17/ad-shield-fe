import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { authenticateAD } from '../adSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';


const ADConnectForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { connectionStatus, connectionError } = useSelector((state) => state.ad);

    const [formData, setFormData] = useState({
        address: '',
        domain_name: '',
        username: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.address.trim()) errors.address = 'LDAP Address is required (e.g., ldap://server:port)';
        else if (!formData.address.startsWith('ldap://') && !formData.address.startsWith('ldaps://')) {
            errors.address = 'Address should start with ldap:// or ldaps://';
        }
        if (!formData.domain_name.trim()) errors.domain_name = 'Domain Name is required';
        if (!formData.username.trim()) errors.username = 'Username is required';
        if (!formData.password) errors.password = 'Password is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        dispatch(authenticateAD({
            clientId,
            credentials: {
                address: formData.address.trim(),
                domain_name: formData.domain_name.trim(),
                username: formData.username.trim(),
                password: formData.password, // Send password as is
            }
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="address"
                label="LDAP Address (e.g., ldap://dc.domain.local:389)"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="domain_name"
                label="Domain Name (e.g., domain.local)"
                name="domain_name"
                value={formData.domain_name}
                onChange={handleChange}
                error={!!formErrors.domain_name}
                helperText={formErrors.domain_name}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username (e.g., Administrator or user@domain.local)"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
            />
            {/* Display API error if connection failed */}
            {connectionStatus === 'failed' && connectionError && !formErrors.address && !formErrors.domain_name && !formErrors.username && !formErrors.password && (
                <Alert severity="error" sx={{ mt: 2 }}>{connectionError}</Alert>
            )}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={connectionStatus === 'loading'}
            >
                {connectionStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Connect'}
            </Button>
        </Box>
    );
};

export default ADConnectForm;