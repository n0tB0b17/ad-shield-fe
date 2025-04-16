import React from 'react';
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar';

const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavBar />
            <Container
                component="main"
                sx={{
                    mt: 2, // Small gap below navbar (16px)
                    mb: 4, // Bottom margin for spacing above footer (32px)
                    flexGrow: 1, // Fill vertical space
                    px: { xs: 2, sm: 3, md: 4 }, // Responsive padding: 16px (xs), 24px (sm), 32px (md)
                    width: '100%', // Ensure full width without centering
                    maxWidth: 'none', // Disable default Container maxWidth
                }}
            >
                <Outlet /> {/* Page content renders here */}
            </Container>
            <Box
                component="footer"
                sx={{
                    p: 2,
                    mt: 'auto',
                    backgroundColor: 'grey.200',
                    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)', // Subtle top shadow
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {'© '}
                    {new Date().getFullYear()}
                    {' Your Company'}
                </Typography>
            </Box>
        </Box>
    );
};

export default MainLayout;