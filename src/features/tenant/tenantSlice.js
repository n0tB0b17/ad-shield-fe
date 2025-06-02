import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTenantInfoByIdAPI, loginTenantUserAPI, fetchCurrentUserContextAPI } from './tenantAPI';

const getInitialAuthState = () => {
    try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('tenantUser'));
        const expireAt = localStorage.getItem('tokenExpireAt');

        if (token && user && expireAt) {
            const expireTime = new Date(expireAt).getTime();
            const currentTime = new Date().getTime();

            if (expireTime > currentTime) {
                return {
                    isAuthenticated: true,
                    authToken: token,
                    currentUser: user,
                    tokenExpireAt: expireAt,
                    authStatus: 'succeeded'
                };
            }
        }
    } catch (error) {
        console.error('Error restoring auth state:', error);
    }

    return {
        isAuthenticated: false,
        authToken: null,
        currentUser: null,
        tokenExpireAt: null,
        authStatus: 'idle'
    };
};

const mapUserContextData = (user) => {
    if (!user) return null;
    return {
        id: user.id,
        userName: user.user_name,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        contactNumber: user.contact_number,
        roleId: user.role_id, // Keep roleId for reference if needed
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    };
};

const mapRoleData = (role) => {
    if (!role) return null;
    return {
        id: role._id,
        name: role.name,
        description: role.description,
        permissions: role.permissions || [],
        createdAt: role.created_at,
        updatedAt: role.updated_at,
    };
};



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
    async ({ clientId, credentials }, { dispatch, rejectWithValue }) => {
        try {

            const apiCredentials = {
                user_name: credentials.username,
                password: credentials.password
            };
            const data = await loginTenantUserAPI(clientId, apiCredentials);
            if (data.token && clientId) {
                dispatch(fetchCurrentUserContext(clientId))
            }

            const user = data.user;

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('tenantUser', JSON.stringify({
                id: user.id,
                userName: user.user_name,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                roleId: user.role_id,
            }));
            localStorage.setItem('tokenExpireAt', data.expireAt);


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

export const fetchCurrentUserContext = createAsyncThunk(
    'tenant/fetchContext',
    async (clientId, { rejectWithValue, getState }) => {
        // const { currentUser } = getState().tenant;
        // if (currentUser?.firstName) { // Check if detailed data is already present
        //    return currentUser;
        // }
        try {   
            const contextData = await fetchCurrentUserContextAPI(clientId);
            return {
                user: mapUserContextData(contextData.user),
                role: mapRoleData(contextData.role),
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch user context');
        }
    }
);


const authInitialState = getInitialAuthState();

const initialState = {
    currentTenantInfo: null,
    infoStatus: 'idle',
    infoError: null,

    isAuthenticated: authInitialState.isAuthenticated,
    authToken: authInitialState.authToken,
    currentUser: authInitialState.currentUser,
    tokenExpireAt: authInitialState.tokenExpireAt,
    authStatus: authInitialState.authStatus,
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

            localStorage.removeItem('authToken');
            localStorage.removeItem('tenantUser');
            localStorage.removeItem('tokenExpireAt');
        },
        clearTenantInfo: (state) => {
            state.currentTenantInfo = null;
            state.infoStatus = 'idle';
            state.infoError = null;
        },
        resetTenantAuthStatus: (state) => {
            state.authStatus = 'idle';
            state.authError = null;
        },
        checkTokenExpiration: (state) => {
            if (state.tokenExpireAt) {
                const expireTime = new Date(state.tokenExpireAt).getTime();
                const currentTime = new Date().getTime();

                if (currentTime > expireTime) {
                    state.isAuthenticated = false;
                    state.authToken = null;
                    state.currentUser = null;
                    state.tokenExpireAt = null;
                    state.authStatus = 'idle';

                    localStorage.removeItem('authToken');
                    localStorage.removeItem('tenantUser');
                    localStorage.removeItem('tokenExpireAt');
                }
            }
        },
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
            })
            .addCase(loginTenantUser.rejected, (state, action) => {
                state.authStatus = 'failed';
                state.isAuthenticated = false;
                state.authToken = null;
                state.currentUser = null;
                state.tokenExpireAt = null;
                state.authError = action.payload;

                localStorage.removeItem('authToken');
                localStorage.removeItem('tenantUser');
                localStorage.removeItem('tokenExpireAt');
            }).addCase(fetchCurrentUserContext.pending, (state) => {
                if (state.authStatus !== 'loading') {
                    state.authStatus = 'loading';
                }
                state.authError = null;
            })
            .addCase(fetchCurrentUserContext.fulfilled, (state, action) => {
                state.authStatus = 'succeeded';
                state.currentUser = { ...state.currentUser, ...action.payload.user };
                state.currentUserRole = action.payload.role;
                state.authError = null;
            })
            .addCase(fetchCurrentUserContext.rejected, (state, action) => {
                state.authStatus = 'failed';
                state.authError = action.payload;
            });
    },
});

export const { logoutTenantUser, clearTenantInfo, resetTenantAuthStatus, checkTokenExpiration } = tenantSlice.actions;

export default tenantSlice.reducer;