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

const ClientListTable = ({ clients }) => {
    const navigate = useNavigate();

    const handleRowClick = (clientId) => {
        navigate(`/clients/${clientId}`);
    };

    if (!clients || clients.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No clients found.</Typography>;
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="client list table">
                <TableHead sx={{ backgroundColor: 'grey.200' }}>
                    <TableRow>
                        <TableCell>Client Name</TableCell>
                        <TableCell>Organization Type</TableCell>
                        <TableCell>Admin Email</TableCell>
                        <TableCell>Headquarter</TableCell>
                        <TableCell align="center">Primary Color</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow
                            key={client.id}
                            hover
                            onClick={() => handleRowClick(client.id)}
                            sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {client.clientName}
                            </TableCell>
                            <TableCell>{client.organizationType}</TableCell>
                            <TableCell>{client.adminEmail}</TableCell>
                            <TableCell>{client.headQuarter}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={client.primaryColor}
                                    size="small"
                                    sx={{
                                        backgroundColor: client.primaryColor,
                                        color: '#fff', // Simple contrast logic, might need adjustment
                                        fontWeight: 'bold',
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                            </TableCell>
                            <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClientListTable;