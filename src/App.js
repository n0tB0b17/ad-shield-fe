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

import VulnerabilityScanLayoutPage from './features/tenant/features/portscan/pages/vulnerabilityScanLayoutPage';
import ExploitDbScanPage from './features/tenant/features/portscan/vulnerabilityScan/pages/exploitDBScan';
import VulnersScanPage from './features/tenant/features/portscan/vulnerabilityScan/pages/vulnersScan';
import MitreScanPage from './features/tenant/features/portscan/vulnerabilityScan/pages/mitreScanPage';

// Placeholder imports for other features
import PlaceholderPage from './components/common/PlaceholderPage';

import PcapHistoryPage from './features/tenant/features/pcapScan/pages/pcapHistoryPage';
import PcapDetailPage from './features/tenant/features/pcapScan/pages/pcapDetailPage'

import IpLookupPage from './features/tenant/features/ipLookup/pages/ipLookupPage'
import IpLookupDetailPage from './features/tenant/features/ipLookup/pages/ipLookupDetailPage'
import IpLookupHistoryPage from './features/tenant/features/ipLookup/pages/ipLookupHistoryPage'

import ADConnectPage from './features/tenant/features/activeDirectory/pages/ADConnectPage'
import ADManageLayout from './features/tenant/features/activeDirectory/layouts/ADManageLayout'
import ADGroupsPage from './features/tenant/features/activeDirectory/pages/ADGroupPage'
import AddADGroupPage from './features/tenant/features/activeDirectory/pages/ADAddGroupPage'
import ADGroupDetailPage from './features/tenant/features/activeDirectory/pages/ADGroupDetailPage'
import ADUsersPage from './features/tenant/features/activeDirectory/pages/ADUsersPage';
import ADUserDetailPage from './features/tenant/features/activeDirectory/pages/ADUserDetailPage';

import ADOUPage from './features/tenant/features/activeDirectory/pages/ADOUPage'
import AddADOUPage from './features/tenant/features/activeDirectory/pages/ADAddOUPage'
import AddADUserPage from './features/tenant/features/activeDirectory/pages/ADAddUserPage'


import UserDetailPage from './features/tenant/features/users/pages/UserDetailPage';
import UserListPage from './features/tenant/features/users/pages/UsersListPage';
import AddUserPage from './features/tenant/features/users/pages/AddUserPage';



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
                <Route path="new" element={<NewPortScanPage />} />
                <Route path="detail/:scanId">
                  <Route index element={<PortScanDetailPage />} />
                  <Route path="vulnerability-scan" element={<VulnerabilityScanLayoutPage />}>
                    <Route index element={<Navigate replace to="exploit-db" />} />
                    <Route path="exploit-db" element={<ExploitDbScanPage />} />
                    <Route path="vulners" element={<VulnersScanPage />} />
                    <Route path="mitre" element={<MitreScanPage />} />
                  </Route>
                </Route>
                <Route index element={<Navigate replace to="history" />} />
              </Route>

              <Route path="pcap">
                <Route path="history" element={<PcapHistoryPage />} />
                <Route path="detail/:pcapId" element={<PcapDetailPage />} />
                <Route path="upload" element={<PlaceholderPage title="Upload Pcap" />} />
                <Route index element={<Navigate replace to="history" />} />
              </Route>

              <Route path="ip-lookup">
                <Route path="history" element={<IpLookupHistoryPage />} />
                <Route path="detail/:lookupId" element={<IpLookupDetailPage />} />
                <Route index element={<IpLookupPage />} />
              </Route>

              <Route path="reports">
                <Route index element={<PlaceholderPage title="Report generator, coming soon..." />} />
              </Route>

              <Route path="ad">
                <Route path='connections' element={<PlaceholderPage />} />
                <Route path="connect" element={<ADConnectPage />} />
                <Route path="manage" element={<ADManageLayout />}>
                  <Route path="groups" element={<ADGroupsPage />} />
                  <Route path="groups/add" element={<AddADGroupPage />} />
                  <Route path="groups/detail/:groupDN" element={<ADGroupDetailPage />} />
                  <Route path="users" element={<ADUsersPage />} />
                  <Route path="users/add" element={<AddADUserPage />} />
                  <Route path="users/detail/:userDN" element={<ADUserDetailPage />} />

                  <Route path="ou" element={<ADOUPage />} />
                  <Route path="ou/add" element={<AddADOUPage />} />
                  <Route index element={<Navigate replace to="groups" />} />
                </Route>
                <Route index element={<Navigate replace to="connect" />} />
              </Route>

              <Route path='users'>
                <Route path="list" element={<UserListPage />} />
                <Route path="add" element={<AddUserPage />} />
                <Route path='detail/:userId' element={<UserDetailPage />} />
                <Route index element={<Navigate replace to="list" />} />
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