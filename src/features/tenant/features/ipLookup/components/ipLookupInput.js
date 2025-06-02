import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { lookupIPOrDomain, clearCurrentLookup, fetchLookupHistory, resetLookupStatus } from '../ipLookupSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorAnimation from '../../../../../components/loading/error'

const IpLookupInputForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { lookupStatus, lookupError, currentLookupResult } = useSelector((state) => state.ipLookup);

    const [target, setTarget] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        dispatch(resetLookupStatus())
    }, [dispatch, resetLookupStatus])

    const validateForm = () => {
        if (!target.trim()) {
            setFormError('IP Address or Domain Name is required.');
            return false;
        }

        setFormError('');
        return true;
    };

    const handleLookup = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        dispatch(lookupIPOrDomain({ clientId, target: target.trim() }));
    };

    const handleClear = () => {
        setTarget('');
        setFormError('');
        dispatch(clearCurrentLookup());
    };

    const handleViewHistory = () => {
        dispatch(fetchLookupHistory(clientId));
        navigate(`/tenant/${clientId}/ip-lookup/history`);
    };

    return (
        <Box>
            <Box component="form" onSubmit={handleLookup} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="target"
                    label="Enter IP Address or Domain Name"
                    name="target"
                    autoFocus
                    value={target}
                    onChange={(e) => {
                        setTarget(e.target.value);
                        if (formError) setFormError('');
                    }}
                    error={!!formError}
                    helperText={formError}
                />

                {lookupStatus === 'failed' && lookupError && (
                    <ErrorAnimation message={lookupError} />
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SearchIcon />}
                        disabled={lookupStatus === 'loading' || !target.trim()}
                        sx={{ flexGrow: 1 }}
                    >
                        {lookupStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Lookup'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        onClick={handleViewHistory}
                    >
                        History
                    </Button>
                    {currentLookupResult && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ClearIcon />}
                            onClick={handleClear}
                        >
                            Clear Result
                        </Button>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default IpLookupInputForm;