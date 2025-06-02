import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { format } from 'date-fns'; // For formatting dates

// Re-use DetailItem component (or import if common)
const DetailItem = ({ label, value, xs = 12, sm = 6, md=4 }) => ( // Adjusted default md
    <Grid item xs={xs} sm={sm} md={md} sx={{ mb: 1.5, wordBreak: 'break-word' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
            {label}
        </Typography>
        {Array.isArray(value) ? (
             value.length > 0 ? (
                <List dense disablePadding sx={{ maxHeight: 150, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.5 }}>
                    {value.map((item, index) => (
                        <ListItem disablePadding key={index} sx={{pl: 0.5}}>
                            <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }}/>
                        </ListItem>
                    ))}
                </List>
             ) : <Typography variant="body1">-</Typography>
        ) : (
             <Typography variant="body1">{value || '-'}</Typography>
        )}
    </Grid>
);

// Helper function to interpret UserAccountControl flags (copied from table)
const getUserStatusFlags = (uac) => {
    // Based on common UAC flags - MS documentation is the definitive source
    const flags = {
        SCRIPT: 0x0001, // Logon script executed
        ACCOUNTDISABLE: 0x0002,
        HOMEDIR_REQUIRED: 0x0008,
        LOCKOUT: 0x0010,
        PASSWD_NOTREQD: 0x0020,
        PASSWD_CANT_CHANGE: 0x0040, // User cannot change password
        ENCRYPTED_TEXT_PWD_ALLOWED: 0x0080,
        TEMP_DUPLICATE_ACCOUNT: 0x0100, // Local user account
        NORMAL_ACCOUNT: 0x0200, // Default account type
        INTERDOMAIN_TRUST_ACCOUNT: 0x0800,
        WORKSTATION_TRUST_ACCOUNT: 0x1000,
        SERVER_TRUST_ACCOUNT: 0x2000,
        DONT_EXPIRE_PASSWORD: 0x10000,
        MNS_LOGON_ACCOUNT: 0x20000,
        SMARTCARD_REQUIRED: 0x40000,
        TRUSTED_FOR_DELEGATION: 0x80000,
        NOT_DELEGATED: 0x100000,
        USE_DES_KEY_ONLY: 0x200000,
        DONT_REQ_PREAUTH: 0x400000, // Kerberos preauthentication not required
        PASSWORD_EXPIRED: 0x800000, // Password has expired (force change on next logon)
        TRUSTED_TO_AUTH_FOR_DELEGATION: 0x1000000,
        PARTIAL_SECRETS_ACCOUNT: 0x04000000, // RODC specific
    };

    const descriptions = [];
    if (uac & flags.ACCOUNTDISABLE) descriptions.push("Account Disabled");
    if (uac & flags.LOCKOUT) descriptions.push("Account Locked Out");
    if (uac & flags.PASSWD_NOTREQD) descriptions.push("Password Not Required");
    if (uac & flags.PASSWD_CANT_CHANGE) descriptions.push("User Cannot Change Password");
    if (uac & flags.DONT_EXPIRE_PASSWORD) descriptions.push("Password Never Expires");
    if (uac & flags.SMARTCARD_REQUIRED) descriptions.push("Smartcard Required for Logon");
    if (uac & flags.PASSWORD_EXPIRED) descriptions.push("Password Expired");
    if (uac & flags.DONT_REQ_PREAUTH) descriptions.push("Kerberos Pre-Auth Not Required");
    // Add more flags as needed

    if (descriptions.length === 0 && (uac & flags.NORMAL_ACCOUNT)) {
        descriptions.push("Normal Account (Enabled)");
    } else if (descriptions.length === 0) {
        descriptions.push("Unknown Status");
    }


    return descriptions.map((desc, i) => (
        <Chip key={i} label={desc} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }}
             color={desc.includes("Disabled") || desc.includes("Locked") || desc.includes("Expired") ? "error" : "default"}
        />
    ));
};


