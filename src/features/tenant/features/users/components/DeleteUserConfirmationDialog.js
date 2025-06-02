import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteUserConfirmationDialog = ({ open, onClose, onConfirm, userName }) => {
    // Get delete status to disable button while deleting
    const { deleteStatus } = useSelector(state => state.users);
    const isDeleting = deleteStatus === 'loading';

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose} // Allow closing by clicking outside
      aria-describedby="delete-user-confirmation-dialog"
      maxWidth="xs"
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-user-confirmation-dialog">
          Are you sure you want to delete the user "<strong>{userName || 'this user'}</strong>"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isDeleting} color="inherit">Cancel</Button>
        <Button
            onClick={onConfirm}
            disabled={isDeleting}
            variant="contained"
            color="error"
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserConfirmationDialog;