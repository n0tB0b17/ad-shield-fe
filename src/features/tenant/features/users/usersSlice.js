import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchAllUsersAPI,
    fetchUserByIdAPI,
    registerUserAPI,
    deleteUserAPI,
    fetchAllRolesAPI,
    fetchUserStatsAPI,
    updateUserAPI,
} from '../../tenantAPI'; // Adjust path

// Helper to map user data (API snake_case to frontend camelCase)
const mapUserData = (user) => {
    if (!user) return null;
    return {
        id: user.id,
        userName: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        // Omit password
        contactNumber: user.contact_number,
        roleId: user.role_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    };
};

// Async Thunks
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (clientId, { rejectWithValue }) => {
        try {
            const users = await fetchAllUsersAPI(clientId);
            return users.map(mapUserData); // Map array
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchById',
    async ({ clientId, userId }, { rejectWithValue }) => {
        try {
            const user = await fetchUserByIdAPI(clientId, userId);
            return mapUserData(user); // Map single object
        } catch (error) {
            return rejectWithValue(error.message || `Failed to fetch user ${userId}`);
        }
    }
);

export const addUser = createAsyncThunk(
    'users/addUser',
    async ({ clientId, userData }, { rejectWithValue }) => {
        try {
            const apiPayload = {
                user_name: userData.userName,
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                role_id: userData.roleId,
                password: userData.password,
                contact_number: parseInt(userData.contactNumber, 10) || 0, // Ensure number
            };
            const newUser = await registerUserAPI(clientId, apiPayload);
            return mapUserData(newUser); // Return mapped new user data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async ({ clientId, userId }, { rejectWithValue }) => {
        try {
            await deleteUserAPI(clientId, userId);
            return userId; // Return the ID of the deleted user on success
        } catch (error) {
            return rejectWithValue(error.message || `Failed to delete user ${userId}`);
        }
    }
);

// Thunk to fetch roles for the dropdown
export const fetchRoles = createAsyncThunk(
    'users/fetchRoles',
    async (clientId, { rejectWithValue }) => {
        try {
            const roles = await fetchAllRolesAPI(clientId);
            return roles.map(role => ({
                id: role._id,
                name: role.name,
                description: role.description,
                permissions: role.permissions,
                createdAt: role.created_at,
            }));
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch roles');
        }
    }
);


export const fetchUserStats = createAsyncThunk(
    'users/fetchStats',
    async ({ clientId, userId }, { rejectWithValue }) => {
        try {
            const stats = await fetchUserStatsAPI(clientId, userId);
            return stats;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch user stats');
        }
    }
);


export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ clientId, userId, userData }, { rejectWithValue }) => {
        try {
            // Map frontend state (camelCase) to backend API (snake_case)
            const apiPayload = {
                user_name: userData.userName,
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                password: "",
                role_id: userData.roleId,
                contact_number: parseInt(userData.contactNumber, 10) || 0,
            };
            if (userData.password && userData.password.trim() !== '') {
                apiPayload.password = userData.password;
            }

            const updatedUser = await updateUserAPI(clientId, userId, apiPayload);
            return mapUserData(updatedUser);
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update user');
        }
    }
);


const initialState = {
    list: [],
    listStatus: 'idle',
    listError: null,

    selectedUser: null,
    detailStatus: 'idle',
    detailError: null,

    addStatus: 'idle',
    addError: null,

    deleteStatus: 'idle',
    deleteError: null,

    roles: [], // For dropdown
    rolesStatus: 'idle',
    rolesError: null,

    stats: null,
    statsStatus: 'idle',
    statsError: null,

    updateStatus: 'idle',
    updateError: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
            state.detailStatus = 'idle';
            state.detailError = null;

            state.stats = null;
            state.statsStatus = 'idle';
            state.statsError = null;
        },
        resetAddStatus: (state) => {
            state.addStatus = 'idle';
            state.addError = null;
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
            state.deleteError = null;
        },
        clearUserStats: (state) => {
            state.stats = null;
            state.statsStatus = 'idle';
            state.statsError = null;
        },
        resetUpdateStatus: (state) => {
            state.updateStatus = 'idle';
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.listStatus = 'loading';
                state.listError = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.listStatus = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.listStatus = 'failed';
                state.listError = action.payload;
            })
            // Fetch User By ID
            .addCase(fetchUserById.pending, (state) => {
                state.detailStatus = 'loading';
                state.detailError = null;
                state.selectedUser = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.detailStatus = 'succeeded';
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.detailStatus = 'failed';
                state.detailError = action.payload;
                state.selectedUser = null;
            })
            // Add User
            .addCase(addUser.pending, (state) => {
                state.addStatus = 'loading';
                state.addError = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.addStatus = 'succeeded';
                // Optionally add the new user to the list immediately
                if (action.payload && action.payload.id) {
                    state.list.push(action.payload);
                }
                // Or rely on refetching the list after navigation
            })
            .addCase(addUser.rejected, (state, action) => {
                state.addStatus = 'failed';
                state.addError = action.payload;
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.list = state.list.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload;
            })
            .addCase(fetchRoles.pending, (state) => {
                state.rolesStatus = 'loading';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.rolesStatus = 'succeeded';
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.rolesStatus = 'failed';
                state.rolesError = action.payload;
            }).addCase(fetchUserStats.pending, (state) => {
                state.statsStatus = 'loading';
                state.statsError = null;
                state.stats = null;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.statsStatus = 'succeeded';
                state.stats = action.payload;
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.statsStatus = 'failed';
                state.statsError = action.payload;
                state.stats = null;
            })
            .addCase(updateUser.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                if (action.payload && state.selectedUser && state.selectedUser.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
                const index = state.list.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.payload;
            });
    },
});

export const { clearSelectedUser, resetAddStatus, resetDeleteStatus, clearUserStats, resetUpdateStatus } = usersSlice.actions;
export default usersSlice.reducer;