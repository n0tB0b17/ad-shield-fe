import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const ClientListTable = ({ clients }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleRowClick = (clientId) => {
        navigate(`/clients/${clientId}`);
    };

    if (!clients || clients.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No clients found.</Typography>;
    }

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                mt: 3,
                overflowX: 'auto',
                '& .MuiTable-root': {
                    minWidth: { xs: '100%', sm: 650 }
                }
            }}
        >
            <Table aria-label="client list table">
                <TableHead sx={{ backgroundColor: 'grey.200' }}>
                    <TableRow>
                        <TableCell>Client Name</TableCell>
                        {!isMobile && <TableCell>Organization Type</TableCell>}
                        <TableCell>Admin Email</TableCell>
                        {!isTablet && <TableCell>Headquarter</TableCell>}
                        {!isMobile && <TableCell align="center">Primary Color</TableCell>}
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow
                            key={client.id}
                            hover
                            onClick={() => handleRowClick(client.id)}
                            sx={{ 
                                cursor: 'pointer',
                                '&:last-child td, &:last-child th': { border: 0 },
                                '& td': {
                                    maxWidth: {
                                        xs: '120px',
                                        sm: '200px',
                                        md: 'unset'
                                    },
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        >
                            <TableCell 
                                component="th" 
                                scope="row"
                                sx={{
                                    fontWeight: 'medium',
                                    minWidth: { xs: '120px', sm: 'unset' }
                                }}
                            >
                                {client.clientName}
                            </TableCell>
                            {!isMobile && <TableCell>{client.organizationType}</TableCell>}
                            <TableCell>{client.adminEmail}</TableCell>
                            {!isTablet && <TableCell>{client.headQuarter}</TableCell>}
                            {!isMobile && (
                                <TableCell align="center">
                                    <Chip
                                        label={client.primaryColor}
                                        size="small"
                                        sx={{
                                            backgroundColor: client.primaryColor,
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            maxWidth: '100%'
                                        }}
                                    />
                                </TableCell>
                            )}
                            <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClientListTable;