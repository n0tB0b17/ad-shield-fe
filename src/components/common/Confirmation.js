// src/components/common/ConfirmationModal.js (Create if you don't have one)
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

const ConfirmationModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false
}) => {

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title || "Confirm Action"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message || "Are you sure you want to proceed?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>{cancelText}</Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary" // Or 'error' for delete actions
                    autoFocus
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {isLoading ? 'Processing...' : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;