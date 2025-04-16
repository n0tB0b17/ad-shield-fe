import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Assuming API functions will be added to tenantAPI.js
import {
    fetchPortScanHistoryAPI,
    fetchPortScanByIdAPI,
    startPortScanAPI
} from '../../tenantAPI'; // Adjust path as needed


// Async Thunks
export const fetchPortScanHistory = createAsyncThunk(
    'portScan/fetchHistory',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchPortScanHistoryAPI(clientId);
            // Assuming 'docs' contains the array of scans
            return data.docs || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch scan history');
        }
    }
);

export const fetchPortScanById = createAsyncThunk(
    'portScan/fetchById',
    async ({ clientId, scanId }, { rejectWithValue }) => {
        try {
            const data = await fetchPortScanByIdAPI(clientId, scanId);
            // Assuming 'docs' contains the single scan object
            return data.docs || null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || `Failed to fetch scan ${scanId}`);
        }
    }
);

export const startPortScan = createAsyncThunk(
    'portScan/startScan',
    async ({ clientId, scanData }, { rejectWithValue }) => {
        try {
            // Map frontend names to backend API expected names
            const apiPayload = {
                address: scanData.ipAddress, // Match backend 'address'
                port_range: scanData.portRange, // Match backend 'port_range'
            };
            const response = await startPortScanAPI(clientId, apiPayload);
            // Return the newly created scan details if needed, or just success
            return response.docs || { success: true }; // Assuming backend returns the new scan in 'docs'
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to start scan');
        }
    }
);


const initialState = {
    history: [],
    selectedScan: null,
    historyStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    historyError: null,
    detailStatus: 'idle',
    detailError: null,
    scanStatus: 'idle', // Status for starting a new scan
    scanError: null,
};

const portScanSlice = createSlice({
    name: 'portScan',
    initialState,
    reducers: {
        clearSelectedScan: (state) => {
            state.selectedScan = null;
            state.detailStatus = 'idle';
            state.detailError = null;
        },
        resetScanStatus: (state) => {
            state.scanStatus = 'idle';
            state.scanError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch History
            .addCase(fetchPortScanHistory.pending, (state) => {
                state.historyStatus = 'loading';
                state.historyError = null;
            })
            .addCase(fetchPortScanHistory.fulfilled, (state, action) => {
                state.historyStatus = 'succeeded';
                // Map snake_case from API if necessary (example shown)
                state.history = action.payload.map(scan => ({
                    id: scan._id, // Use _id as id
                    userId: scan.user_id,
                    targetAddress: scan.target_address,
                    requestedPortRange: scan.requested_port_range,
                    scanStartTime: scan.scan_start_time,
                    scanEndTime: scan.scan_end_time,
                    scanDuration: scan.scan_duration,
                    status: scan.status,
                    scanResultDetail: scan.scan_result_detail, // Keep nested array as is for now
                    createdAt: scan.created_at,
                }));
            })
            .addCase(fetchPortScanHistory.rejected, (state, action) => {
                state.historyStatus = 'failed';
                state.historyError = action.payload;
            })
            // Fetch By ID
            .addCase(fetchPortScanById.pending, (state) => {
                state.detailStatus = 'loading';
                state.detailError = null;
                state.selectedScan = null;
            })
            .addCase(fetchPortScanById.fulfilled, (state, action) => {
                state.detailStatus = 'succeeded';
                // Map snake_case from API if necessary
                const scan = action.payload;
                if (scan) {
                    state.selectedScan = {
                        id: scan._id,
                        userId: scan.user_id,
                        targetAddress: scan.target_address,
                        requestedPortRange: scan.requested_port_range,
                        scanStartTime: scan.scan_start_time,
                        scanEndTime: scan.scan_end_time,
                        scanDuration: scan.scan_duration,
                        status: scan.status,
                        scanResultDetail: scan.scan_result_detail?.map(detail => ({ // Map nested array too
                            address: detail.address,
                            port: detail.port,
                            status: detail.status,
                            service: detail.service,
                            version: detail.version,
                        })) || [],
                        createdAt: scan.created_at,
                    };
                } else {
                    state.selectedScan = null; // Handle case where API returns success but null docs
                    state.detailStatus = 'failed';
                    state.detailError = 'Scan data not found.';
                }
            })
            .addCase(fetchPortScanById.rejected, (state, action) => {
                state.detailStatus = 'failed';
                state.detailError = action.payload;
                state.selectedScan = null;
            })
            // Start Scan
            .addCase(startPortScan.pending, (state) => {
                state.scanStatus = 'loading';
                state.scanError = null;
            })
            .addCase(startPortScan.fulfilled, (state, action) => {
                state.scanStatus = 'succeeded';
                // Optionally add the new scan to history here if the API returns it
                // Or rely on refetching the history list
            })
            .addCase(startPortScan.rejected, (state, action) => {
                state.scanStatus = 'failed';
                state.scanError = action.payload;
            });
    },
});

export const { clearSelectedScan, resetScanStatus } = portScanSlice.actions;
export default portScanSlice.reducer;