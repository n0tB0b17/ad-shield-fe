import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {message}
        </Alert>
    );
};

export default ErrorMessage;