import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchClientsAPI,
    fetchClientsStatsAPI,
    fetchClientByIdAPI,
    addClientAPI,
    deleteClientAPI,
    fetchClientPortScansAPI,
    fetchClientPortScanDetailAPI,
    fetchClientPortScanStatsAPI,
    fetchClientPcapStatsAPI,
    fetchClientPcapDetailAPI,
    fetchClientPcapsAPI,
    fetchClientIpLookupsAPI,
    fetchClientIpLookupStatsAPI,
    fetchClientIpLookupDetailAPI,
    fetchClientUsersAPI,
    fetchClientUserStatsAPI,
    fetchClientUserDetailStatsAPI,
    fetchClientRolesAPI,
    fetchClientRoleStatsAPI,
    fetchClientRoleDetailAPI,
    addClientRoleAPI,
    deleteClientRoleAPI,
} from './clientAPI';

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

export const fetchClientStats = createAsyncThunk(
    'clients/fetchClientStats',
    async (_, { rejectWithValue }) => { // No arguments needed
        try {
            const data = await fetchClientsStatsAPI();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch client stats');
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

export const fetchClientPortScans = createAsyncThunk(
    'clients/fetchClientPortScans',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientPortScansAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch port scans');
        }
    }
);

export const fetchClientPortScanDetail = createAsyncThunk(
    'clients/fetchClientPortScanDetail',
    async ({ clientId, serviceId }, { rejectWithValue }) => {
        try {
            const data = await fetchClientPortScanDetailAPI(clientId, serviceId);
            return data; // Returns the single scan detail object
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch port scan detail');
        }
    }
);


export const addClient = createAsyncThunk(
    'clients/addClient',
    async (clientData, { rejectWithValue }) => {
        try {
            const apiPayload = {
                clientName: clientData.clientName,
                description: clientData.description,
                organizationType: clientData.organizationType,
                headQuarter: clientData.headQuarter,
                adminUserName: clientData.adminUserName,
                adminEmail: clientData.adminEmail,
                adminPassword: clientData.adminPassword,
                primaryColorHex: clientData.primaryColorHex,
                secondaryColorHex: clientData.secondaryColorHex,
            };
            const response = await addClientAPI(apiPayload);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add client');
        }
    }
);

export const deleteClient = createAsyncThunk(
    'clients/deleteClient',
    async (clientId, { rejectWithValue }) => {
        try {
            await deleteClientAPI(clientId);
            return clientId;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete client');
        }
    }
);


export const fetchClientPortScanStats = createAsyncThunk(
    'clients/fetchClientPortScanStats',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientPortScanStatsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch port scan stats');
        }
    }
);


export const fetchClientPcaps = createAsyncThunk(
    'clients/fetchClientPcaps',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientPcapsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch PCAPs');
        }
    }
);

export const fetchClientPcapStats = createAsyncThunk(
    'clients/fetchClientPcapStats',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientPcapStatsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch PCAP stats');
        }
    }
);

// Thunk for fetching detail (for future use)
export const fetchClientPcapDetail = createAsyncThunk(
    'clients/fetchClientPcapDetail',
    async ({ clientId, pcapId }, { rejectWithValue }) => {
        try {
            const data = await fetchClientPcapDetailAPI(clientId, pcapId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch PCAP detail');
        }
    }
);


export const fetchClientIpLookups = createAsyncThunk(
    'clients/fetchClientIpLookups',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientIpLookupsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch IP Lookups');
        }
    }
);

export const fetchClientIpLookupStats = createAsyncThunk(
    'clients/fetchClientIpLookupStats',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientIpLookupStatsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch IP Lookup stats');
        }
    }
);

// Thunk for fetching detail (for future use)
export const fetchClientIpLookupDetail = createAsyncThunk(
    'clients/fetchClientIpLookupDetail',
    async ({ clientId, lookupId }, { rejectWithValue }) => {
        try {
            const data = await fetchClientIpLookupDetailAPI(clientId, lookupId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch IP Lookup detail');
        }
    }
);

export const fetchClientUsers = createAsyncThunk(
    'clients/fetchClientUsers',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientUsersAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch users');
        }
    }
);

