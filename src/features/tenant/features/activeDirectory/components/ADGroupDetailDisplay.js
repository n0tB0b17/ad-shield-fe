import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns'; // For formatting dates

// Helper component for displaying key-value pairs
const DetailItem = ({ label, value, xs = 12, sm = 6 }) => (
    <Grid item xs={xs} sm={sm} sx={{ mb: 1.5, wordBreak: 'break-word' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
            {label}
        </Typography>
        {Array.isArray(value) ? (
            value.length > 0 ? (
                <List dense disablePadding sx={{ maxHeight: 150, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}>
                    {value.map((item, index) => (
                        <ListItem disablePadding key={index} sx={{ pl: 0.5 }}>
                            <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItem>
                    ))}
                </List>
            ) : <Typography variant="body1">-</Typography>
        ) : (
            <Typography variant="body1">{value || '-'}</Typography>
        )}
    </Grid>
);

const ADGroupDetailDisplay = ({ group }) => {

    if (!group) {
        return <Typography>Group details not available.</Typography>;
    }

    const formatDate = (dateString) => {
        if (!dateString || dateString.startsWith("0001-01-01")) return '-';
        try {
            return format(new Date(dateString), 'PPpp'); // e.g., Aug 21, 2024, 4:30:00 PM
        } catch (e) {
            return dateString; // Fallback
        }
    };

    // Helper to interpret group type integer (based on common values)
    const getGroupTypeDescription = (typeCode) => {
        switch (typeCode) {
            case 2: return 'Global Security Group';
            case 4: return 'Domain Local Security Group';
            case 8: return 'Universal Security Group';
            // Add distribution types if needed based on your AD schema/needs
            default: return `Unknown/Other (${typeCode})`;
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {group.displayName || group.name || group.samAccountName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                DN: {group.distinguishedName || group.dn}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                <DetailItem label="SAM Account Name" value={group.samAccountName} />
                <DetailItem label="Display Name" value={group.displayName} />
                <DetailItem label="Description" value={group.description} xs={12} sm={12} />
                <DetailItem label="Group Type" value={getGroupTypeDescription(group.type)} />
                <DetailItem label="Scope" value={group.scope} />
                <DetailItem label="Category" value={group.groupCategory} />
                <DetailItem label="Email" value={group.email} />
                <DetailItem label="Managed By" value={group.managedBy} />
                <DetailItem label="Object GUID" value={group.objectGUID} />
                <DetailItem label="Object SID" value={group.objectSID} />
                <DetailItem label="Created" value={formatDate(group.whenCreated)} />
                <DetailItem label="Last Changed" value={formatDate(group.whenChanged)} />
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>Members ({group.members?.length || 0})</Typography>
                    <DetailItem label="" value={group.members || []} xs={12} sm={12} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>Member Of ({group.memberOf?.length || 0})</Typography>
                    <DetailItem label="" value={group.memberOf || []} xs={12} sm={12} />
                </Grid>
            </Grid>

            {/* Optionally display Raw Attributes if needed */}
            {/*
             <Divider sx={{ my: 3 }}/>
             <Typography variant="subtitle1" gutterBottom>Raw Attributes</Typography>
             <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f5f5f5', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8em' }}>
                 {JSON.stringify(group.rawAttributes, null, 2)}
             </pre>
             */}

        </Box>
    );
};

export default ADGroupDetailDisplay;