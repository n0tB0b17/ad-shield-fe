import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTenantInfoByIdAPI, loginTenantUserAPI } from './tenantAPI';


export const fetchTenantInfoById = createAsyncThunk(
    'tenant/fetchInfoById',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchTenantInfoByIdAPI(clientId);
            return {
                id: data.id,
                clientName: data.client_name,
                primaryColor: data.primary_color,
                secondaryColor: data.secondary_color,
            };
        } catch (error) {
            return rejectWithValue(error.message || `Failed to fetch tenant info ${clientId}`);
        }
    }
);

export const loginTenantUser = createAsyncThunk(
    'tenant/loginUser',
    async ({ clientId, credentials }, { rejectWithValue }) => {
        try {

            const apiCredentials = {
                user_name: credentials.username,
                password: credentials.password
            };
            const data = await loginTenantUserAPI(clientId, apiCredentials);
            const user = data.user;
            return {
                token: data.token,
                user: {
                    id: user.id,
                    userName: user.user_name,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    roleId: user.role_id,
                },
                expireAt: data.expireAt
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
        }
    }
);

const initialState = {
    currentTenantInfo: null,
    infoStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    infoError: null,

    // Tenant Authentication
    isAuthenticated: false,
    authToken: null,
    currentUser: null,
    tokenExpireAt: null,
    authStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    authError: null,
};

const tenantSlice = createSlice({
    name: 'tenant',
    initialState,
    reducers: {
        logoutTenantUser: (state) => {
            state.isAuthenticated = false;
            state.authToken = null;
            state.currentUser = null;
            state.tokenExpireAt = null;
            state.authStatus = 'idle';
            state.authError = null;
        },
        clearTenantInfo: (state) => {
            state.currentTenantInfo = null;
            state.infoStatus = 'idle';
            state.infoError = null;
        },
        resetTenantAuthStatus: (state) => {
            state.authStatus = 'idle';
            state.authError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tenant Info
            .addCase(fetchTenantInfoById.pending, (state) => {
                state.infoStatus = 'loading';
                state.infoError = null;
                state.currentTenantInfo = null; // Clear previous info
            })
            .addCase(fetchTenantInfoById.fulfilled, (state, action) => {
                state.infoStatus = 'succeeded';
                state.currentTenantInfo = action.payload;
            })
            .addCase(fetchTenantInfoById.rejected, (state, action) => {
                state.infoStatus = 'failed';
                state.infoError = action.payload;
                state.currentTenantInfo = null;
            })
            // Login Tenant User
            .addCase(loginTenantUser.pending, (state) => {
                state.authStatus = 'loading';
                state.authError = null;
            })
            .addCase(loginTenantUser.fulfilled, (state, action) => {
                state.authStatus = 'succeeded';
                state.isAuthenticated = true;
                state.authToken = action.payload.token;
                state.currentUser = action.payload.user;
                state.tokenExpireAt = action.payload.expireAt;
                state.authError = null;
                // Optionally store token in localStorage for persistence
                // localStorage.setItem('tenantAuthToken', action.payload.token);
                // localStorage.setItem('tenantUser', JSON.stringify(action.payload.user));
            })
            .addCase(loginTenantUser.rejected, (state, action) => {
                state.authStatus = 'failed';
                state.isAuthenticated = false;
                state.authToken = null;
                state.currentUser = null;
                state.tokenExpireAt = null;
                state.authError = action.payload;
                // localStorage.removeItem('tenantAuthToken');
                // localStorage.removeItem('tenantUser');
            });
    },
});

export const { logoutTenantUser, clearTenantInfo, resetTenantAuthStatus } = tenantSlice.actions;

export default tenantSlice.reducer;