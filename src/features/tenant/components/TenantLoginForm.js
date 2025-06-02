import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { loginTenantUser, resetTenantAuthStatus } from '../tenantSlice';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import LoadingClientAnimation from '../../../components/loading/loading';
import ErrorAnimation from '../../../components/loading/error';

const TenantLoginForm = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authStatus, authError, isAuthenticated, currentTenantInfo } = useSelector((state) => state.tenants);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        dispatch(resetTenantAuthStatus());
    }, [dispatch, clientId]);


    useEffect(() => {
        if (isAuthenticated) {
            navigate(`/tenant/${clientId}/port-scan/history`);
        }
    }, [isAuthenticated, navigate, clientId]);

    const validateForm = () => {
        if (!username.trim() || !password.trim()) {
            setFormError('Username and Password are required.');
            return false;
        }
        setFormError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const credentials = { username, password };
        dispatch(loginTenantUser({ clientId, credentials }));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                {currentTenantInfo?.clientName || 'Client'} Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%', maxWidth: '400px' }}>
                {formError && <Alert severity="warning" sx={{ mb: 2 }}>{formError}</Alert>}
                {authStatus === 'failed' && authError && (
                    <ErrorAnimation message={authError} />
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username or Email"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!formError && !username.trim()}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!formError && !password.trim()}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={authStatus === 'loading'}
                >
                    {authStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
            </Box>

            {
                authStatus === "loading" ? <LoadingClientAnimation message='logging-in' /> : null
            }
        </Box>
    );
};

export default TenantLoginForm;