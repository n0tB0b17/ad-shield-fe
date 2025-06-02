import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPcapFile, resetUploadStatus } from '../pcapSlice';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress'; // Use LinearProgress for file upload
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ErrorMessage from '../../../../../components/loading/error'
import SuccessMessage from '../../../../../components/loading/success'

const PcapUploadModal = ({ open, handleClose, clientId }) => {
    const dispatch = useDispatch();
    const { uploadStatus, uploadError } = useSelector((state) => state.pcapScan);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.pcap') || file.name.endsWith('.pcapng'))) {
            setSelectedFile(file);
            dispatch(resetUploadStatus()); // Clear previous errors if selecting a new file
        } else {
            setSelectedFile(null);
            // Optionally show an error message for invalid file type
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('pcap_file', selectedFile);
        dispatch(uploadPcapFile({ clientId, formData }));
    };

    // Handle drag events
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    // Triggers when file is dropped
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith('.pcap') || file.name.endsWith('.pcapng'))) {
                setSelectedFile(file);
                dispatch(resetUploadStatus());
            } else {
                setSelectedFile(null);
                // Show error for invalid file type
            }
        }
    }, [dispatch]);

    // Trigger hidden file input click
    const onButtonClick = () => {
        inputRef.current?.click();
    };

    // Close and reset on successful upload or manual close
    const handleModalClose = () => {
        handleClose(uploadStatus === 'succeeded'); // Pass true if successful to trigger refresh in parent
        setTimeout(() => { // Delay reset to allow parent refresh logic
            setSelectedFile(null);
            dispatch(resetUploadStatus());
        }, 300); // Small delay
    };

    return (
        <Dialog open={open} onClose={handleModalClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Upload Pcap File
                <IconButton
                    aria-label="close"
                    onClick={handleModalClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    sx={{
                        border: `2px dashed ${dragActive ? 'primary.main' : 'grey.400'}`,
                        borderRadius: 1,
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out'
                    }}
                    onClick={onButtonClick} // Allow clicking the area too
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pcap,.pcapng"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="pcap-upload-input"
                    />
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                        Drag & Drop Pcap File Here
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        or click to select a file (.pcap, .pcapng)
                    </Typography>
                </Box>

                {selectedFile && (
                    <Box sx={{ mt: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                        <InsertDriveFileIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {selectedFile.size}
                        </Typography>
                        {uploadStatus !== 'loading' && uploadStatus !== 'succeeded' && (
                            <IconButton size="small" onClick={() => setSelectedFile(null)} sx={{ ml: 1 }}>
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        )}
                    </Box>
                )}

                {uploadStatus === 'loading' && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <LinearProgress />
                        <Typography variant="caption" display="block" sx={{ textAlign: 'center', mt: 0.5 }}>Uploading...</Typography>
                    </Box>
                )}
                {uploadStatus === 'succeeded' && (
                    <SuccessMessage message='File uploaded successfully! Analysis may take some time.' />
                )}
                {uploadStatus === 'failed' && (
                    <ErrorMessage message={uploadError || 'Upload failed. Please try again.'} />
                )}

            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={handleModalClose} color="secondary">
                    {uploadStatus === 'succeeded' ? 'Close' : 'Cancel'}
                </Button>
                <Button
                    onClick={handleUpload}
                    variant="contained"
                    disabled={!selectedFile || uploadStatus === 'loading' || uploadStatus === 'succeeded'}
                >
                    {uploadStatus === 'loading' ? 'Uploading...' : 'Upload'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PcapUploadModal;