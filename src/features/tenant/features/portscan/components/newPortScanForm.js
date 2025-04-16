import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { startPortScan, resetScanStatus } from '../portScanSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const NewPortScanForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { scanStatus, scanError } = useSelector((state) => state.portScan);

    const [ipAddress, setIpAddress] = useState('');
    const [portRange, setPortRange] = useState(''); // e.g., "1-1000", "22,80,443", "1-100,443"
    const [formErrors, setFormErrors] = useState({});

    // Reset status when component mounts or clientId changes
    useEffect(() => {
        dispatch(resetScanStatus());
    }, [dispatch, clientId]);


    // Redirect to history page after successful scan submission
    useEffect(() => {
        if (scanStatus === 'succeeded') {
            navigate(`/tenant/${clientId}/port-scan/history`);
            // Optionally show a success notification before redirecting
        }
    }, [scanStatus, navigate, clientId]);

    const validateForm = () => {
        const errors = {};
        // Basic IP Address validation (more robust regex could be used)
        if (!ipAddress.trim()) {
            errors.ipAddress = 'IP Address is required';
        } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipAddress.trim()) && !/^[a-zA-Z0-9.-]+$/.test(ipAddress.trim())) {
            // Allow basic hostname characters too
            errors.ipAddress = 'Invalid IP Address or Hostname format';
        }

        // Basic Port Range validation
        if (!portRange.trim()) {
            errors.portRange = 'Port Range is required';
        } else if (!/^[\d,-]+$/.test(portRange.replace(/\s/g, ''))) {
            // Allows digits, commas, hyphens
            errors.portRange = 'Invalid characters in Port Range (use numbers, commas, hyphens)';
        }
        // Add more specific port range format validation if needed

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const scanData = {
            ipAddress: ipAddress.trim(),
            portRange: portRange.replace(/\s/g, ''), // Remove whitespace
        };
        dispatch(startPortScan({ clientId, scanData }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {scanStatus === 'failed' && scanError && (
                <Alert severity="error" sx={{ mb: 2 }}>{scanError}</Alert>
            )}
            <TextField
                margin="normal"
                required
                fullWidth
                id="ipAddress"
                label="Target IP Address or Hostname"
                name="ipAddress"
                autoFocus
                value={ipAddress}
                onChange={(e) => {
                    setIpAddress(e.target.value);
                    if (formErrors.ipAddress) setFormErrors(prev => ({ ...prev, ipAddress: '' }));
                }}
                error={!!formErrors.ipAddress}
                helperText={formErrors.ipAddress}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="portRange"
                label="Port Range (e.g., 1-1000 or 22,80,443)"
                name="portRange"
                value={portRange}
                onChange={(e) => {
                    setPortRange(e.target.value);
                    if (formErrors.portRange) setFormErrors(prev => ({ ...prev, portRange: '' }));
                }}
                error={!!formErrors.portRange}
                helperText={formErrors.portRange || "Examples: 1-65535, 80,443, 1000-2000"}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={scanStatus === 'loading'}
            >
                {scanStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Start Scan'}
            </Button>
        </Box>
    );
};

export default NewPortScanForm;