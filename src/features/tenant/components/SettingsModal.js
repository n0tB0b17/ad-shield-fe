import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { clearSelectedUser, fetchUserById, fetchUserStats, resetUpdateStatus } from '../features/users/usersSlice'
import ThemeToggle from '../../../components/modes/darkToggle';
import UserProfileTab from './UserProfileTab';
import UserStatsSection from '../features/users/components/UserStatsSection';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PlaceholderPage from '../../../components/common/PlaceholderPage'


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}> {/* Add padding top to content */}
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `settings-tab-${index}`,
        'aria-controls': `settings-tabpanel-${index}`,
    };
}


const SettingsModal = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);
    const { clientId } = useParams();
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.tenants);

    useEffect(() => {
        if (currentUser?.id && clientId) {
            dispatch(fetchUserById({ clientId, userId: currentUser?.id }))
            dispatch(fetchUserStats({ clientId, userId: currentUser?.id }))

            return () => {
                dispatch(clearSelectedUser());
                dispatch(resetUpdateStatus());
            };
        }


    }, [dispatch, fetchUserById, fetchUserStats, clearSelectedUser, resetUpdateStatus])



    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md" // Adjust size as needed (sm, md, lg)
            aria-labelledby="settings-dialog-title"
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }} id="settings-dialog-title">
                <SettingsIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Settings
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}> {/* Remove default padding, handle inside */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="Settings Tabs"
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Preferences" icon={<TuneIcon />} iconPosition="start" {...a11yProps(0)} />
                        <Tab label="Activity Log" icon={<HistoryIcon />} iconPosition="start" {...a11yProps(1)} />
                        <Tab label="Profile" icon={<AccountCircleIcon />} iconPosition="start" {...a11yProps(2)} />
                    </Tabs>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    <TabPanel value={activeTab} index={0}>
                        <Typography align='center' variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}> Choose theme </Typography>
                        <ThemeToggle />
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        {currentUser?.id ? (
                            <UserStatsSection userId={currentUser.id} />
                        ) : (
                            <PlaceholderPage title="Activity Log requires user data..." />
                        )}
                    </TabPanel>
                    <TabPanel value={activeTab} index={2}>
                        <UserProfileTab />
                    </TabPanel>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

SettingsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};


export default SettingsModal;