export const fetchClientUserStats = createAsyncThunk(
    'clients/fetchClientUserStats',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientUserStatsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch user stats');
        }
    }
);

export const fetchClientUserDetailStats = createAsyncThunk(
    'clients/fetchClientUserDetailStats',
    async ({ clientId, userId }, { rejectWithValue }) => {
        try {
            const data = await fetchClientUserDetailStatsAPI(clientId, userId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch user detail stats');
        }
    }
);

export const fetchClientRoles = createAsyncThunk(
    'clients/fetchClientRoles',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientRolesAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch roles');
        }
    }
);

export const fetchClientRoleStats = createAsyncThunk(
    'clients/fetchClientRoleStats',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchClientRoleStatsAPI(clientId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch role stats');
        }
    }
);


export const fetchClientRoleDetail = createAsyncThunk(
    'clients/fetchClientRoleDetail',
    async ({ clientId, roleId }, { rejectWithValue }) => {
        try {
            const data = await fetchClientRoleDetailAPI(clientId, roleId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch role detail');
        }
    }
);

export const addClientRole = createAsyncThunk(
    'clients/addClientRole',
    async ({ clientId, roleData }, { rejectWithValue }) => {
        try {
            const newRole = await addClientRoleAPI(clientId, roleData);
            return newRole; // Contains the new role details including _id
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add role');
        }
    }
);

export const deleteClientRole = createAsyncThunk(
    'clients/deleteClientRole',
    async ({ clientId, roleId }, { rejectWithValue }) => {
        try {
            const result = await deleteClientRoleAPI(clientId, roleId);
            return result; // Contains { roleId } on success
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete role');
        }
    }
);


const initialState = {
    items: [],
    selectedClient: null,
    status: 'idle',
    error: null,
    addClientStatus: 'idle',
    addClientError: null,

    clientStats: null,
    clientStatsStatus: 'idle',
    clientStatsError: null,

    deleteStatus: 'idle',
    deleteError: null,

    portScans: [],
    portScanStatus: 'idle',
    portScanError: null,
    selectedPortScan: null,
    portScanDetailStatus: 'idle',
    portScanDetailError: null,

    portScanStats: null,
    portScanStatsStatus: 'idle',
    portScanStatsError: null,

    pcaps: [],
    pcapStatus: 'idle',
    pcapError: null,
    pcapStats: null,
    pcapStatsStatus: 'idle',
    pcapStatsError: null,
    selectedPcap: null,
    pcapDetailStatus: 'idle',
    pcapDetailError: null,

    ipLookups: [],
    ipLookupStatus: 'idle',
    ipLookupError: null,
    ipLookupStats: null,
    ipLookupStatsStatus: 'idle',
    ipLookupStatsError: null,
    selectedIpLookup: null,
    ipLookupDetailStatus: 'idle',
    ipLookupDetailError: null,

    users: [],
    userStatus: 'idle',
    userError: null,
    userStats: null,
    userStatsStatus: 'idle',
    userStatsError: null,
    selectedUser: null,
    selectedUserStats: null,
    selectedUserStatsStatus: 'idle',
    selectedUserStatsError: null,


    roles: [],
    roleStatus: 'idle',
    roleError: null,
    roleStats: null,
    roleStatsStatus: 'idle',
    roleStatsError: null,
    selectedRole: null,
    selectedRoleStatus: 'idle',
    selectedRoleError: null,
    addRoleStatus: 'idle',
    addRoleError: null,
    deleteRoleStatus: 'idle',
    deleteRoleError: null,
};

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        resetAddClientStatus: (state) => {
            state.addClientStatus = 'idle';
            state.addClientError = null;
        },
        resetClientStatsStatus: (state) => {
            state.clientStatsStatus = 'idle';
            state.clientStatsError = null;
            state.clientStats = null;
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
            state.deleteError = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
            state.selectedUserStats = null;
            state.selectedUserStatsStatus = 'idle';
            state.selectedUserStatsError = null;
        },
        clearSelectedClient: (state) => {
            state.selectedClient = null;
            state.status = 'idle';
            state.error = null;

            state.deleteStatus = 'idle';
            state.deleteError = null;

            state.portScans = [];
            state.portScanStatus = 'idle';
            state.portScanError = null;
            state.selectedPortScan = null;
            state.portScanDetailStatus = 'idle';
            state.portScanDetailError = null;
            state.portScanStats = null;
            state.portScanStatsStatus = 'idle';
            state.portScanStatsError = null;

            state.pcaps = [];
            state.pcapStatus = 'idle';
            state.pcapError = null;
            state.pcapStats = null;
            state.pcapStatsStatus = 'idle';
            state.pcapStatsError = null;
            state.selectedPcap = null;
            state.pcapDetailStatus = 'idle';
            state.pcapDetailError = null;

            state.ipLookups = [];
            state.ipLookupStatus = 'idle';
            state.ipLookupError = null;
            state.ipLookupStats = null;
            state.ipLookupStatsStatus = 'idle';
            state.ipLookupStatsError = null;
            state.selectedIpLookup = null;
            state.ipLookupDetailStatus = 'idle';
            state.ipLookupDetailError = null;

            state.users = [];
            state.userStatus = 'idle';
            state.userError = null;
            state.userStats = null;
            state.userStatsStatus = 'idle';
            state.userStatsError = null;
            state.selectedUser = null;
            state.selectedUserStats = null;
            state.selectedUserStatsStatus = 'idle';
            state.selectedUserStatsError = null;

            state.roles = [];
            state.roleStatus = 'idle';
            state.roleError = null;
            state.roleStats = null;
            state.roleStatsStatus = 'idle';
            state.roleStatsError = null;
            state.selectedRole = null;
            state.selectedRoleStatus = 'idle';
            state.selectedRoleError = null;

            state.addRoleStatus = 'idle';
            state.addRoleError = null;
            state.deleteRoleStatus = 'idle';
            state.deleteRoleError = null;
        },
        clearSelectedPortScan: (state) => {
            state.selectedPortScan = null;
            state.portScanDetailStatus = 'idle';
            state.portScanDetailError = null;
            state.portScanStats = null;
            state.portScanStatsStatus = 'idle';
            state.portScanStatsError = null;
        },
        clearSelectedPcap: (state) => {
            state.selectedPcap = null;
            state.pcapDetailStatus = 'idle';
            state.pcapDetailError = null;
        },
        clearSelectedIpLookup: (state) => {
            state.selectedIpLookup = null;
            state.ipLookupDetailStatus = 'idle';
            state.ipLookupDetailError = null;
        },
        clearSelectedRole: (state) => {
            state.selectedRole = null;
            state.selectedRoleStatus = 'idle';
            state.selectedRoleError = null;
        },
        resetRoleMutationStatus: (state) => {
            state.addRoleStatus = 'idle';
            state.addRoleError = null;
            state.deleteRoleStatus = 'idle';
            state.deleteRoleError = null;
        },
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
            .addCase(fetchClientStats.pending, (state) => {
                state.clientStatsStatus = 'loading';
                state.clientStatsError = null;
            })
            .addCase(fetchClientStats.fulfilled, (state, action) => {
                state.clientStatsStatus = 'succeeded';
                state.clientStats = action.payload; // Store the stats object
            })
            .addCase(fetchClientStats.rejected, (state, action) => {
                state.clientStatsStatus = 'failed';
                state.clientStatsError = action.payload;
            })
            // Fetch Client By ID
            .addCase(fetchClientById.pending, (state) => {
                state.status = 'loading';
                state.selectedClient = null; // Clear previous selection
                state.error = null;
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
            })
            .addCase(addClient.rejected, (state, action) => {
                state.addClientStatus = 'failed';
                state.addClientError = action.payload;
            })
            .addCase(deleteClient.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                const deletedClientId = action.payload;
                // Remove the client from the main list
                state.items = state.items.filter(client => client.id !== deletedClientId);
                // If the currently selected client was deleted, clear it
                if (state.selectedClient?.id === deletedClientId) {
                    state.selectedClient = null;
                    state.status = 'idle'; // Reset main status as selected is gone
                }
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
            .addCase(fetchClientById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const client = action.payload;
                state.selectedClient = {
                    id: client.id || client._id,
                    clientName: client.clientName || client.client_name,
                    description: client.description,
                    organizationType: client.organizationType || client.organization_type,
                    headQuarter: client.headQuarter || client.headquarter,
                    adminName: client.adminName || client.admin_name,
                    adminEmail: client.adminEmail || client.admin_email,
                    primaryColor: client.primaryColor || client.primary_color,
                    secondaryColor: client.secondaryColor || client.secondary_color,
                    createdAt: client.createdAt || client.created_at,
                    updatedAt: client.updatedAt || client.updated_at,
                };
            })
            .addCase(fetchClientPortScans.pending, (state) => {
                state.portScanStatus = 'loading';
                state.portScanError = null;
                state.portScans = [];
            })
            .addCase(fetchClientPortScans.fulfilled, (state, action) => {
                state.portScanStatus = 'succeeded';
                state.portScans = action.payload.map(scan => ({
                    ...scan,
                    id: scan._id
                }));
            })
            .addCase(fetchClientPortScans.rejected, (state, action) => {
                state.portScanStatus = 'failed';
                state.portScanError = action.payload;
            })

            .addCase(fetchClientPortScanDetail.pending, (state) => {
                state.portScanDetailStatus = 'loading';
                state.portScanDetailError = null;
                state.selectedPortScan = null;
            })
            .addCase(fetchClientPortScanDetail.fulfilled, (state, action) => {
                state.portScanDetailStatus = 'succeeded';
                state.selectedPortScan = {
                    ...action.payload,
                    id: action.payload._id
                };
            })
            .addCase(fetchClientPortScanDetail.rejected, (state, action) => {
                state.portScanDetailStatus = 'failed';
                state.portScanDetailError = action.payload;
            }).addCase(fetchClientPortScanStats.pending, (state) => {
                state.portScanStatsStatus = 'loading';
                state.portScanStatsError = null;
                state.portScanStats = null;
            })
            .addCase(fetchClientPortScanStats.fulfilled, (state, action) => {
                state.portScanStatsStatus = 'succeeded';
                state.portScanStats = action.payload;
            })
            .addCase(fetchClientPortScanStats.rejected, (state, action) => {
                state.portScanStatsStatus = 'failed';
                state.portScanStatsError = action.payload;
                state.portScanStats = null; // Clear stats on failure
            }).addCase(fetchClientPcaps.pending, (state) => {
                state.pcapStatus = 'loading';
                state.pcapError = null;
            })
            .addCase(fetchClientPcaps.fulfilled, (state, action) => {
                state.pcapStatus = 'succeeded';
                // Map backend snake_case to frontend camelCase if needed
                state.pcaps = action.payload.map(pcap => ({
                    id: pcap.id,
                    originalFileName: pcap.original_file_name,
                    storedFileName: pcap.stored_file_name,
                    storagePath: pcap.storage_path,
                    fileSizeBytes: pcap.file_size_bytes,
                    fileHash: pcap.file_hash,
                    contentType: pcap.content_type,
                    uploadedBy: pcap.uploaded_by,
                    uploadedAt: pcap.uploaded_at,
                    lastAnalyzedTime: pcap.LastAnalyzedTime, // Keep original casing if specific
                }));
            })
            .addCase(fetchClientPcaps.rejected, (state, action) => {
                state.pcapStatus = 'failed';
                state.pcapError = action.payload;
            })

            // Fetch Client PCAP Stats
            .addCase(fetchClientPcapStats.pending, (state) => {
                state.pcapStatsStatus = 'loading';
                state.pcapStatsError = null;
            })
            .addCase(fetchClientPcapStats.fulfilled, (state, action) => {
                state.pcapStatsStatus = 'succeeded';
                // Potentially map keys if needed, but structure looks okay
                state.pcapStats = action.payload;
            })
            .addCase(fetchClientPcapStats.rejected, (state, action) => {
                state.pcapStatsStatus = 'failed';
                state.pcapStatsError = action.payload;
            })

            // Fetch Client PCAP Detail (for future use)
            .addCase(fetchClientPcapDetail.pending, (state) => {
                state.pcapDetailStatus = 'loading';
                state.pcapDetailError = null;
                state.selectedPcap = null;
            })
            .addCase(fetchClientPcapDetail.fulfilled, (state, action) => {
                state.pcapDetailStatus = 'succeeded';
            })
            .addCase(fetchClientPcapDetail.rejected, (state, action) => {
                state.pcapDetailStatus = 'failed';
                state.pcapDetailError = action.payload;
            }).addCase(fetchClientIpLookups.pending, (state) => {
                state.ipLookupStatus = 'loading';
                state.ipLookupError = null;
            })
            .addCase(fetchClientIpLookups.fulfilled, (state, action) => {
                state.ipLookupStatus = 'succeeded';
                state.ipLookups = action.payload.map(lookup => ({
                    ...lookup,
                    id: lookup.id,
                }));
            })
            .addCase(fetchClientIpLookups.rejected, (state, action) => {
                state.ipLookupStatus = 'failed';
                state.ipLookupError = action.payload;
            })

            // Fetch Client IP Lookup Stats
            .addCase(fetchClientIpLookupStats.pending, (state) => {
                state.ipLookupStatsStatus = 'loading';
                state.ipLookupStatsError = null;
            })
            .addCase(fetchClientIpLookupStats.fulfilled, (state, action) => {
                state.ipLookupStatsStatus = 'succeeded';
                state.ipLookupStats = action.payload;
            })
            .addCase(fetchClientIpLookupStats.rejected, (state, action) => {
                state.ipLookupStatsStatus = 'failed';
                state.ipLookupStatsError = action.payload;
            })

            // Fetch Client IP Lookup Detail (for future use)
            .addCase(fetchClientIpLookupDetail.pending, (state) => {
                state.ipLookupDetailStatus = 'loading';
                state.ipLookupDetailError = null;
                state.selectedIpLookup = null;
            })
            .addCase(fetchClientIpLookupDetail.fulfilled, (state, action) => {
                state.ipLookupDetailStatus = 'succeeded';
                state.selectedIpLookup = { /* ... mapped data ... */ };
            })
            .addCase(fetchClientIpLookupDetail.rejected, (state, action) => {
                state.ipLookupDetailStatus = 'failed';
                state.ipLookupDetailError = action.payload;
            })
            .addCase(fetchClientUsers.pending, (state) => {
                state.userStatus = 'loading';
                state.userError = null;
            })
            .addCase(fetchClientUsers.fulfilled, (state, action) => {
                state.userStatus = 'succeeded';
                // API provides 'users' key. Map ID if needed (already present).
                state.users = action.payload.map(user => ({
                    ...user, // Spread existing fields
                    // Map keys if necessary (e.g., user_name to userName)
                    id: user.id,
                    userName: user.user_name,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    contactNumber: user.contact_number,
                    roleId: user.role_id, // Store role ID
                    createdAt: user.created_at,
                    updatedAt: user.updated_at,
                    // DO NOT store password
                }));
            })
            .addCase(fetchClientUsers.rejected, (state, action) => {
                state.userStatus = 'failed';
                state.userError = action.payload;
            })


            .addCase(fetchClientUserStats.pending, (state) => {
                state.userStatsStatus = 'loading';
                state.userStatsError = null;
            })
            .addCase(fetchClientUserStats.fulfilled, (state, action) => {
                state.userStatsStatus = 'succeeded';
                state.userStats = action.payload; // Store the stats object
            })
            .addCase(fetchClientUserStats.rejected, (state, action) => {
                state.userStatsStatus = 'failed';
                state.userStatsError = action.payload;
            })


            .addCase(fetchClientUserDetailStats.pending, (state) => {
                state.selectedUserStatsStatus = 'loading';
                state.selectedUserStatsError = null;
                state.selectedUserStats = null; // Clear previous stats
            })
            .addCase(fetchClientUserDetailStats.fulfilled, (state, action) => {
                state.selectedUserStatsStatus = 'succeeded';
                // Store the detailed stats object (key is 'docs')
                state.selectedUserStats = action.payload;
            })
            .addCase(fetchClientUserDetailStats.rejected, (state, action) => {
                state.selectedUserStatsStatus = 'failed';
                state.selectedUserStatsError = action.payload;
            }).addCase(fetchClientRoles.pending, (state) => {
                state.roleStatus = 'loading';
                state.roleError = null;
            })
            .addCase(fetchClientRoles.fulfilled, (state, action) => {
                state.roleStatus = 'succeeded';
                // Map _id to id for consistency
                state.roles = action.payload.map(role => ({
                    ...role, // Spread existing fields
                    id: role._id, // Map _id
                }));
            })
            .addCase(fetchClientRoles.rejected, (state, action) => {
                state.roleStatus = 'failed';
                state.roleError = action.payload;
            })

            // Fetch Client Role Stats (Overall)
            .addCase(fetchClientRoleStats.pending, (state) => {
                state.roleStatsStatus = 'loading';
                state.roleStatsError = null;
            })
            .addCase(fetchClientRoleStats.fulfilled, (state, action) => {
                state.roleStatsStatus = 'succeeded';
                state.roleStats = action.payload; // Store the stats object
            })
            .addCase(fetchClientRoleStats.rejected, (state, action) => {
                state.roleStatsStatus = 'failed';
                state.roleStatsError = action.payload;
            })

            .addCase(fetchClientRoleDetail.pending, (state) => {
                state.selectedRoleStatus = 'loading';
                state.selectedRoleError = null;
                state.selectedRole = null;
            })
            .addCase(fetchClientRoleDetail.fulfilled, (state, action) => {
                state.selectedRoleStatus = 'succeeded';
                state.selectedRole = { ...action.payload, id: action.payload._id };
            })
            .addCase(fetchClientRoleDetail.rejected, (state, action) => {
                state.selectedRoleStatus = 'failed';
                state.selectedRoleError = action.payload;
            }).addCase(addClientRole.pending, (state) => {
                state.addRoleStatus = 'loading';
                state.addRoleError = null;
            })
            .addCase(addClientRole.fulfilled, (state, action) => {
                state.addRoleStatus = 'succeeded';
                const newRole = { ...action.payload, id: action.payload._id }; // Map ID
                state.roles.push(newRole);
            })
            .addCase(addClientRole.rejected, (state, action) => {
                state.addRoleStatus = 'failed';
                state.addRoleError = action.payload;
            })

            // Delete Client Role
            .addCase(deleteClientRole.pending, (state) => {
                state.deleteRoleStatus = 'loading';
                state.deleteRoleError = null;
            })
            .addCase(deleteClientRole.fulfilled, (state, action) => {
                state.deleteRoleStatus = 'succeeded';
                state.roles = state.roles.filter(role => role.id !== action.payload.roleId);
            })
            .addCase(deleteClientRole.rejected, (state, action) => {
                state.deleteRoleStatus = 'failed';
                state.deleteRoleError = action.payload;
            });
    },
});

export const {
    resetAddClientStatus,
    resetDeleteStatus,
    clearSelectedClient,
    clearSelectedPortScan,
    clearSelectedPcap,
    clearSelectedIpLookup,
    clearSelectedUser,
    clearSelectedRole,
    resetClientStatsStatus,
    resetRoleMutationStatus
} = clientSlice.actions;

export default clientSlice.reducer;