import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateReportAPI, downloadReportAPI } from '../../tenantAPI';

// Async Thunks
export const generateReport = createAsyncThunk(
    'report/generateReport',
    async ({ clientId, reportData }, { rejectWithValue, getState }) => {
        try {
            const userId = getState().tenants.currentUser?.id;
            if (!userId) {
                return rejectWithValue('User not authenticated or user ID not found.');
            }

            const payload = {
                user_id: userId,
                content_type: reportData.contentType,
                content_id: reportData.contentId,
                file_name: reportData.fileName,
            };

            const response = await generateReportAPI(clientId, payload);
            if (response.status === 'success') {
                return { ...response, contentId: reportData.contentId }; // Pass contentId for mapping
            } else {
                return rejectWithValue(response.message || 'Failed to generate report.');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Error generating report.');
        }
    }
);

export const initiateDownload = createAsyncThunk(
    'report/initiateDownload',
    async ({ downloadUrl, fileName }, { rejectWithValue }) => {
        try {
            if (!downloadUrl) {
                return rejectWithValue('Download URL is missing.');
            }

            window.open(downloadUrl, '_blank');

            return { fileName, downloadUrl, message: `Download initiated for ${fileName}` };
        } catch (error) {
            console.error('Download initiation error:', error);
            return rejectWithValue(error.message || `Failed to initiate download for ${fileName}.`);
        }
    }
);


const initialState = {
    generationStatus: {},
    downloadStatus: 'idle',
    downloadError: null,
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        clearGenerationStatus: (state, action) => {
            const contentId = action.payload;
            if (state.generationStatus[contentId]) {
                delete state.generationStatus[contentId];
            }
        },
        resetDownloadState: (state) => {
            state.downloadStatus = 'idle';
            state.downloadError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateReport.pending, (state, action) => {
                const contentId = action.meta.arg.reportData.contentId;
                state.generationStatus[contentId] = {
                    status: 'loading',
                    error: null,
                    data: null,
                };
            })
            .addCase(generateReport.fulfilled, (state, action) => {
                const contentId = action.payload.contentId;
                state.generationStatus[contentId] = {
                    status: 'succeeded',
                    error: null,
                    data: action.payload,
                };
            })
            .addCase(generateReport.rejected, (state, action) => {
                const contentId = action.meta.arg?.reportData?.contentId;
                if (contentId) {
                    state.generationStatus[contentId] = {
                        status: 'failed',
                        error: action.payload,
                        data: null,
                    };
                } else {
                    console.error("Report generation failed without a contentId in meta:", action);
                }
            })
            .addCase(initiateDownload.pending, (state) => {
                state.downloadStatus = 'loading';
                state.downloadError = null;
            })
            .addCase(initiateDownload.fulfilled, (state, action) => {
                state.downloadStatus = 'succeeded';
                // `action.payload` contains { fileName, downloadUrl, message }
            })
            .addCase(initiateDownload.rejected, (state, action) => {
                state.downloadStatus = 'failed';
                state.downloadError = action.payload;
            });
    },
});

export const { clearGenerationStatus, resetDownloadState } = reportSlice.actions;
export default reportSlice.reducer;