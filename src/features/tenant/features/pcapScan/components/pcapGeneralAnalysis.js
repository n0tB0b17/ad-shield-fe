import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { format } from 'date-fns';

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0001-01-01")) return 'Never';
    try {
        return format(new Date(dateString), 'PPpp'); // Aug 21, 2024, 4:30:00 PM
    } catch (e) {
        return dateString;
    }
};

const DetailItem = ({ label, value, mono = false }) => (
    <Grid item xs={12} md={6} sx={{ mb: 1.5, wordBreak: 'break-word' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
            {label}
        </Typography>
        <Typography variant="body1" component="div" sx={{ fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono? '0.9rem' : 'inherit' }}>
            {value || '-'}
        </Typography>
    </Grid>
);


const PcapGeneralAnalysis = ({ metaData }) => {

    if (!metaData) {
        return <Typography>Pcap metadata not available.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>File Information</Typography>
             <Grid container spacing={1}>
                <DetailItem label="Original Filename" value={metaData.original_file_name} />
                <DetailItem label="Stored Filename" value={metaData.stored_file_name} mono/>
                <DetailItem label="File Size" value={formatBytes(metaData.file_size_bytes)} />
                <DetailItem label="Uploaded At" value={formatDate(metaData.uploaded_at)} />
                <DetailItem label="SHA256 Hash" value={metaData.file_hash} mono/>
                 <DetailItem label="Uploaded By User ID" value={metaData.uploaded_by} mono/>
                 <DetailItem label="Content Type" value={metaData.content_type} />
                <DetailItem label="Last Analyzed" value={formatDate(metaData.LastAnalyzedTime)} />
                {/* Add storage path if needed, maybe conditionally based on role */}
                {/* <DetailItem label="Storage Path" value={metaData.storage_path} mono/> */}
            </Grid>
            {/* Add more general info if available in the API response */}
        </Box>
    );
};

export default PcapGeneralAnalysis;