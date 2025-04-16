import apiClient from '../../services/api';

export const fetchClientsAPI = async () => {
    const response = await apiClient.get('/clients');
    if (response.data && response.data.docs) {
        return response.data.docs;
    }
    throw new Error(response.data.message || 'Failed to fetch clients');
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
