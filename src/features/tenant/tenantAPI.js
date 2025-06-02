import apiClient, { authApiClient } from '../../services/api';
import { fetchClientByIdAPI as fetchClientInfo } from '../client/clientAPI';

export const loginTenantUserAPI = async (clientId, credentials) => {
    const endpoint = `/${clientId}/user/login`;
    const response = await apiClient.post(endpoint, credentials);

    if (response.data && response.data.docs && response.data.status === 'success') {
        return response.data.docs;
    }
    throw new Error(response.data.message || 'Login failed');
};


export const fetchPortScanHistoryAPI = async (clientId) => {
    const endpoint = `/${clientId}/services`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch scan history');
};

export const fetchPortScanByIdAPI = async (clientId, scanId) => {
    const endpoint = `/${clientId}/scan/history/${scanId}`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || `Failed to fetch scan ${scanId}`);
};



export const startPortScanAPI = async (clientId, scanData) => {
    const endpoint = `/${clientId}/scan/service`;
    const response = await authApiClient.post(endpoint, scanData);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to start port scan');
};


export const deletePortScanAPI = async (clientId, scanId) => {
    const endpoint = `/${clientId}/service/delete/${scanId}`;
    const response = await authApiClient.delete(endpoint);

    if (response.status === 200 || response.status === 204) {
        return { scanId };
    }

    throw new Error(response.data?.message || `Failed to delete port scan record ${scanId}`);
};




export const fetchPcapHistoryAPI = async (clientId) => {
    const endpoint = `/${clientId}/pcap/metas`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch pcap history');
};

export const uploadPcapFileAPI = async (clientId, formData) => {
    const endpoint = `/${clientId}/pcap/upload`;
    const response = await authApiClient.post(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Pcap file upload failed');
};

export const fetchPcapDetailAPI = async (clientId, pcapId) => {
    const endpoint = `/${clientId}/pcap/scan/${pcapId}`;
    const response = await authApiClient.get(endpoint);
    if (response.data && (response.data.status === 'success' || response.status === 200)) {
        return response.data;
    }

    if (response.data && response.data.status === 'pending') {
        throw new Error('Pcap analysis is still pending. Please try again later.');
    }
    if (response.data && response.data.status === 'failed') {
        throw new Error(`Pcap analysis failed: ${response.data.message || 'Unknown reason'}`);
    }
    throw new Error(response.data?.message || `Failed to fetch pcap analysis for ${pcapId}`);
};

export const deletePCAPData = async (clientId, pcapId) => {
    const endpoint = `/${clientId}/pcap/delete/${pcapId}`;
    const response = await authApiClient.delete(endpoint);

    if (response.data && (response.data.status === "success")) {
        return response.data
    }

    if (response.data && response.data.status === "failed") {
        throw new Error(`Pcap file note deleted: ${response.data.message}`)
    }
}




export const lookupIPOrDomainAPI = async (clientId, target) => {
    const endpoint = `/${clientId}/ip/lookup`;
    const response = await authApiClient.post(endpoint, { domain: target });
    if (response.data && response.data.status === 'success') {
        return response.data.docs;
    }
    throw new Error(response.data?.message || 'IP/Domain lookup failed');
};

export const fetchLookupHistoryAPI = async (clientId) => {
    const endpoint = `/${clientId}/ip/lookup/history`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.docs || [];
    }
    throw new Error(response.data?.message || 'Failed to fetch lookup history');
};

export const fetchLookupByIdAPI = async (clientId, lookupId) => {
    const endpoint = `/${clientId}/ip/lookup/${lookupId}`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.docs;
    }
    throw new Error(response.data?.message || `Failed to fetch lookup details for ${lookupId}`);
};


export const deleteLookupByIdAPI = async (clientId, lookupId) => {
    const endpoint = `/${clientId}/ip/lookup/delete/${lookupId}`;
    const response = await authApiClient.delete(endpoint);


    if (response.status === 200 || response.status === 204) {
        return { success: true, lookupId };
    }

    const errorMessage = response.data?.message || `Failed to delete lookup record ${lookupId}`;
    throw new Error(errorMessage);
};



export const authenticateADAPI = async (clientId, credentials) => {
    const endpoint = `/${clientId}/ad/authenticate`;
    const response = await authApiClient.post(endpoint, credentials);
    if (response.status === 200 || response.status === 204) {
        return response.data;
    }

    throw new Error(response.data?.message || 'AD Authentication failed');
};

