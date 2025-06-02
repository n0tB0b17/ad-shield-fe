import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addADOU, resetAddOUStatus } from '../adSlice'; // Use OU specific actions
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

const AddADOUForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        addOUStatus, // Use OU specific status
        addOUError,  // Use OU specific error
        connectionDetails
    } = useSelector((state) => state.ad);

    const [formData, setFormData] = useState({
        name: '', // Corresponds to OU name
        distinguishedName: '', // e.g., OU=NewOU,DC=domain,DC=local
        description: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Reset status on mount/unmount
        dispatch(resetAddOUStatus());
        return () => { dispatch(resetAddOUStatus()); };
    }, [dispatch]);

    useEffect(() => {
        if (addOUStatus === 'succeeded') {
            // Navigate back to the OU list page
            navigate(`/tenant/${clientId}/ad/manage/ou`);
            // Optionally show a success notification here
        }
    }, [addOUStatus, navigate, clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Organizational Unit Name is required';
        // Basic DN validation for OU
        if (!formData.distinguishedName.trim()) {
            errors.distinguishedName = 'Distinguished Name (DN) is required';
        } else if (!/^ou=.+,.*dc=.+/i.test(formData.distinguishedName.trim())) {
            // OU=Name,DC=domain,DC=local or OU=Name,OU=ParentOU,DC=domain,DC=local
            errors.distinguishedName = 'DN format seems incorrect (e.g., OU=Name,DC=domain,DC=local)';
        }

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
        dispatch(addADOU({
            clientId,
            connectionDetails,
            ouData: formData
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {addOUStatus === 'failed' && addOUError && (
                <Alert severity="error" sx={{ mb: 2 }}>{addOUError}</Alert>
            )}
            {formErrors._general && (
                <Alert severity="error" sx={{ mb: 2 }}>{formErrors._general}</Alert>
            )}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        margin="dense"
                        required
                        fullWidth
                        id="name"
                        label="Organizational Unit Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        autoFocus
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
                        placeholder="e.g., OU=NewOU,OU=ParentOU,DC=domain,DC=local"
                        value={formData.distinguishedName}
                        onChange={handleChange}
                        error={!!formErrors.distinguishedName}
                        helperText={formErrors.distinguishedName}
                    />
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
                disabled={addOUStatus === 'loading' || !connectionDetails}
            >
                {addOUStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Add Organizational Unit'}
            </Button>
        </Box>
    );
};

export default AddADOUForm;