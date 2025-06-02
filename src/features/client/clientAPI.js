import apiClient from '../../services/api';

export const fetchClientsAPI = async () => {
    const response = await apiClient.get('/clients');
    if (response.data && response.data.docs) {
        return response.data.docs;
    }
    throw new Error(response.data.message || 'Failed to fetch clients');
};

export const fetchClientsStatsAPI = async () => {
    const response = await apiClient.get('/clients/stats');
    if (response.data && response.data.status === 'success' && response.data.stats) {
        return response.data.stats;
    }
    throw new Error(response.data?.message || 'Failed to fetch client statistics');
};

export const fetchClientByIdAPI = async (clientId) => {
    const response = await apiClient.get(`/client/${clientId}`);
    if (response.data && response.data.docs) {
        return response.data.docs;
    }
    throw new Error(response.data.message || `Failed to fetch client ${clientId}`);
};

export const addClientAPI = async (clientData) => {
    const response = await apiClient.post('/add/client', clientData);
    if (response.status === 200 || response.status === 201) {
        return response.data;
    }
    throw new Error(response.data.message || 'Failed to add client');
};

export const deleteClientAPI = async (clientId) => {
    const response = await apiClient.delete(`/client/${clientId}/delete`);
    if (response.status === 200 || response.status === 204) {
        return response.data || true;
    }

    const errorMsg = response.data?.message || response.statusText || `Failed to delete client ${clientId}`;
    throw new Error(errorMsg);
};

export const fetchClientPortScansAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/services`);
    if (response.data && response.data.status === 'success' && response.data.roles) {
        return response.data.roles;
    }
    throw new Error(response.data?.message || `Failed to fetch port scans for client ${clientId}`);
};


export const fetchClientPortScanDetailAPI = async (clientId, serviceId) => {
    const response = await apiClient.get(`/clients/${clientId}/service/${serviceId}`);

    if (response.data && response.data.status === 'success' && response.data.role) {
        return response.data.role;
    }
    throw new Error(response.data?.message || `Failed to fetch port scan detail ${serviceId}`);
};

export const fetchClientPortScanStatsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/services/stats`);

    if (response.data && response.data.status === 'success' && response.data.stats) {
        return response.data.stats;
    }
    throw new Error(response.data?.message || `Failed to fetch port scan stats for client ${clientId}`);
};

export const fetchClientPcapStatsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/pcaps/stats`);
    if (response.data && response.data.status === 'success' && response.data.stats) {
        return response.data.stats; // Return the stats object
    }
    throw new Error(response.data?.message || `Failed to fetch PCAP stats for client ${clientId}`);
};

export const fetchClientPcapDetailAPI = async (clientId, pcapId) => {
    const response = await apiClient.get(`/clients/${clientId}/pcap/${pcapId}`);
    if (response.data && response.data.status === 'success' && response.data.pcap) {
        return response.data.pcaps;
    }
    throw new Error(response.data?.message || `Failed to fetch PCAP detail ${pcapId}`);
};

export const fetchClientPcapsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/pcaps`);
    if (response.data && response.data.status === 'success' && response.data.pcaps) {
        return response.data.pcaps;
    }
    throw new Error(response.data?.message || `Failed to fetch PCAPs for client ${clientId}`);
};


export const fetchClientIpLookupsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/lookups`);
    if (response.data && response.data.status === 'success' && response.data.lookups) {
        return response.data.lookups;
    }
    throw new Error(response.data?.message || `Failed to fetch IP Lookups for client ${clientId}`);
};


export const fetchClientIpLookupStatsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/lookups/stats`);
    if (response.data && response.data.status === 'success' && response.data.stats) {
        return response.data.stats;
    }
    throw new Error(response.data?.message || `Failed to fetch IP Lookup stats for client ${clientId}`);
};


export const fetchClientIpLookupDetailAPI = async (clientId, lookupId) => {
    const response = await apiClient.get(`/clients/${clientId}/lookup/${lookupId}`);
    if (response.data && response.data.status === 'success' && response.data.lookup) {
        return response.data.lookup;
    }
    throw new Error(response.data?.message || `Failed to fetch IP Lookup detail ${lookupId}`);
};

export const fetchClientUsersAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/users`);
    if (response.data && response.data.status === 'success' && response.data.users) {
        return response.data.users;
    }
    throw new Error(response.data?.message || `Failed to fetch users for client ${clientId}`);
};

export const fetchClientUserStatsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/users/stats`);
    if (response.data && response.data.status === 'success' && response.data.stats) {
        return response.data.stats;
    }
    throw new Error(response.data?.message || `Failed to fetch user stats for client ${clientId}`);
};

export const fetchClientUserDetailStatsAPI = async (clientId, userId) => {
    const response = await apiClient.get(`/${clientId}/user/stats/${userId}`);
    if (response.data && response.data.status === 'success' && response.data.docs) {
        return response.data.docs;
    }
    throw new Error(response.data?.message || `Failed to fetch detailed stats for user ${userId}`);
};


export const fetchClientRolesAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/roles`);
    if (response.data && response.data.status === 'success') {
        return response.data.roles;
    }
    throw new Error(response.data?.message || `Failed to fetch roles for client ${clientId}`);
};


export const fetchClientRoleStatsAPI = async (clientId) => {
    const response = await apiClient.get(`/clients/${clientId}/roles/stats`);
    if (response.data && response.data.status === 'success' && response.data.stats) {
        return response.data.stats;
    }
    throw new Error(response.data?.message || `Failed to fetch role stats for client ${clientId}`);
};


export const fetchClientRoleDetailAPI = async (clientId, roleId) => {
    const response = await apiClient.get(`/clients/${clientId}/role/${roleId}`);
    if (response.data && response.data.status === 'success' && response.data.role) {
        return response.data.role;
    }
    throw new Error(response.data?.message || `Failed to fetch role detail ${roleId}`);
};

export const addClientRoleAPI = async (clientId, roleData) => {
    const response = await apiClient.post(`/${clientId}/roles/add`, roleData);
    if (response.data && response.data.status === 'success') {
        return response.data.role; // Return the newly created role object
    }

    const errorMsg = response.data?.message || response.data?.description || 'Failed to add role';
    throw new Error(errorMsg);
};


export const deleteClientRoleAPI = async (clientId, roleId) => {
    const response = await apiClient.delete(`/${clientId}/role/delete/${roleId}`);
    if (response.data && response.data.status === 'success') {
        return { roleId };
    }

    const errorMsg = response.data?.message || response.data?.description || 'Failed to delete role';
    throw new Error(errorMsg);
};