export const fetchADGroupsAPI = async (clientId, connectionPayload) => {
    const endpoint = `/${clientId}/ad/object/groups`;
    const response = await authApiClient.post(endpoint, connectionPayload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch AD groups');
};


export const addADGroupAPI = async (clientId, groupPayload) => {
    const endpoint = `/${clientId}/ad/object/group/add`;
    const response = await authApiClient.post(endpoint, groupPayload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to add AD group');
};

export const fetchADGroupByIdAPI = async (clientId, groupDetailPayload) => {
    const endpoint = `/${clientId}/ad/object/group`;
    const response = await authApiClient.post(endpoint, groupDetailPayload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch AD group details');
};

export const fetchADUsersAPI = async (clientId, connectionPayload) => {
    // connectionPayload = { address, domain_name }
    const endpoint = `/${clientId}/ad/object/users`;
    const response = await authApiClient.post(endpoint, connectionPayload);
    if (response.data && response.data.status === 'success') {
        return response.data; // Contains 'users' array
    }
    throw new Error(response.data?.message || 'Failed to fetch AD users');
};

export const fetchADUserByIdAPI = async (clientId, userDetailPayload) => {
    const endpoint = `/${clientId}/ad/object/user`;
    const response = await authApiClient.post(endpoint, userDetailPayload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch AD user details');
};


export const fetchADOUsAPI = async (clientId, payload) => {
    const endpoint = `/${clientId}/ad/object/ous`;
    const response = await authApiClient.post(endpoint, payload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch AD Organizational Units');
};

export const addADOUAPI = async (clientId, payload) => {
    const endpoint = `/${clientId}/ad/object/ou/add`;
    const response = await authApiClient.post(endpoint, payload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to create AD Organizational Unit');
};


export const addADUserAPI = async (clientId, payload) => {
    const endpoint = `/${clientId}/ad/object/user/add`;
    const response = await authApiClient.post(endpoint, payload);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to create AD User');
};

export const fetchAllUsersAPI = async (clientId) => {
    const endpoint = `/${clientId}/users/all`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.users || [];
    }
    throw new Error(response.data?.message || 'Failed to fetch users');
};

export const fetchUserByIdAPI = async (clientId, userId) => {
    const endpoint = `/${clientId}/user/${userId}`;
    const response = await apiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.user || null;
    }
    throw new Error(response.data?.message || `Failed to fetch user ${userId}`);
};

export const registerUserAPI = async (clientId, userData) => {
    const endpoint = `/${clientId}/user/register`;
    const response = await authApiClient.post(endpoint, userData);
    if (response.data && response.data.status === 'success') {
        return response.data.user || { success: true };
    }
    throw new Error(response.data?.message || 'Failed to register user');
};

export const deleteUserAPI = async (clientId, userId) => {
    const endpoint = `/${clientId}/user/delete/${userId}`;
    const response = await authApiClient.delete(endpoint);
    if (response.status === 200 || response.data.status === "success") {
        return { success: true, userId };
    }

    const errorData = response.data;
    throw new Error(errorData?.message || `Failed to delete user ${userId}`);
};

export const fetchUserStatsAPI = async (clientId, userId) => {
    const endpoint = `/${clientId}/user/stats/${userId}`;
    const response = await apiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.docs || null;
    }
    throw new Error(response.data?.message || `Failed to fetch stats for user ${userId}`);
};

export const updateUserAPI = async (clientId, userId, userData) => {
    const endpoint = `/${clientId}/user/update/${userId}`;
    const response = await apiClient.put(endpoint, userData);
    if (response.data && response.data.status === 'success') {
        return response.data.user || { success: true, id: userId };
    }
    if (response.status === 400 || response.status === 422) {
        throw new Error(response.data?.message || response.data?.error || 'Update validation failed');
    }
    throw new Error(response.data?.message || 'Failed to update user');
};


export const fetchAllRolesAPI = async (clientId) => {
    const endpoint = `/${clientId}/roles`;
    const response = await apiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.role || response.data.docs || [];
    }
    throw new Error(response.data?.message || 'Failed to fetch roles');
};


export const fetchCurrentUserContextAPI = async (clientId) => {
    const endpoint = `/${clientId}/fetch/user/info`;
    const response = await authApiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data.docs;
    }
    throw new Error(response.data?.message || 'Failed to fetch user context');
};


export const generateReportAPI = async (clientId, reportPayload) => {
    const endpoint = `/${clientId}/report/generate`;
    const response = await authApiClient.post(endpoint, reportPayload);
    return response.data;
};

export const downloadReportAPI = async (fullDownloadUrl) => {
    try {
        if (fullDownloadUrl) return { status: 'success', message: 'Download URL ready.' };
        throw new Error("No download URL provided for API call.");
    } catch (error) {
        console.error("Error in downloadReportAPI (if used):", error);
        throw error;
    }
};



export const fetchTenantInfoByIdAPI = fetchClientInfo; 