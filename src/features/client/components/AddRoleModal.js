// src/features/client/components/AddRoleModal.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography'

import { addClientRole, resetRoleMutationStatus } from '../clientSlice';


const ALL_PERMISSIONS = [
    'all',

    'port-scan_read',
    'port-scan_write',
    'port-scan_delete',

    'pcap-scan_read',
    'pcap-scan_write',
    'pcap-scan_delete',

    'ip-lookup_read',
    'ip-lookup_write',
    'ip-lookup_delete',

    'report_read',
    'report_write',
    'report_delete',

    'user_read',
    'user_write',
    'user_delete',

    'ad_read',
    'ad_write',
    'ad_delete'
];

const AddRoleModal = ({ open, onClose, clientId }) => {
    const dispatch = useDispatch();
    const { addRoleStatus, addRoleError } = useSelector((state) => state.clients);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [submitted, setSubmitted] = useState(false); // Track if submitted for validation

    const isLoading = addRoleStatus === 'loading';

    // Reset form and status when modal opens or status changes
    useEffect(() => {
        if (open) {
            setName('');
            setDescription('');
            setPermissions([]);
            setSubmitted(false);
            // Reset redux status if modal re-opens after a previous attempt
            if (addRoleStatus !== 'idle') {
                dispatch(resetRoleMutationStatus());
            }
        }
    }, [open, addRoleStatus, dispatch]);


    const handlePermissionChange = (event) => {
        const {
            target: { value },
        } = event;
        // On autofill we get a stringified value.
        setPermissions(typeof value === 'string' ? value.split(',') : value);
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!name || permissions.length === 0) {
            // Basic validation: Name and at least one permission required
            return;
        }

        const roleData = { name, description, permissions };
        dispatch(addClientRole({ clientId, roleData }))
            .unwrap() // Allows us to use .then() and .catch() on the dispatched action
            .then(() => {
                onClose(); // Close modal on success
            })
            .catch((error) => {
                // Error is already handled by the slice and displayed via useSelector
                console.error("Failed to add role:", error);
            });
    };

    // --- Validation Logic ---
    const nameError = submitted && !name;
    const permissionsError = submitted && permissions.length === 0;
    // --- End Validation ---

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Role</DialogTitle>
            <DialogContent>
                {addRoleStatus === 'failed' && addRoleError && (
                    <Alert severity="error" sx={{ mb: 2 }}>{addRoleError}</Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="dense"
                        required
                        fullWidth
                        id="role-name"
                        label="Role Name"
                        name="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={nameError}
                        helperText={nameError ? 'Role name is required' : ''}
                        disabled={isLoading}
                    />
                    <TextField
                        margin="dense"
                        fullWidth
                        id="role-description"
                        label="Description (Optional)"
                        name="description"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                    />
                    <FormControl margin="dense" fullWidth required error={permissionsError} disabled={isLoading}>
                        <InputLabel id="role-permissions-label">Permissions</InputLabel>
                        <Select
                            labelId="role-permissions-label"
                            id="role-permissions"
                            multiple
                            value={permissions}
                            onChange={handlePermissionChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Permissions" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 224, // Adjust as needed
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            {ALL_PERMISSIONS.map((permission) => (
                                <MenuItem key={permission} value={permission}>
                                    {permission}
                                </MenuItem>
                            ))}
                        </Select>
                        {permissionsError && <Typography variant="caption" color="error">At least one permission is required</Typography>}
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
                <Button
                    type="submit" // Links to form onSubmit
                    variant="contained"
                    onClick={handleSubmit} // Also trigger submit handler
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {isLoading ? 'Adding...' : 'Add Role'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRoleModal;