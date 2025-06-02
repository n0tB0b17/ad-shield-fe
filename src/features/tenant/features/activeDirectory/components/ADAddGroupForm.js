import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addADGroup, resetAddGroupStatus } from '../adSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';


const AddADGroupForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        addGroupStatus,
        addGroupError,
        connectionDetails // Needed for API call
    } = useSelector((state) => state.ad);

    const [formData, setFormData] = useState({
        name: '', // Corresponds to 'name' in API
        displayName: '', // Corresponds to 'displayName'
        samAccountName: '', // Corresponds to 'samAccountName'
        distinguishedName: '', // e.g., CN=NewGroup,OU=Users,DC=domain,DC=local
        description: '',
        type: '2', // Default to Global Security Group (2), API expects number
    });
    const [formErrors, setFormErrors] = useState({});

    const groupTypes = [
        { value: '2', label: 'Global Security Group' },
        { value: '4', label: 'Domain Local Security Group' },
        { value: '8', label: 'Universal Security Group' },
    ];

    useEffect(() => {
        // Reset status on mount/unmount
        dispatch(resetAddGroupStatus());
        return () => { dispatch(resetAddGroupStatus()); };
    }, [dispatch]);

    useEffect(() => {
        if (addGroupStatus === 'succeeded') {
            navigate(`/tenant/${clientId}/ad/manage/groups`);
            // Maybe show success notification
        }
    }, [addGroupStatus, navigate, clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Group Name (CN) is required';
        if (!formData.samAccountName.trim()) errors.samAccountName = 'SAM Account Name is required';
        // Simple DN validation (basic structure)
        if (!formData.distinguishedName.trim()) {
            errors.distinguishedName = 'Distinguished Name (DN) is required';
        } else if (!/^cn=.+,.*(ou|dc)=.*/i.test(formData.distinguishedName.trim())) {
            errors.distinguishedName = 'DN format seems incorrect (e.g., CN=...,OU=...,DC=...)';
        }
        if (!formData.type) errors.type = 'Group Type/Scope is required';

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
        // Pass connection details and form data (mapped to API structure)
        dispatch(addADGroup({
            clientId,
            connectionDetails,
            groupData: { ...formData, type: parseInt(formData.type, 10) } // Send type as number
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {addGroupStatus === 'failed' && addGroupError && (
                <Alert severity="error" sx={{ mb: 2 }}>{addGroupError}</Alert>
            )}
            {formErrors._general && (
                <Alert severity="error" sx={{ mb: 2 }}>{formErrors._general}</Alert>
            )}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="dense"
                        required
                        fullWidth
                        id="name"
                        label="Group Name (CN part of DN)"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="dense"
                        required
                        fullWidth
                        id="samAccountName"
                        label="SAM Account Name"
                        name="samAccountName"
                        value={formData.samAccountName}
                        onChange={handleChange}
                        error={!!formErrors.samAccountName}
                        helperText={formErrors.samAccountName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin="dense"
                        required
                        fullWidth
                        id="distinguishedName"
                        label="Full Distinguished Name (DN)"
                        name="distinguishedName"
                        placeholder="e.g., CN=GroupName,OU=YourOU,DC=domain,DC=local"
                        value={formData.distinguishedName}
                        onChange={handleChange}
                        error={!!formErrors.distinguishedName}
                        helperText={formErrors.distinguishedName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        margin="dense"
                        fullWidth
                        id="displayName"
                        label="Display Name (Optional)"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense" required error={!!formErrors.type}>
                        <InputLabel id="group-type-label">Group Type/Scope</InputLabel>
                        <Select
                            labelId="group-type-label"
                            id="type"
                            name="type"
                            value={formData.type}
                            label="Group Type/Scope"
                            onChange={handleChange}
                        >
                            {groupTypes.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin="dense"
                        fullWidth
                        id="description"
                        label="Description (Optional)"
                        name="description"
                        multiline
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={addGroupStatus === 'loading' || !connectionDetails}
            >
                {addGroupStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Add Group'}
            </Button>
        </Box>
    );
};

export default AddADGroupForm;