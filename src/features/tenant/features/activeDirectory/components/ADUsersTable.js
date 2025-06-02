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
import Chip from '@mui/material/Chip';
import { format, formatDistanceToNowStrict } from 'date-fns'; // For dates


// Helper function to interpret UserAccountControl flags (simplified)
const getUserStatus = (uac) => {
    const flags = {
        ACCOUNTDISABLE: 0x0002,
        LOCKOUT: 0x0010,
        PASSWORD_EXPIRED: 0x800000 // Needs confirmation if this applies directly
    };
    const status = [];
    let color = 'success'; // Default: Active

    if (uac & flags.ACCOUNTDISABLE) {
        status.push('Disabled');
        color = 'error';
    }
    if (uac & flags.LOCKOUT) {
        status.push('Locked Out');
        color = 'warning';
    }
     // Add more checks like PASSWORD_EXPIRED if needed

    if (status.length === 0 && color === 'success') {
        status.push('Active');
    }

    return <Chip label={status.join(', ')} size="small" color={color} variant="outlined" />;
};

const ADUsersTable = ({ users }) => {
    const navigate = useNavigate();
    const { clientId } = useParams();

    const handleRowClick = (dn) => {
        if (!dn) return; // Do nothing if DN is missing
        const encodedDN = encodeURIComponent(dn);
        // navigate(`/tenant/${clientId}/ad/manage/users/detail/${encodedDN}`);
    };

     const formatDate = (dateString) => {
         if (!dateString || dateString.startsWith("0001-01-01")) return '-';
         try {
             return format(new Date(dateString), 'P'); // Short date format
         } catch (e) {
             return dateString;
         }
     };

     const formatADTimestamp = (timestamp) => {
         if (!timestamp || timestamp === 0 || timestamp === "0") return 'Never';
         try {
             // Rough conversion: FILETIME to Unix timestamp (seconds)
             const secondsSince1601 = timestamp / 10000000n; // big int here
             const unixEpochDiffSeconds = 11644473600n; // Seconds between 1601 and 1970
             const unixTimestampSeconds = secondsSince1601 - unixEpochDiffSeconds;
             const date = new Date(Number(unixTimestampSeconds) * 1000);
             // Show relative time for recent logins
             return formatDistanceToNowStrict(date, { addSuffix: true });
         } catch (e) {
             console.error("Error formatting AD timestamp:", timestamp, e);
             return 'Invalid Date';
         }
     };


    if (!users || users.length === 0) {
        return <Typography sx={{ mt: 3, textAlign: 'center' }}>No Active Directory users found.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="ad users table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                    <TableRow>
                        <TableCell>SAM Account Name</TableCell>
                        <TableCell>Display Name</TableCell>
                        <TableCell>User Principal Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Logon</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.objectGUID || user.distinguishedName}
                            hover
                            onClick={() => handleRowClick(user.distinguishedName)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell component="th" scope="row">
                                {user.samAccountName}
                            </TableCell>
                             <TableCell>
                                <Tooltip title={user.distinguishedName || ''} arrow>
                                    <span>{user.displayName || '-'}</span>
                                </Tooltip>
                             </TableCell>
                            <TableCell sx={{wordBreak: 'break-all'}}>{user.userPrincipalName || '-'}</TableCell>
                            <TableCell>{getUserStatus(user.userAccountControl)}</TableCell>
                            <TableCell>{formatADTimestamp(user.lastLogonTimestamp || user.lastLogon)}</TableCell>
                            <TableCell sx={{maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                 <Tooltip title={user.description || ''} arrow>
                                    <span>{user.description || '-'}</span>
                                </Tooltip>
                             </TableCell>
                            <TableCell>{formatDate(user.whenCreated)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ADUsersTable;