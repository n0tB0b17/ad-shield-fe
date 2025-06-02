import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge'; // For Role ID
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import { format } from 'date-fns';
import { Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Re-use or import DetailItem component if extracted
const DetailItem = ({ icon, label, value, xs = 12, sm = 6, md = 4 }) => (
    <Grid item xs={xs} sm={sm} md={md} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, overflowWrap: 'break-word' }}>
        {icon && React.cloneElement(icon, { sx: { mr: 1.5, mt: 0.5, color: 'text.secondary' } })}
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                {label}
            </Typography>
            <Typography variant="body1">{value || '-'}</Typography>
        </Box>
    </Grid>
);


const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0001-01-01")) return 'Never';
    try {
        return format(new Date(dateString), 'PPpp'); // e.g., Aug 21, 2024, 4:30:00 PM
    } catch (e) {
        return dateString; // Fallback
    }
};

const UserDetailDisplay = ({ userData, onEditClick }) => {
    if (!userData) return null;

    const { id, userName, firstName, lastName, email, contactNumber, roleId, createdAt, updatedAt } = userData;

    return (
        <Paper elevation={0} sx={{ mt: 0 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h5" component="div">
                            User: <Chip label={userName} color="primary" />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            User ID: {id}
                        </Typography>
                    </Box>
                    {onEditClick && (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={onEditClick}
                            size="small"
                        >
                            Edit User
                        </Button>
                    )}
                </Box>


                <Grid container spacing={2}>
                    <DetailItem icon={<PersonIcon />} label="Username" value={userName} />
                    <DetailItem icon={<PersonIcon />} label="First Name" value={firstName} />
                    <DetailItem icon={<PersonIcon />} label="Last Name" value={lastName} />
                    <DetailItem icon={<EmailIcon />} label="Email" value={email} />
                    <DetailItem icon={<PhoneIcon />} label="Contact Number" value={contactNumber} />
                    <DetailItem icon={<BadgeIcon />} label="Role ID" value={roleId} />
                    <DetailItem icon={<CalendarTodayIcon />} label="Created At" value={formatDate(createdAt)} />
                    <DetailItem icon={<UpdateIcon />} label="Last Updated At" value={formatDate(updatedAt)} />
                </Grid>

            </CardContent>
        </Paper>
    );
};

export default UserDetailDisplay;
