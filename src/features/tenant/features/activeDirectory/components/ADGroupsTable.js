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
import Tooltip from '@mui/material/Tooltip'; // For showing full DN on hover
import { format } from 'date-fns'; // For dates


const ADGroupsTable = ({ groups }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    const handleRowClick = (dn) => {
        // DN can contain special chars, ensure it's properly encoded for URL
        const encodedDN = encodeURIComponent(dn);
        navigate(`/tenant/${clientId}/ad/manage/groups/detail/${encodedDN}`);
    };

    const formatDate = (dateString) => {
        // AD timestamps might be in specific formats, adjust parsing if needed
        if (!dateString || dateString.startsWith("0001-01-01")) return '-';
        try {
            // Example format, AD might use different precision or format
            return format(new Date(dateString), 'Pp');
        } catch (e) {
            return dateString; // Fallback
        }
    };

    if (!groups || groups.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No Active Directory groups found.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="ad groups table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>Display Name</TableCell>
                        <TableCell>SAM Account Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Scope</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>When Created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groups.map((group) => (
                        <TableRow
                            key={group.objectGUID || group.dn} // Use GUID or DN as key
                            hover
                            onClick={() => handleRowClick(group.dn)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell component="th" scope="row">
                                <Tooltip title={group.distinguishedName || group.dn} arrow>
                                    <span>{group.displayName || group.name || group.samAccountName}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{group.samAccountName}</TableCell>
                            <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={group.description} arrow>
                                    <span>{group.description || '-'}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{group.scope || '-'}</TableCell>
                            <TableCell>{group.groupCategory || '-'}</TableCell>
                            <TableCell>{formatDate(group.whenCreated)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ADGroupsTable;