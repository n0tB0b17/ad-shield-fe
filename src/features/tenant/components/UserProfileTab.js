import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { format } from 'date-fns';
import ProfileRender from '../../../components/common/Profile';

const DetailItem = ({ icon, label, value, children, fullWidth = false }) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.8 }}>
        {icon && React.cloneElement(icon, { sx: { mr: 1.5, mt: 0.5, color: 'text.secondary' } })}
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium', display: 'block' }}>
                {label}
            </Typography>
            {children || <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{value || '-'}</Typography>}
        </Box>
    </Grid>
);

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith("0001-01-01")) return 'N/A';
    try { return format(new Date(dateString), 'PPp'); } catch (e) { return dateString; }
};

const UserProfileTab = () => {
    const { currentUser, currentUserRole, authStatus, authError } = useSelector((state) => state.tenants);
    if (authStatus === 'loading' && !currentUser?.firstName) {
        return (
            <ProfileRender />
        )
    }

    if (authStatus === 'failed' && authError && !currentUser) { 
        return <Typography color="error">Error loading profile details: {authError}</Typography>;
    }


    const user = currentUser || {};
    const role = currentUserRole || {};

    const getInitials = (fname = '', lname = '') => {
        return `${fname?.[0] || ''}${lname?.[0] || ''}`.toUpperCase() || (user.userName?.[0] || '?').toUpperCase();
    }

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                                {getInitials(user.firstName, user.lastName)}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" component="div">
                                    {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.userName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.userName}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={0}> {/* No inner spacing needed if using DetailItem margin */}
                            <DetailItem icon={<EmailIcon />} label="Email" value={user.email} />
                            <DetailItem icon={<PhoneIcon />} label="Contact Number" value={user.contactNumber} />
                            <DetailItem icon={<CalendarTodayIcon />} label="Account Created" value={formatDate(user.createdAt)} />
                            <DetailItem icon={<UpdateIcon />} label="Last Updated" value={formatDate(user.updatedAt)} />
                        </Grid>
                    </Paper>
                </Grid>

                {/* Role & Permissions Card */}
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LockIcon sx={{ mr: 1, color: 'secondary.main' }} /> Role & Permissions
                        </Typography>
                        <Divider sx={{ mb: 2.5 }} />
                        {role.name ? (
                            <>
                                <DetailItem icon={<BadgeIcon />} label="Role Name" value={role.name} fullWidth />
                                <DetailItem label="Role Description" value={role.description} fullWidth />

                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium', mt: 2, mb: 1 }}>
                                    Permissions:
                                </Typography>
                                {role.permissions && role.permissions.length > 0 ? (
                                    <List dense disablePadding>
                                        {role.permissions.map((perm, index) => (
                                            <ListItem key={index} disablePadding sx={{ pl: 2 }}>
                                                <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                                                <ListItemText primary={perm} />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" sx={{ pl: 2 }}>No specific permissions assigned.</Typography>
                                )}
                            </>
                        ) : (
                            <Typography variant="body2" color="text.secondary">Role information not available.</Typography>
                        )}

                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserProfileTab;