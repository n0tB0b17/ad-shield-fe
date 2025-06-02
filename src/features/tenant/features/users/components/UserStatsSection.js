import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Loader from '../../../../../components/common/Loader';
import ErrorMessage from '../../../../../components/common/ErrorMessage';
import ActivityTimelineChart from './charts/ActivityTimelineChart';
import ActionDistributionChart from './charts/ActionDistributionChart';
import HourlyDistributionChart from './charts/HourlyDistributionChart';
import StatCard from './charts/StatCard';
import { format } from 'date-fns';
import IpAddressDistributionChart from './charts/IpAddressDistributionChart';
import UserAgentDistributionChart from './charts/UserAgentDistributionChart';
import DayOfWeekDistributionChart from './charts/DayOfWeekDistributionChart';

const UserStatsSection = ({ userId }) => {
    const { stats, statsStatus, statsError } = useSelector((state) => state.users);

    if (statsStatus === 'loading') {
        return (
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                <Loader />
                <Typography>Loading User Activity Stats...</Typography>
            </Paper>
        );
    }

    if (statsStatus === 'failed') {
        return (
            <Paper sx={{ p: 3, mb: 3 }}>
                <ErrorMessage message={statsError || 'Could not load user activity stats.'} />
            </Paper>
        );
    }

    if (statsStatus !== 'succeeded' || !stats) {
        return null;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try { return format(new Date(dateString), 'PPp'); } catch (e) { return dateString; }
    };

    return (
        <Box sx={{ mb: 5 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }} align='center'>
                User Activity Statistics
            </Typography>
            {/* {row one} */}
            <Grid container spacing={2} width="100%" justifyContent={"center"}>
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 8, md: 3 }}>
                        <StatCard title="Total Activities" value={stats.total_activity_count?.toLocaleString() ?? '0'} />
                    </Grid>
                    <Grid item size={{ xs: 8, md: 3 }}>
                        <StatCard title="Unique Actions" value={stats.unique_action_count?.toLocaleString() ?? '0'} />
                    </Grid>
                    <Grid item size={{ xs: 8, md: 3 }}>
                        <StatCard title="First Activity" value={formatDate(stats.first_activity_timestamp)} isDate />
                    </Grid>
                    <Grid item size={{ xs: 8, md: 3 }}>
                        <StatCard title="Last Activity" value={formatDate(stats.last_activity_timestamp)} isDate />
                    </Grid>
                </Grid>
                

                {/* row 2 */}
                <Grid container spacing={2} width="100%">
                    <Grid item size={{ xs: 6, md: 4 }}>
                        <Paper sx={{ p: 2, height: 300 }}>
                            <Typography variant="subtitle1" gutterBottom>Activity Timeline</Typography>
                            {stats.activity_timeline && stats.activity_timeline.length > 0 ? (
                                <ActivityTimelineChart data={stats.activity_timeline} />
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ pt: 4, textAlign: 'center' }}>No timeline data available.</Typography>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item size={{ xs: 6, md: 4 }}>
                        <Paper sx={{ p: 2, height: 300 }}>
                            <Typography variant="subtitle1" gutterBottom>Action Distribution</Typography>
                            {stats.action_distribution && stats.action_distribution.length > 0 ? (
                                <ActionDistributionChart data={stats.action_distribution} />
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ pt: 4, textAlign: 'center' }}>No action data available.</Typography>
                            )}
                        </Paper>
                    </Grid>

                    <Grid item size={{ xs: 6, md: 4 }}> {/* Full width for hourly */}
                        <Paper sx={{ p: 2, height: 300 }}>
                            <Typography variant="subtitle1" gutterBottom>Hourly Distribution</Typography>
                            {stats.hourly_distribution && stats.hourly_distribution.length > 0 ? (
                                <HourlyDistributionChart data={stats.hourly_distribution} />
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ pt: 4, textAlign: 'center' }}>No hourly data available.</Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {/* row 3 */}
                <Grid container spacing={2} width="100%">
                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, height: 350 }}>
                            <Typography variant="subtitle1" gutterBottom>Top IP Addresses Used</Typography>
                            {stats.ip_address_distribution && stats.ip_address_distribution.length > 0 ? (
                                <IpAddressDistributionChart data={stats.ip_address_distribution} topN={10} />
                            ) : (<Typography variant="body2" color="textSecondary" sx={{ pt: 4, textAlign: 'center' }}>No IP data.</Typography>)}
                        </Paper>
                    </Grid>
                    <Grid item size={{ xs: 12, md: 4 }}> {/* Adjust size */}
                        <Paper sx={{ p: 2, height: 350 }}> {/* Match height */}
                            <Typography variant="subtitle1" gutterBottom>User Agent Distribution</Typography>
                            {stats.user_agent_distribution && stats.user_agent_distribution.length > 0 ? (
                                <UserAgentDistributionChart data={stats.user_agent_distribution} />
                            ) : (<Typography variant="body2" color="textSecondary" sx={{ pt: 4, textAlign: 'center' }}>No User Agent data.</Typography>)}
                        </Paper>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, height: 300 }}>
                            <Typography variant="subtitle1" gutterBottom>Activity by Day of Week</Typography>
                            {stats.day_of_week_distribution?.length > 0 ? (
                                <DayOfWeekDistributionChart data={stats.day_of_week_distribution} />
                            ) : (<Typography variant="body2" color="textSecondary" sx={{ pt: 4, textAlign: 'center' }}>No weekly data.</Typography>)}
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserStatsSection;