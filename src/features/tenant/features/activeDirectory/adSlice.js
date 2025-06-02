import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    authenticateADAPI,
    fetchADGroupsAPI,
    addADGroupAPI,
    fetchADGroupByIdAPI,
    fetchADUsersAPI,
    fetchADUserByIdAPI,
    fetchADOUsAPI,
    addADOUAPI,
    addADUserAPI
} from '../../tenantAPI';


export const authenticateAD = createAsyncThunk(
    'ad/authenticate',
    async ({ clientId, credentials }, { rejectWithValue }) => {
        try {
            const response = await authenticateADAPI(clientId, credentials);
            return {
                address: credentials.address,
                domainName: credentials.domain_name,
                // Maybe API returns confirmation/token? Adjust as needed.
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'AD Authentication Failed');
        }
    }
);

export const fetchADGroups = createAsyncThunk(
    'ad/fetchGroups',
    async ({ clientId, connectionDetails }, { rejectWithValue }) => {
        try {
            // API requires address and domain_name in body
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName
            };
            const response = await fetchADGroupsAPI(clientId, apiPayload);
            // Assuming response structure matches the Go struct array under a 'docs' key (adjust if different)
            return response.docs || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch AD Groups');
        }
    }
);

export const addADGroup = createAsyncThunk(
    'ad/addGroup',
    async ({ clientId, connectionDetails, groupData }, { rejectWithValue }) => {
        try {
            // API requires address, domain_name, plus group details
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName,
                samAccountName: groupData.samAccountName, // Map frontend names to backend
                distinguishedName: groupData.distinguishedName,
                name: groupData.name,
                displayName: groupData.displayName,
                description: groupData.description,
                type: parseInt(groupData.type, 10) // Ensure type is number
            };
            const response = await addADGroupAPI(clientId, apiPayload);
            // Assuming API returns the newly created group or success message
            return response.docs || { success: true }; // Adjust based on actual API response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add AD Group');
        }
    }
);

export const fetchADGroupById = createAsyncThunk(
    'ad/fetchGroupById',
    async ({ clientId, connectionDetails, dn }, { rejectWithValue }) => {
        try {
            // API requires address, domain_name, and dn
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName,
                dn: dn // Distinguished Name
            };
            const response = await fetchADGroupByIdAPI(clientId, apiPayload);
            // Assuming response has the group object under a 'docs' key
            return response.docs || null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch AD Group details');
        }
    }
);

export const fetchADUsers = createAsyncThunk(
    'ad/fetchUsers',
    async ({ clientId, connectionDetails }, { rejectWithValue }) => {
        try {
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName
            };
            const response = await fetchADUsersAPI(clientId, apiPayload);
            // Backend response has 'users' key
            return response.users || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch AD Users');
        }
    }
);

export const fetchADUserById = createAsyncThunk(
    'ad/fetchUserById',
    async ({ clientId, connectionDetails, dn }, { rejectWithValue }) => {
        try {
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName,
                dn: dn
            };
            const response = await fetchADUserByIdAPI(clientId, apiPayload);
            return response.user || null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch AD User details');
        }
    }
);

export const fetchADOUs = createAsyncThunk(
    'ad/fetchOUs',
    async ({ clientId, connectionDetails }, { rejectWithValue }) => {
        try {
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName
            };
            const response = await fetchADOUsAPI(clientId, apiPayload);
            return response.docs || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch AD OUs');
        }
    }
);

export const addADOU = createAsyncThunk(
    'ad/addOU',
    async ({ clientId, connectionDetails, ouData }, { rejectWithValue }) => {
        try {
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName,
                name: ouData.name,
                distinguishedName: ouData.distinguishedName,
                description: ouData.description
            };
            const response = await addADOUAPI(clientId, apiPayload);
            // API returns success message, not the OU object itself
            return { success: true, message: response.message }; // Or just response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add AD OU');
        }
    }
);


export const addADUser = createAsyncThunk(
    'ad/addUser',
    async ({ clientId, connectionDetails, userData }, { rejectWithValue }) => {
        try {
            // Prepare payload ensuring all necessary fields are present
            const apiPayload = {
                address: connectionDetails.address,
                domain_name: connectionDetails.domainName,
                samAccountName: userData.samAccountName,
                password: userData.password,
                distinguishedName: userData.distinguishedName,
                userPrincipalName: userData.userPrincipalName,
                displayName: userData.displayName || "",
                givenName: userData.givenName || "",
                surName: userData.surName || "",
                description: userData.description || "",
                title: userData.title || "",
                department: userData.department || "",
                company: userData.company || "",
                telephoneNumber: userData.telephoneNumber || "",
                mobile: userData.mobile || ""
            };
            const response = await addADUserAPI(clientId, apiPayload);
            return { success: true, message: response.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add AD User');
        }
    }
);

const initialState = {
    isConnected: false,
    connectionDetails: null,
    connectionStatus: 'idle',
    connectionError: null,

    groups: [],
    selectedGroup: null,
    groupsStatus: 'idle',
    groupsError: null,
    addGroupStatus: 'idle',
    addGroupError: null,
    groupDetailStatus: 'idle',
    groupDetailError: null,

    users: [],
    selectedUser: null,
    usersStatus: 'idle',
    usersError: null,
    userDetailStatus: 'idle',
    userDetailError: null,
    addUserStatus: 'idle',
    addUserError: null,

    ous: [],
    selectedOU: null,
    ousStatus: 'idle',
    ousError: null,
    addOUStatus: 'idle',
    addOUError: null,
    ouDetailStatus: 'idle',
    ouDetailError: null,

    ous: [],
    selectedOU: null,
    ousStatus: 'idle',
    ousError: null,
    addOUStatus: 'idle',
    addOUError: null,
    ouDetailStatus: 'idle',
    ouDetailError: null,

    users: [],
    selectedUser: null,
    usersStatus: 'idle',
    usersError: null,
    userDetailStatus: 'idle',
    userDetailError: null,
    addUserStatus: 'idle',
    addUserError: null,
};

const adSlice = createSlice({
    name: 'ad',
    initialState,
    reducers: {
        disconnectAD: (state) => {
            state.isConnected = false;
            state.connectionDetails = null;
            state.connectionStatus = 'idle';
            state.connectionError = null;
            state.groups = [];
            state.selectedGroup = null;
            state.groupsStatus = 'idle';
            state.groupDetailStatus = 'idle';
            state.users = []; // Reset users too
            state.selectedUser = null;
            state.usersStatus = 'idle';
            state.userDetailStatus = 'idle';

            state.ous = [];
            state.selectedOU = null;
            state.ousStatus = 'idle';
            state.ouDetailStatus = 'idle';
        },
        resetAddGroupStatus: (state) => { state.addGroupStatus = 'idle'; state.addGroupError = null; },
        clearSelectedGroup: (state) => { state.selectedGroup = null; state.groupDetailStatus = 'idle'; state.groupDetailError = null; },

        clearSelectedUser: (state) => {
            state.selectedUser = null;
            state.userDetailStatus = 'idle';
            state.userDetailError = null;
        },
        resetAddUserStatus: (state) => {
            state.addUserStatus = 'idle';
            state.addUserError = null;
        },

        clearSelectedOU: (state) => {
            state.selectedOU = null;
            state.ouDetailStatus = 'idle';
            state.ouDetailError = null;
        },
        resetAddOUStatus: (state) => {
            state.addOUStatus = 'idle';
            state.addOUError = null;
        },

        resetAddUserStatus: (state) => {
            state.addUserStatus = 'idle';
            state.addUserError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authenticateAD.pending, (state) => {
                state.connectionStatus = 'loading';
                state.connectionError = null;
                state.isConnected = false;
                state.connectionDetails = null;
            })
            .addCase(authenticateAD.fulfilled, (state, action) => {
                state.connectionStatus = 'succeeded';
                state.isConnected = true;
                state.connectionDetails = action.payload; // Store address, domainName
            })
            .addCase(authenticateAD.rejected, (state, action) => {
                state.connectionStatus = 'failed';
                state.connectionError = action.payload;
                state.isConnected = false;
                state.connectionDetails = null;
            })
            // Fetch AD Groups
            .addCase(fetchADGroups.pending, (state) => {
                state.groupsStatus = 'loading';
                state.groupsError = null;
            })
            .addCase(fetchADGroups.fulfilled, (state, action) => {
                state.groupsStatus = 'succeeded';
                // Directly use payload assuming it's the array of groups matching the Go struct
                state.groups = action.payload;
            })
            .addCase(fetchADGroups.rejected, (state, action) => {
                state.groupsStatus = 'failed';
                state.groupsError = action.payload;
            })
            // Add AD Group
            .addCase(addADGroup.pending, (state) => {
                state.addGroupStatus = 'loading';
                state.addGroupError = null;
            })
            .addCase(addADGroup.fulfilled, (state, action) => {
                state.addGroupStatus = 'succeeded';
                // Optionally add the new group to state.groups or rely on refetch
            })
            .addCase(addADGroup.rejected, (state, action) => {
                state.addGroupStatus = 'failed';
                state.addGroupError = action.payload;
            })
            // Fetch AD Group By ID (DN)
            .addCase(fetchADGroupById.pending, (state) => {
                state.groupDetailStatus = 'loading';
                state.groupDetailError = null;
                state.selectedGroup = null;
            })
            .addCase(fetchADGroupById.fulfilled, (state, action) => {
                state.groupDetailStatus = 'succeeded';
                state.selectedGroup = action.payload; // Assuming payload is the group object
            })
            .addCase(fetchADGroupById.rejected, (state, action) => {
                state.groupDetailStatus = 'failed';
                state.groupDetailError = action.payload;
                state.selectedGroup = null;
            })

            // --- User Cases ---
            // Fetch AD Users List
            .addCase(fetchADUsers.pending, (state) => {
                state.usersStatus = 'loading';
                state.usersError = null;
            })
            .addCase(fetchADUsers.fulfilled, (state, action) => {
                state.usersStatus = 'succeeded';
                // Directly use payload as it's the array under 'users' key from API
                state.users = action.payload;
            })
            .addCase(fetchADUsers.rejected, (state, action) => {
                state.usersStatus = 'failed';
                state.usersError = action.payload;
            })
            // Fetch AD User By ID (DN)
            .addCase(fetchADUserById.pending, (state) => {
                state.userDetailStatus = 'loading';
                state.userDetailError = null;
                state.selectedUser = null;
            })
            .addCase(fetchADUserById.fulfilled, (state, action) => {
                state.userDetailStatus = 'succeeded';
                // Payload is the object under 'user' key from API
                state.selectedUser = action.payload;
            })
            .addCase(fetchADUserById.rejected, (state, action) => {
                state.userDetailStatus = 'failed';
                state.userDetailError = action.payload;
                state.selectedUser = null;
            }).addCase(fetchADOUs.pending, (state) => {
                state.ousStatus = 'loading';
                state.ousError = null;
            })
            .addCase(fetchADOUs.fulfilled, (state, action) => {
                state.ousStatus = 'succeeded';
                state.ous = action.payload.map(ou => ({
                    ...ou
                }));
            })
            .addCase(fetchADOUs.rejected, (state, action) => {
                state.ousStatus = 'failed';
                state.ousError = action.payload;
            }).addCase(addADOU.pending, (state) => {
                state.addOUStatus = 'loading';
                state.addOUError = null;
            })
            .addCase(addADOU.fulfilled, (state, action) => {
                state.addOUStatus = 'succeeded';
                state.ousStatus = 'idle';
            })
            .addCase(addADOU.rejected, (state, action) => {
                state.addOUStatus = 'failed';
                state.addOUError = action.payload;
            }).addCase(addADUser.pending, (state) => {
                state.addUserStatus = 'loading';
                state.addUserError = null;
            })
            .addCase(addADUser.fulfilled, (state, action) => {
                state.addUserStatus = 'succeeded';
                state.usersStatus = 'idle';
            })
            .addCase(addADUser.rejected, (state, action) => {
                state.addUserStatus = 'failed';
                state.addUserError = action.payload;
            });
    },
});

export const {
    disconnectAD,
    resetAddGroupStatus,
    clearSelectedGroup,
    clearSelectedUser,
    resetAddUserStatus,
    clearSelectedOU,
    resetAddOUStatus
} = adSlice.actions;
export default adSlice.reducer;