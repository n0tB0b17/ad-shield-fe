import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Assuming API functions will be added to tenantAPI.js
import {
    fetchPortScanHistoryAPI,
    fetchPortScanByIdAPI,
    startPortScanAPI,
    deletePortScanAPI
} from '../../tenantAPI'; // Adjust path as needed


// Async Thunks
export const fetchPortScanHistory = createAsyncThunk(
    'portScan/fetchHistory',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchPortScanHistoryAPI(clientId);
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
            return data.docs || null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || `Failed to fetch scan ${scanId}`);
        }
    }
);


export const deletePortScan = createAsyncThunk(
    'portScan/deleteDataById',
    async ({ clientId, scanId }, { rejectWithValue }) => {
        try {
            const data = await deletePortScanAPI(clientId, scanId);
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || `Failed to delete scan ${scanId}`);
        }
    }
)

export const startPortScan = createAsyncThunk(
    'portScan/startScan',
    async ({ clientId, scanData }, { rejectWithValue }) => {
        try {
            const apiPayload = {
                address: scanData.ipAddress,
                port_range: scanData.portRange,
            };
            const response = await startPortScanAPI(clientId, apiPayload);
            return response.docs || { success: true };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to start scan');
        }
    }
);


const initialState = {
    history: [],
    selectedScan: null,
    historyStatus: 'idle',
    historyError: null,
    detailStatus: 'idle',
    detailError: null,
    scanStatus: 'idle', 
    scanError: null,
    deleteStatus: 'idle',
    deleteError: null,
    deletingId: null,
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
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = "idle";
            state.deleteError = null;
            state.deletingId = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortScanHistory.pending, (state) => {
                state.historyStatus = 'loading';
                state.historyError = null;
            })
            .addCase(fetchPortScanHistory.fulfilled, (state, action) => {
                state.historyStatus = 'succeeded';
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

            })
            .addCase(startPortScan.rejected, (state, action) => {
                state.scanStatus = 'failed';
                state.scanError = action.payload;
            }).addCase(deletePortScan.pending, (state, action) => {
                state.deletingId = action.meta.arg.scanId;
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deletePortScan.fulfilled, (state, action) => {
                const deletedScanId = action.payload;
                state.history = state.history.filter(scan => scan.id !== deletedScanId);
                state.deletingId = null;
                state.deleteStatus = 'succeeded';
                state.deleteError = null;

                if (state.selectedScan?.id === deletedScanId) {
                    state.selectedScan = null;
                    state.detailStatus = 'idle';
                    state.detailError = null;

                }
            })
            .addCase(deletePortScan.rejected, (state, action) => {
                state.historyError = `Deletion failed: ${action.payload}`; // Or use a dedicated deleteError state
                state.deletingId = null;
                state.deleteStatus = 'failed';
                state.deleteError = action.payload;
            });
    },
});

export const { clearSelectedScan, resetScanStatus, resetDeleteStatus } = portScanSlice.actions;
export default portScanSlice.reducer;