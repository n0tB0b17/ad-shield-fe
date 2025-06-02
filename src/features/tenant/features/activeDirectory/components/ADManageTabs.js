import React from 'react';
import { useLocation, NavLink as RouterNavLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function a11yProps(basePath, index) {
    return {
        id: `${basePath}-tab-${index}`,
        'aria-controls': `${basePath}-tabpanel-${index}`,
    };
}

const ADManageTabs = () => {
    const location = useLocation();
    const { clientId } = useParams();

    const basePath = `/tenant/${clientId}/ad/manage`;

    // Determine the active tab based on the current path
    let currentTab = 0; // Default to Groups
    if (location.pathname.startsWith(`${basePath}/users`)) {
        currentTab = 1;
    } else if (location.pathname.startsWith(`${basePath}/ou`)) {
        currentTab = 2;
    }

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} aria-label="Active Directory Management Tabs">
                <Tab
                    label="Groups"
                    component={RouterNavLink}
                    to={`${basePath}/groups`}
                    {...a11yProps('ad-manage', 0)}
                />
                <Tab
                    label="Users"
                    component={RouterNavLink}
                    to={`${basePath}/users`} // Update when implemented
                    {...a11yProps('ad-manage', 1)}
                />
                <Tab
                    label="Organizational Units"
                    component={RouterNavLink}
                    to={`${basePath}/ou`} // Update when implemented
                    {...a11yProps('ad-manage', 2)}
                />
            </Tabs>
        </Box>
    );
};

export default ADManageTabs;