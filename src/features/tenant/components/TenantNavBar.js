import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';

// Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import { logoutTenantUser } from '../tenantSlice';

const drawerWidth = 240;

const TenantNavBar = ({ tenantInfo }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { clientId } = useParams();
    const { isAuthenticated } = useSelector(state => state.tenants);

    // For user menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Extract colors or use defaults
    const primaryColor = tenantInfo?.secondaryColor || '#2196f3';
    const secondaryColor = tenantInfo?.primaryColor || '#9c27b0';

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        dispatch(logoutTenantUser());
        navigate(`/tenant/${clientId}/login`);
    };

    return (
        <AppBar
            position="fixed"
            elevation={3}
            sx={{
                width: isAuthenticated ? `calc(100% - ${drawerWidth}px)` : '100%',
                ml: isAuthenticated ? `${drawerWidth}px` : 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                transition: (theme) => theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
            }}
        >
            <Toolbar sx={{ minHeight: 64 }}>
                {/* Left side - Tenant Logo & Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    {tenantInfo?.logoUrl ? (
                        <Avatar
                            src={tenantInfo.logoUrl}
                            alt={tenantInfo?.clientName || 'Tenant'}
                            sx={{
                                width: 40,
                                height: 40,
                                mr: 2,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                border: '2px solid rgba(255,255,255,0.8)',
                            }}
                        />
                    ) : (
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                mr: 2,
                                bgcolor: alpha('#fff', 0.2),
                                color: '#fff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                border: '2px solid rgba(255,255,255,0.8)',
                            }}
                        >
                            {(tenantInfo?.clientName?.[0] || 'T').toUpperCase()}
                        </Avatar>
                    )}

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                    >
                        {tenantInfo?.clientName || 'Tenant Portal'}
                    </Typography>
                </Box>

                {/* Right side - Authentication */}
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to={`/tenant/${clientId}`}
                            startIcon={<DashboardIcon />}
                            sx={{
                                mx: 1,
                                textTransform: 'none',
                                fontWeight: 500,
                                background: alpha('#fff', 0.1),
                                '&:hover': {
                                    background: alpha('#fff', 0.2),
                                },
                                transition: 'all 0.2s ease-in-out',
                                borderRadius: '8px',
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            Dashboard
                        </Button>

                        <Tooltip title="Account settings">
                            <Button
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleMenu}
                                color="inherit"
                                endIcon={<ArrowDropDownIcon />}
                                startIcon={<AccountCircleIcon />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    background: alpha('#fff', 0.1),
                                    '&:hover': {
                                        background: alpha('#fff', 0.2),
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                    borderRadius: '8px',
                                }}
                            >
                                Account
                            </Button>
                        </Tooltip>

                        <Menu
                            id="account-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    minWidth: 180,
                                    mt: 1,
                                    borderRadius: '8px',
                                    overflow: 'visible',
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                        >
                            <MenuItem
                                onClick={handleClose}
                                sx={{
                                    py: 1.5,
                                    gap: 2,
                                    '&:hover': { bgcolor: alpha(primaryColor, 0.1) }
                                }}
                            >
                                <SettingsIcon fontSize="small" color="action" />
                                <Typography variant="body2">Settings</Typography>
                            </MenuItem>

                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    py: 1.5,
                                    gap: 2,
                                    '&:hover': { bgcolor: alpha('#f44336', 0.1) }
                                }}
                            >
                                <LogoutIcon fontSize="small" color="error" />
                                <Typography variant="body2" color="error">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to={`/tenant/${clientId}/login`}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 0.75,
                            borderRadius: '8px',
                            background: alpha('#fff', 0.15),
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                background: alpha('#fff', 0.25),
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default TenantNavBar;