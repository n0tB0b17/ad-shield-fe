import React, { useEffect, useMemo } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTenantInfoById, clearTenantInfo } from '../tenantSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Toolbar } from '@mui/material';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import TenantNavBar from '../components/TenantNavBar';
import TenantSidebar from '../components/TenantSideBar';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

const generateTenantTheme = (primaryColor, secondaryColor) => {
    return createTheme({
        palette: {
            primary: {
                main: primaryColor || '#1976d2',
            },
            secondary: {
                main: secondaryColor || '#dc004e',
            },
        },
    });
};

const TenantLayout = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { currentTenantInfo, infoStatus, infoError, isAuthenticated } = useSelector((state) => state.tenants); // Add isAuthenticated

    useEffect(() => {
        if (clientId) {
            dispatch(fetchTenantInfoById(clientId));
        }
        return () => {
            dispatch(clearTenantInfo());
        };
    }, [clientId, dispatch]);

    const tenantTheme = useMemo(() => {
        if (infoStatus === 'succeeded' && currentTenantInfo) {
            return generateTenantTheme(currentTenantInfo.primaryColor, currentTenantInfo.secondaryColor);
        }
        return createTheme();
    }, [infoStatus, currentTenantInfo]);

    // Handle Loading State
    if (infoStatus === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader />
                <Typography sx={{ ml: 2 }}>Loading Tenant Information...</Typography>
            </Box>
        );
    }

    // Handle Error State
    if (infoStatus === 'failed') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3 }}>
                <ErrorMessage message={`Error loading tenant: ${infoError || 'Tenant not found or inaccessible.'}`} />
            </Box>
        );
    }


    if (infoStatus === 'succeeded' && currentTenantInfo) {
        return (
            <ThemeProvider theme={tenantTheme}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <TenantNavBar tenantInfo={currentTenantInfo} />
                    {isAuthenticated && <TenantSidebar
                        primaryColor={currentTenantInfo.primaryColor}
                        secondaryColor={currentTenantInfo.secondaryColor}
                    />}

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            width: `calc(100% - ${isAuthenticated ? drawerWidth : 0}px)`,

                            transition: (theme) => theme.transitions.create(['width', 'margin'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                        }}
                    >
                        <Toolbar />
                        <Outlet />
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }

    return null;
};

export default TenantLayout;