import apiClient from '../../services/api';
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
    const response = await apiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || 'Failed to fetch scan history');
};


export const fetchPortScanByIdAPI = async (clientId, scanId) => {
    const endpoint = `/${clientId}/scan/history/${scanId}`;
    const response = await apiClient.get(endpoint);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }
    throw new Error(response.data?.message || `Failed to fetch scan ${scanId}`);
};



export const startPortScanAPI = async (clientId, scanData) => {
    const endpoint = `/${clientId}/scan/service`;
    const response = await apiClient.post(endpoint, scanData);
    if (response.data && response.data.status === 'success') {
        return response.data;
    }

    throw new Error(response.data?.message || 'Failed to start port scan');
};

export const fetchTenantInfoByIdAPI = fetchClientInfo; 