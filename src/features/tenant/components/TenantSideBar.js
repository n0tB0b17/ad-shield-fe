import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';

// Import Icons
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LanIcon from '@mui/icons-material/Lan';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ViewListIcon from '@mui/icons-material/ViewList';

const drawerWidth = 240;

const NavItem = ({ to, icon, primary, depth = 0, params = {}, primaryColor, secondaryColor }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                component={RouterNavLink}
                to={to}
                end
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    minHeight: 48,
                    justifyContent: 'initial',
                    px: 2.5,
                    pl: 2.5 + (depth * 2),
                    borderLeft: isActive ? `4px solid ${primaryColor}` : '4px solid transparent',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        transform: 'translateX(4px)',
                    },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: primaryColor,
                        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'bottom left',
                        transition: 'transform 0.3s ease',
                    }
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                        color: isActive ? primaryColor : 'inherit',
                        transition: 'transform 0.2s ease, color 0.3s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={primary}
                    sx={{
                        opacity: 1,
                        '& .MuiTypography-root': {
                            fontWeight: isActive ? 600 : 400,
                            transition: 'color 0.3s ease',
                            color: isActive ? primaryColor : 'inherit',
                        }
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
};

const CollapsibleNavItem = ({ icon, primary, children, initiallyOpen = false, depth = 0, primaryColor, secondaryColor }) => {
    const [open, setOpen] = useState(initiallyOpen);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const { clientId } = useParams();

    const isChildActive = React.Children.toArray(children).some(child => {
        if (React.isValidElement(child) && child.props.to) {
            return location.pathname.startsWith(child.props.to);
        }
        return false;
    });

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                    onClick={handleClick}
                    sx={{
                        pl: 2.5 + (depth * 2),
                        transition: 'all 0.3s ease',
                        backgroundColor: isChildActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        },
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: 3,
                            justifyContent: 'center',
                            color: isChildActive || isHovered ? primaryColor : 'inherit',
                            transition: 'transform 0.2s ease, color 0.3s ease',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={primary}
                        sx={{
                            '& .MuiTypography-root': {
                                fontWeight: isChildActive ? 600 : 500,
                                color: isChildActive ? primaryColor : 'inherit',
                                transition: 'color 0.3s ease',
                            }
                        }}
                    />
                    {open ? (
                        <ExpandLess sx={{
                            transition: 'transform 0.3s ease',
                            transform: 'rotate(0deg)',
                            color: isChildActive || isHovered ? primaryColor : 'inherit',
                        }} />
                    ) : (
                        <ExpandMore sx={{
                            transition: 'transform 0.3s ease',
                            transform: 'rotate(0deg)',
                            color: isChildActive || isHovered ? primaryColor : 'inherit',
                        }} />
                    )}
                </ListItemButton>
            </ListItem>
            <Collapse in={open || isChildActive} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {React.Children.map(children, child =>
                        React.isValidElement(child)
                            ? React.cloneElement(child, {
                                depth: depth + 1,
                                primaryColor,
                                secondaryColor
                            })
                            : child
                    )}
                </List>
            </Collapse>
        </>
    );
};

const TenantSidebar = ({ primaryColor = '#2196f3', secondaryColor = '#9c27b0' }) => {
    const { clientId } = useParams();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    background: `linear-gradient(to bottom, ${secondaryColor}, ${primaryColor})`,
                    color: '#fff',
                    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <Toolbar />
            <Box sx={{
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '10px',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.5)',
                    },
                },
            }}>
                <List>
                    <CollapsibleNavItem
                        icon={<LanIcon />}
                        primary="Port Scanning"
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <NavItem
                            to={`/tenant/${clientId}/port-scan/history`}
                            icon={<HistoryIcon fontSize="small" />}
                            primary="Scan History"
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />
                        <NavItem
                            to={`/tenant/${clientId}/port-scan/new`}
                            icon={<AddCircleOutlineIcon fontSize="small" />}
                            primary="New Scan"
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />
                    </CollapsibleNavItem>

                    <Divider sx={{
                        my: 1.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        width: '90%',
                        mx: 'auto',
                    }} />

                    <CollapsibleNavItem
                        icon={<FindInPageIcon />}
                        primary="Pcap Scanning"
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <NavItem
                            to={`/tenant/${clientId}/pcap/history`}
                            icon={<HistoryIcon fontSize="small" />}
                            primary="Pcap History"
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />
                        <NavItem
                            to={`/tenant/${clientId}/pcap/upload`}
                            icon={<AddCircleOutlineIcon fontSize="small" />}
                            primary="Upload Pcap"
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />
                    </CollapsibleNavItem>

                    <Divider sx={{
                        my: 1.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        width: '90%',
                        mx: 'auto',
                    }} />

                    <NavItem
                        to={`/tenant/${clientId}/ip-lookup`}
                        icon={<TravelExploreIcon />}
                        primary="IP Lookup"
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    />

                    <Divider sx={{
                        my: 1.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        width: '90%',
                        mx: 'auto',
                    }} />

                    <CollapsibleNavItem
                        icon={<GroupWorkIcon />}
                        primary="Active Directory"
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    >
                        <NavItem
                            to={`/tenant/${clientId}/ad/connect`}
                            icon={<VpnKeyIcon fontSize="small" />}
                            primary="Connect AD"
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />

                        {false && (
                            <>
                                <NavItem
                                    to={`/tenant/${clientId}/ad/roles`}
                                    icon={<ViewListIcon fontSize="small" />}
                                    primary="Roles"
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                />
                                <NavItem
                                    to={`/tenant/${clientId}/ad/users`}
                                    icon={<PeopleIcon fontSize="small" />}
                                    primary="Users"
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                />
                                <NavItem
                                    to={`/tenant/${clientId}/ad/ou`}
                                    icon={<AccountTreeIcon fontSize="small" />}
                                    primary="Organizational Units"
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                />
                            </>
                        )}
                    </CollapsibleNavItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default TenantSidebar;