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
                maxWidth={false}
                sx={{
                    mt: 1,
                    mb: 2,
                    flexGrow: 1,
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Outlet />
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
                    {' ADScanner'}
                </Typography>
            </Box>
        </Box>
    );
};

export default MainLayout;