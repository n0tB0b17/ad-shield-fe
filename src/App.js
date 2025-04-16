import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Super Admin Imports
import MainLayout from './components/layout/MainLayout';
import ClientsListPage from './features/client/pages/ClientsListPage';
import ClientDetailPage from './features/client/pages/ClientDetailPage';
import AddClientPage from './features/client/pages/AddClientPage';

// Tenant Imports
import TenantLayout from './features/tenant/layouts/TenantLayout';
import TenantLoginPage from './features/tenant/pages/TenantLoginPage';
import ProtectedTenantRoute from './components/common/ProtectedTenantRoute';

// Port Scan Imports
import PortScanHistoryPage from './features/tenant/features/portscan/pages/portScanHistoryPage';
import PortScanDetailPage from './features/tenant/features/portscan/pages/portScanDetailPage';
import NewPortScanPage from './features/tenant/features/portscan/pages/newPortScanPage';

// Placeholder imports for other features
import PlaceholderPage from './components/common/PlaceholderPage';


const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Super Admin Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate replace to="/clients" />} />
            <Route path="clients" element={<ClientsListPage />} />
            <Route path="clients/add" element={<AddClientPage />} />
            <Route path="clients/:clientId" element={<ClientDetailPage />} />
          </Route>

          <Route path="/tenant/:clientId" element={<TenantLayout />}>
            <Route path="login" element={<TenantLoginPage />} />

            <Route element={<ProtectedTenantRoute />}>
              <Route index element={<Navigate replace to="port-scan/history" />} />


              <Route path="port-scan">
                <Route path="history" element={<PortScanHistoryPage />} />
                <Route path="detail/:scanId" element={<PortScanDetailPage />} />
                <Route path="new" element={<NewPortScanPage />} />
                <Route index element={<Navigate replace to="history" />} />
              </Route>

              <Route path="pcap">
                <Route path="history" element={<PlaceholderPage title="Pcap History" />} />
                <Route path="upload" element={<PlaceholderPage title="Upload Pcap" />} />
                <Route index element={<Navigate replace to="history" />} />
              </Route>


              <Route path="ip-lookup" element={<PlaceholderPage title="IP Lookup" />} />

              <Route path="ad">
                <Route path="connect" element={<PlaceholderPage title="Connect Active Directory" />} />
                <Route path="roles" element={<PlaceholderPage title="AD Roles" />} />
                <Route path="users" element={<PlaceholderPage title="AD Users" />} />
                <Route path="ou" element={<PlaceholderPage title="AD Organizational Units" />} />
                <Route index element={<Navigate replace to="connect" />} />
              </Route>

              <Route path="*" element={<Navigate replace to="port-scan/history" />} />

            </Route>
            <Route path="*" element={<Navigate replace to="login" />} />
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}


export default App;