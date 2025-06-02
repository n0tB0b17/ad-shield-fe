import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    lookupIPOrDomainAPI,
    fetchLookupHistoryAPI,
    fetchLookupByIdAPI,
    deleteLookupByIdAPI
} from '../../tenantAPI'; // Adjust path


const mapGeoInfo = (geoInfo) => {
    if (!geoInfo) return null;
    return {
        country: geoInfo.country,
        countryCode: geoInfo.country_code,
        region: geoInfo.region,
        city: geoInfo.city,
        zip: geoInfo.zip,
        latitude: geoInfo.latitude,
        longitude: geoInfo.longitude,
        timezone: geoInfo.timezone,
        isp: geoInfo.isp,
        organization: geoInfo.organization,
        asn: geoInfo.asn,
    };
};

// Async Thunks
export const lookupIPOrDomain = createAsyncThunk(
    'ipLookup/lookup',
    async ({ clientId, target }, { rejectWithValue }) => {
        try {
            const data = await lookupIPOrDomainAPI(clientId, target);
            return {
                target: data.target,
                ip: data.ip,
                geoInfo: mapGeoInfo(data.geo_info),
                hostnames: data.hostnames || [],
                id: data.id,
            };
        } catch (error) {
            return rejectWithValue(error.message || 'Lookup failed');
        }
    }
);

export const fetchLookupHistory = createAsyncThunk(
    'ipLookup/fetchHistory',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchLookupHistoryAPI(clientId);
            // Map the history array
            return data.map(item => ({
                id: item.id, // Assuming API provides _id for history items
                target: item.target,
                ip: item.ip,
                countryCode: item.geo_info?.country_code, // Extract key info for table
                isp: item.geo_info?.isp, // Extract key info for table
                createdAt: item.created_at // Assuming API provides createdAt
            }));
        } catch (error) {
            return rejectWithValue('Failed to fetch lookup history');
        }
    }
);

export const fetchLookupById = createAsyncThunk(
    'ipLookup/fetchById',
    async ({ clientId, lookupId }, { rejectWithValue }) => {
        try {
            const data = await fetchLookupByIdAPI(clientId, lookupId);
            return {
                id: data.id,
                target: data.target,
                ip: data.ip,
                geoInfo: mapGeoInfo(data.geo_info),
                hostnames: data.hostnames || [],
                createdAt: data.created_at,
                createdBy: data.created_by,
            };
        } catch (error) {
            return rejectWithValue(error.message || `Failed to fetch lookup ${lookupId}`);
        }
    }
);

export const deleteLookupById = createAsyncThunk(
    'ipLookup/deleteById',
    async ({ clientId, lookupId }, { rejectWithValue }) => {
        try {
            const result = await deleteLookupByIdAPI(clientId, lookupId);
            return result.lookupId;
        } catch (error) {
            return rejectWithValue(error.message || `Failed to delete lookup ${lookupId}`);
        }
    }
);



const initialState = {
    currentLookupResult: null,
    lookupStatus: 'idle',
    lookupError: null,

    history: [],
    historyStatus: 'idle',
    historyError: null,

    selectedLookupDetail: null,
    detailStatus: 'idle',
    detailError: null,

    deleteStatus: 'idle',
    deleteError: null,
};

const ipLookupSlice = createSlice({
    name: 'ipLookup',
    initialState,
    reducers: {
        clearCurrentLookup: (state) => {
            state.currentLookupResult = null;
            state.lookupStatus = 'idle';
            state.lookupError = null;
        },
        clearSelectedLookup: (state) => {
            state.selectedLookupDetail = null;
            state.detailStatus = 'idle';
            state.detailError = null;
        },
        resetLookupStatus: (state) => {
            state.lookupStatus = 'idle';
            state.lookupError = null;
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
            state.deleteError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // IP/Domain Lookup
            .addCase(lookupIPOrDomain.pending, (state) => {
                state.lookupStatus = 'loading';
                state.lookupError = null;
                state.currentLookupResult = null; // Clear previous result immediately
            })
            .addCase(lookupIPOrDomain.fulfilled, (state, action) => {
                state.lookupStatus = 'succeeded';
                state.currentLookupResult = action.payload;
            })
            .addCase(lookupIPOrDomain.rejected, (state, action) => {
                state.lookupStatus = 'failed';
                state.lookupError = action.payload;
                state.currentLookupResult = null;
            })
            // Fetch History
            .addCase(fetchLookupHistory.pending, (state) => {
                state.historyStatus = 'loading';
                state.historyError = null;
            })
            .addCase(fetchLookupHistory.fulfilled, (state, action) => {
                state.historyStatus = 'succeeded';
                state.history = action.payload;
            })
            .addCase(fetchLookupHistory.rejected, (state, action) => {
                state.historyStatus = 'failed';
                state.historyError = action.payload;
            })
            // Fetch By ID (Detail)
            .addCase(fetchLookupById.pending, (state) => {
                state.detailStatus = 'loading';
                state.detailError = null;
                state.selectedLookupDetail = null;
            })
            .addCase(fetchLookupById.fulfilled, (state, action) => {
                state.detailStatus = 'succeeded';
                state.selectedLookupDetail = action.payload;
            })
            .addCase(fetchLookupById.rejected, (state, action) => {
                state.detailStatus = 'failed';
                state.detailError = action.payload;
                state.selectedLookupDetail = null;
            }).addCase(deleteLookupById.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deleteLookupById.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                state.history = state.history.filter(item => item.id !== action.payload);
            })
            .addCase(deleteLookupById.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload;
            });
    },
});

export const { clearCurrentLookup, clearSelectedLookup, resetLookupStatus, resetDeleteStatus } = ipLookupSlice.actions;
export default ipLookupSlice.reducer;