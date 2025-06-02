import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import PublicIcon from '@mui/icons-material/Public';
import DnsIcon from '@mui/icons-material/Dns';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import FlagIcon from '@mui/icons-material/Flag';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person'; // For createdBy
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // For createdAt
import { formatDistanceToNowStrict } from 'date-fns'; // Use precise date format

// Re-use or import DetailItem component if extracted
const DetailItem = ({ icon, label, value, xs = 12, sm = 6 }) => (
    <Grid item xs={xs} sm={sm} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, overflowWrap: 'break-word' }}>
        {icon && React.cloneElement(icon, { sx: { mr: 1.5, color: 'text.secondary' } })}
        <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                {label}
            </Typography>
            <Typography variant="body1">{value || '-'}</Typography>
        </Box>
    </Grid>
);



const IpLookupDetailDisplay = ({ lookupDetail }) => {
    if (!lookupDetail) return null;

    const { id, target, ip, geoInfo, hostnames, createdAt, createdBy } = lookupDetail;
    return (
        <Paper elevation={0} sx={{ mt: 0 }}> {/* Use Paper without elevation if inside page card */}
            <CardContent>
                {/* Top Section: Target, IP, Metadata */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom component="div">
                        Lookup Detail: <Chip label={target} color="primary" />
                    </Typography>
                    <Grid container spacing={1}>
                        <DetailItem label="Resolved IP" value={<Chip label={ip} variant="outlined" />} />
                        <DetailItem icon={<CalendarTodayIcon />} label="Lookup Time" value={formatDistanceToNowStrict(createdAt)} />
                        <DetailItem icon={<PersonIcon />} label="Requested By User ID" value={createdBy} />
                        <DetailItem label="Record ID" value={id} />
                    </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Geo Information Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <PublicIcon sx={{ mr: 1 }} /> Geolocation Information
                    </Typography>
                    {geoInfo ? (
                        <Grid container spacing={1} sx={{ pl: 1 }}>
                            <DetailItem icon={<FlagIcon />} label="Country" value={`${geoInfo.country || ''} (${geoInfo.countryCode || 'N/A'})`} />
                            <DetailItem icon={<MapIcon />} label="Region" value={geoInfo.region} />
                            <DetailItem icon={<LocationCityIcon />} label="City" value={geoInfo.city} />
                            <DetailItem label="Zip Code" value={geoInfo.zip} />
                            <DetailItem label="Coordinates" value={geoInfo.latitude && geoInfo.longitude ? `${geoInfo.latitude}, ${geoInfo.longitude}` : '-'} />
                            <DetailItem icon={<AccessTimeIcon />} label="Timezone" value={geoInfo.timezone} />
                            <DetailItem icon={<BusinessIcon />} label="ISP" value={geoInfo.isp} />
                            <DetailItem icon={<BusinessIcon />} label="Organization" value={geoInfo.organization} />
                            <DetailItem label="ASN" value={geoInfo.asn} />
                        </Grid>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>No geolocation data available for this record.</Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Hostnames Section */}
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <DnsIcon sx={{ mr: 1 }} /> Associated Hostnames
                    </Typography>
                    {hostnames && hostnames.length > 0 ? (
                        <List dense sx={{ pl: 2 }}>
                            {hostnames.map((hostname, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemText primary={hostname} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>No associated hostnames found for this record.</Typography>
                    )}
                </Box>

            </CardContent>
        </Paper>
    );
};

export default IpLookupDetailDisplay;