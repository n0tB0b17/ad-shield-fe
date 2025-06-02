import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchPcapHistoryAPI,
    uploadPcapFileAPI,
    fetchPcapDetailAPI,
    deletePCAPData,
} from '../../tenantAPI';

// Async Thunks
export const fetchPcapHistory = createAsyncThunk(
    'pcapScan/fetchHistory',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await fetchPcapHistoryAPI(clientId);
            return data.pcaps || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch pcap history');
        }
    }
);

export const uploadPcapFile = createAsyncThunk(
    'pcapScan/uploadFile',
    async ({ clientId, formData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await uploadPcapFileAPI(clientId, formData);
            return response.pcap_meta_data || null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to upload pcap file');
        }
    }
);

export const fetchPcapDetail = createAsyncThunk(
    'pcapScan/fetchDetail',
    async ({ clientId, pcapId }, { rejectWithValue }) => {
        try {
            // API returns the full analysis structure directly
            const data = await fetchPcapDetailAPI(clientId, pcapId);
            return data; // Contains meta, network_layer_metrics, etc.
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || `Failed to fetch pcap details for ${pcapId}`);
        }
    }
);

export const deletePcapData = createAsyncThunk(
    'pcapScan/deleteData',
    async ({ clientId, pcapId }, { rejectWithValue }) => {
        try{
            const data = await deletePCAPData(clientId, pcapId);
            return data;
        } catch(error){
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete pcap meta-data')
        }
    }
);

const initialState = {
    history: [],
    selectedPcapAnalysis: null, 
    historyStatus: 'idle',
    historyError: null,
    detailStatus: 'idle',
    detailError: null,
    uploadStatus: 'idle',
    uploadError: null,
    deleteStatus: 'idle', 
    deleteError: null, 
};


const mapKeysRecursive = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(mapKeysRecursive);
    }
    return Object.keys(obj).reduce((acc, key) => {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, char) => char.toUpperCase());
        acc[camelCaseKey] = mapKeysRecursive(obj[key]);
        return acc;
    }, {});
};


const pcapSlice = createSlice({
    name: 'pcapScan',
    initialState,
    reducers: {
        clearSelectedPcap: (state) => {
            state.selectedPcapAnalysis = null;
            state.detailStatus = 'idle';
            state.detailError = null;
        },
        resetUploadStatus: (state) => {
            state.uploadStatus = 'idle';
            state.uploadError = null;
        },
        resetDeleteStatus: (state) => { 
            state.deleteStatus = 'idle';
            state.deleteError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch History
            .addCase(fetchPcapHistory.pending, (state) => {
                state.historyStatus = 'loading';
            })
            .addCase(fetchPcapHistory.fulfilled, (state, action) => {
                state.historyStatus = 'succeeded';
                 // Map snake_case keys to camelCase for frontend consistency
                 state.history = action.payload.map(pcap => ({
                     id: pcap.id,
                     originalFileName: pcap.original_file_name,
                     storedFileName: pcap.stored_file_name,
                     storagePath: pcap.storage_path,
                     fileSizeBytes: pcap.file_size_bytes,
                     fileHash: pcap.file_hash,
                     contentType: pcap.content_type,
                     uploadedBy: pcap.uploaded_by,
                     uploadedAt: pcap.uploaded_at,
                     lastAnalyzedTime: pcap.LastAnalyzedTime, // Keep capitalization as is from API if needed
                 }));
                state.historyError = null;
            })
            .addCase(fetchPcapHistory.rejected, (state, action) => {
                state.historyStatus = 'failed';
                state.historyError = action.payload;
            })
            // Upload Pcap
            .addCase(uploadPcapFile.pending, (state) => {
                state.uploadStatus = 'loading';
                state.uploadError = null;
            })
            .addCase(uploadPcapFile.fulfilled, (state, action) => {
                state.uploadStatus = 'succeeded';
                 if (action.payload) {
                     const newMeta = {
                         id: action.payload.id,
                         originalFileName: action.payload.original_file_name,
                         storedFileName: action.payload.stored_file_name,
                         storagePath: action.payload.storage_path,
                         fileSizeBytes: action.payload.file_size_bytes,
                         fileHash: action.payload.file_hash,
                         contentType: action.payload.content_type,
                         uploadedBy: action.payload.uploaded_by,
                         uploadedAt: action.payload.uploaded_at,
                         lastAnalyzedTime: action.payload.LastAnalyzedTime,
                     };
                     state.history.unshift(newMeta);
                 }
            })
            .addCase(uploadPcapFile.rejected, (state, action) => {
                state.uploadStatus = 'failed';
                state.uploadError = action.payload;
            })
             // Fetch Detail
             .addCase(fetchPcapDetail.pending, (state) => {
                state.detailStatus = 'loading';
                state.detailError = null;
                state.selectedPcapAnalysis = null;
            })
            .addCase(fetchPcapDetail.fulfilled, (state, action) => {
                state.detailStatus = 'succeeded';
                state.selectedPcapAnalysis = action.payload;
            })
            .addCase(fetchPcapDetail.rejected, (state, action) => {
                state.detailStatus = 'failed';
                state.detailError = action.payload;
                state.selectedPcapAnalysis = null;
            })
            .addCase(deletePcapData.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deletePcapData.fulfilled, (state, action) => {
                state.deleteStatus = 'succeeded';
                if (action.meta.arg && action.meta.arg.pcapId) {
                    state.history = state.history.filter(pcap => pcap.id !== action.meta.arg.pcapId);
                }
                if (state.selectedPcapAnalysis && 
                    state.selectedPcapAnalysis.meta && 
                    state.selectedPcapAnalysis.meta.id === action.meta.arg.pcapId) {
                    state.selectedPcapAnalysis = null;
                }
            })
            .addCase(deletePcapData.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload;
            });
    },
});

export const { clearSelectedPcap, resetUploadStatus, resetDeleteStatus } = pcapSlice.actions;
export default pcapSlice.reducer;