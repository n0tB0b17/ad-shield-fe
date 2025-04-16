import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Company logo here
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/clients">
                        Add Roles
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/clients/add">
                        Add Client
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;