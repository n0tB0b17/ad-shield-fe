import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';

const ADOUsTable = ({ ous }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    const handleRowClick = (dn) => {
        const encodedDN = encodeURIComponent(dn);
        // navigate(`/tenant/${clientId}/ad/manage/ou/detail/${encodedDN}`);
        console.log("Navigate to OU detail for:", dn);
        alert(`OU Detail page for ${dn} is not yet implemented.`);
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString.startsWith("0001-01-01")) return '-';
        try {
            return format(new Date(dateString), 'Pp'); // e.g., Aug 21, 2024, 4:30 PM
        } catch (e) {
            return dateString; // Fallback
        }
    };

    if (!ous || ous.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No Active Directory Organizational Units found.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="ad ous table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Distinguished Name</TableCell>
                        <TableCell sx={{ minWidth: 250 }}>Description</TableCell>
                        <TableCell>When Created</TableCell>
                        <TableCell>When Changed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ous.map((ou) => (
                        <TableRow
                            key={ou.objectGUID || ou.distinguishedName}
                            hover
                            // onClick={() => handleRowClick(ou.distinguishedName)}
                            sx={{ cursor: 'default' }}
                        >
                            <TableCell component="th" scope="row">
                                {ou.name}
                            </TableCell>
                            <TableCell>
                                <Tooltip title={ou.distinguishedName} arrow>
                                    <span>{ou.distinguishedName}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={ou.description || ''} arrow>
                                    <span>{ou.description || '-'}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{formatDate(ou.whenCreated)}</TableCell>
                            <TableCell>{formatDate(ou.whenChanged)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ADOUsTable;