// Helper to format AD Timestamps (copied from table, needs careful testing)
const formatADTimestamp = (timestamp, type = 'datetime') => {
    if (!timestamp || timestamp === 0 || timestamp === "0") return 'Never';
     if (timestamp === '9223372036854775807') return 'Never Expires'; // Account Expiry 'Never'

    try {
        // big int here
        const secondsSince1601 = timestamp / 10000000n;
        const unixEpochDiffSeconds = 11644473600n;
        const unixTimestampSeconds = secondsSince1601 - unixEpochDiffSeconds;
        const date = new Date(Number(unixTimestampSeconds) * 1000);
        if (isNaN(date.getTime())) return 'Invalid Date';

        if (type === 'datetime') return format(date, 'PPpp'); // Full date and time
        if (type === 'date') return format(date, 'P'); // Short date
        return format(date, 'Pp'); // Default to medium date time
    } catch (e) {
        console.error("Error formatting AD timestamp:", timestamp, e);
        return 'Invalid Date';
    }
};

const ADUserDetailDisplay = ({ user }) => {

    if (!user) {
        return <Typography>User details not available.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                 {user.displayName || user.samAccountName} ({user.samAccountName})
            </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                 DN: {user.distinguishedName}
            </Typography>

            <Divider sx={{ my: 2 }}/>

             <Typography variant="subtitle1" gutterBottom sx={{mb: 1}}>Account Details</Typography>
            <Grid container spacing={2}>
                 <DetailItem label="User Principal Name (UPN)" value={user.userPrincipalName} />
                 <DetailItem label="SAM Account Name" value={user.samAccountName} />
                 <DetailItem label="Object GUID" value={user.objectGUID} />
                 <DetailItem label="Object SID" value={user.objectSID} />
                 <DetailItem label="Description" value={user.description} xs={12} sm={12} md={12}/>
                 <DetailItem label="Created" value={formatADTimestamp(user.whenCreated)} />
                 <DetailItem label="Last Changed" value={formatADTimestamp(user.whenChanged)} />
                 <DetailItem label="Last Logon" value={formatADTimestamp(user.lastLogonTimestamp || user.lastLogon)} />
                 <DetailItem label="Password Last Set" value={formatADTimestamp(user.pwdLastSet)} />
                 <DetailItem label="Account Expires" value={formatADTimestamp(user.accountExpires)} />
                 <Grid item xs={12}>
                     <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
                        Account Status (UserAccountControl: {user.userAccountControl})
                    </Typography>
                    <Box>{getUserStatusFlags(user.userAccountControl)}</Box>
                </Grid>
             </Grid>

             <Divider sx={{ my: 3 }}/>

            <Typography variant="subtitle1" gutterBottom sx={{mb: 1}}>Contact & Organization</Typography>
             <Grid container spacing={2}>
                 <DetailItem label="First Name (Given Name)" value={user.givenName} />
                 <DetailItem label="Last Name (Surname)" value={user.surName} />
                 <DetailItem label="Display Name" value={user.displayName} />
                 <DetailItem label="Email" value={user.mail} />
                 <DetailItem label="Telephone" value={user.telephoneNumber} />
                 <DetailItem label="Mobile" value={user.mobile} />
                 <DetailItem label="Title" value={user.title} />
                 <DetailItem label="Department" value={user.department} />
                 <DetailItem label="Company" value={user.company} />
                 <DetailItem label="Manager DN" value={user.manager} />
             </Grid>

             <Divider sx={{ my: 3 }}/>

             <Typography variant="subtitle1" gutterBottom>Group Membership ({user.memberof?.length || 0})</Typography>
             <DetailItem label="" value={user.memberof || []} xs={12} sm={12} md={12}/>


             {/* Optionally display Raw Attributes if needed for debugging */}
             {/* ... raw attributes display ... */}

        </Box>
    );
};

export default ADUserDetailDisplay;