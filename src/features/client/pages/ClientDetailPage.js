import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchClientById,
    clearSelectedClient,
    resetDeleteStatus
} from '../clientSlice'; // Import new actions
import LoadingAnimation from '../../../components/loading/loading'
import SuccessAnimation from '../../../components/loading/success'
import ClientDetailDisplay from '../components/ClientDetailDisplay';
import ClientIpLookupTabContent from '../components/ClientIpLookupTabContent'
import ClientPcapTabContent from '../components/ClientPcapTabContent';
import ClientPortScanTabContent from '../components/ClientPortScanTabContent'
import ClientUserTabContent from '../components/ClientUserTabContent';
import ClientRoleTabContent from '../components/ClientRoleTabContent'
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ClientPortScanDetail from '../components/ClientPortScanDetail';
import NotFoundAnimation from '../../../components/loading/notFound';
import ErrorAnimation from '../../../components/loading/error';



// Helper component for Tab Panels
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`client-tabpanel-${index}`}
            aria-labelledby={`client-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}> {/* Add padding top */}
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `client-tab-${index}`,
        'aria-controls': `client-tabpanel-${index}`,
    };
}

const ClientDetailPage = () => {
    const { clientId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        selectedClient,
        status: clientStatus,
        error: clientError,
        deleteStatus,
        deleteError
    } = useSelector((state) => state.clients);

    const [currentTab, setCurrentTab] = useState(0);
    const [selectedScanId, setSelectedScanId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (clientId) {
            dispatch(fetchClientById(clientId));
        }

        return () => {
            dispatch(clearSelectedClient());
        };
    }, [clientId, dispatch]);

    useEffect(() => {
        if (deleteStatus === 'succeeded') {
            setSnackbarMessage(`Client "${selectedClient?.clientName || 'Client'}" deleted successfully.`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            const timer = setTimeout(() => {
                navigate('/clients');
                dispatch(resetDeleteStatus());
            }, 2000);

            return () => clearTimeout(timer);

        } else if (deleteStatus === 'failed') {
            setSnackbarMessage(`Failed to delete client: ${deleteError}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [deleteStatus, deleteError, navigate, dispatch, selectedClient?.clientName]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        if (deleteStatus === 'failed' || deleteStatus === 'succeeded') {
            dispatch(resetDeleteStatus());
        }
    };


    let clientContent;
    if (deleteStatus === "succeeded") {
        clientContent = <SuccessAnimation message='client deleted successfully' />
    }
    else if (clientStatus === 'loading' && deleteStatus !== 'loading') {
        clientContent = <LoadingAnimation />;
    } else if (clientStatus === 'failed') {
        clientContent = <ErrorAnimation message={clientError || 'Could not load client details.'} />;
    } else if ((clientStatus === 'succeeded' && !selectedClient) && deleteStatus !== 'succeeded') { // Don't show "not found" if delete succeeded
        clientContent = <Typography sx={{ mt: 3 }}>Client not found.</Typography>;
    } else if (selectedClient) {
        clientContent = (
            <Paper sx={{ mt: 2, opacity: deleteStatus === 'loading' ? 0.6 : 1, pointerEvents: deleteStatus === 'loading' ? 'none' : 'auto' }}> {/* Dim and disable during delete */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="Client detail tabs">
                        <Tab label="General Information" {...a11yProps(0)} />
                        <Tab label="Port Scan History" {...a11yProps(1)} disabled={deleteStatus === 'loading'} />
                        <Tab label="PCAP Scan" {...a11yProps(2)} disabled={deleteStatus === 'loading'} />
                        <Tab label="IP Lookup" {...a11yProps(3)} disabled={deleteStatus === 'loading'} />
                        <Tab label="Users" {...a11yProps(4)} disabled={deleteStatus === 'loading'} />
                        <Tab label="Roles" {...a11yProps(5)} disabled={deleteStatus === 'loading'} />
                    </Tabs>
                </Box>

                <TabPanel value={currentTab} index={0}> <ClientDetailDisplay client={selectedClient} /> </TabPanel>
                <TabPanel value={currentTab} index={1}> <ClientPortScanTabContent clientId={clientId} /> </TabPanel>
                <TabPanel value={currentTab} index={2}> <ClientPcapTabContent clientId={clientId} /> </TabPanel>
                <TabPanel value={currentTab} index={3}> <ClientIpLookupTabContent clientId={clientId} /> </TabPanel>
                <TabPanel value={currentTab} index={4}> <ClientUserTabContent clientId={clientId} /> </TabPanel>
                <TabPanel value={currentTab} index={5}> <ClientRoleTabContent clientId={clientId} /> </TabPanel>
            </Paper>
        );
    }
    else {
        clientContent = <NotFoundAnimation />;
    }

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/clients')}
                    sx={{ mr: 2 }}
                >
                    Back to List
                </Button>
            </Box>

            {clientContent}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ClientDetailPage;


