import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClientsAPI, fetchClientByIdAPI, addClientAPI } from './clientAPI';

// Async Thunks
export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchClientsAPI();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch clients');
        }
    }
);

export const fetchClientById = createAsyncThunk(
    'clients/fetchClientById',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientByIdAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || `Failed to fetch client ${clientId}`);
        }
    }
);

export const addClient = createAsyncThunk(
    'clients/addClient',
    async (clientData, { rejectWithValue }) => {
        try {
            // Map frontend state names to backend API expected names
            const apiPayload = {
                clientName: clientData.clientName,
                description: clientData.description,
                organizationType: clientData.organizationType,
                headQuarter: clientData.headQuarter,
                adminUserName: clientData.adminUserName, // Assuming backend expects this
                adminEmail: clientData.adminEmail,
                adminPassword: clientData.adminPassword,
                primaryColorHex: clientData.primaryColorHex,
                secondaryColorHex: clientData.secondaryColorHex,
            };
            const response = await addClientAPI(apiPayload);
            return response; // Or potentially return the newly added client if API provides it
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add client');
        }
    }
);

const initialState = {
    items: [], // For the list of clients
    selectedClient: null, // For the detail view
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    addClientStatus: 'idle', // Specific status for add operation
    addClientError: null,
};

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        resetAddClientStatus: (state) => {
            state.addClientStatus = 'idle';
            state.addClientError = null;
        },
        clearSelectedClient: (state) => {
            state.selectedClient = null;
            state.status = 'idle'; // Reset status when leaving detail page
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Clients List
            .addCase(fetchClients.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Map backend snake_case to frontend camelCase if needed
                state.items = action.payload.map(client => ({
                    id: client.id,
                    clientName: client.client_name,
                    description: client.description,
                    organizationType: client.organization_type,
                    headQuarter: client.headquarter, // Corrected mapping
                    adminName: client.admin_name,
                    adminEmail: client.admin_email,
                    primaryColor: client.primary_color,
                    secondaryColor: client.secondary_color,
                    createdAt: client.created_at,
                    updatedAt: client.updated_at,
                }));
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch Client By ID
            .addCase(fetchClientById.pending, (state) => {
                state.status = 'loading';
                state.selectedClient = null; // Clear previous selection
                state.error = null;
            })
            .addCase(fetchClientById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Map backend snake_case to frontend camelCase
                const client = action.payload;
                state.selectedClient = {
                    id: client.id,
                    clientName: client.client_name,
                    description: client.description,
                    organizationType: client.organization_type,
                    headQuarter: client.headquarter, // Corrected mapping
                    adminName: client.admin_name,
                    adminEmail: client.admin_email,
                    // Password should generally not be stored or displayed
                    primaryColor: client.primary_color,
                    secondaryColor: client.secondary_color,
                    createdAt: client.created_at,
                    updatedAt: client.updated_at,
                };
            })
            .addCase(fetchClientById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.selectedClient = null;
            })
            // Add Client
            .addCase(addClient.pending, (state) => {
                state.addClientStatus = 'loading';
                state.addClientError = null;
            })
            .addCase(addClient.fulfilled, (state, action) => {
                state.addClientStatus = 'succeeded';
                // Optionally add the new client to the state.items list if API returns it
                // Or just rely on fetching the list again after redirect
            })
            .addCase(addClient.rejected, (state, action) => {
                state.addClientStatus = 'failed';
                state.addClientError = action.payload;
            });
    },
});

export const { resetAddClientStatus, clearSelectedClient } = clientSlice.actions;

export default clientSlice.reducer;