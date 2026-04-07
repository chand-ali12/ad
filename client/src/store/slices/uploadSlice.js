import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  uploadImage as uploadImageApi,
  uploadImageAsBase64 as uploadImageAsBase64Api,
  deleteImage as deleteImageApi,
} from '../../services/uploadService';

const initialState = {
  uploadedPaths: [],
  status: 'idle',
  error: null,
};

export const deleteImage = createAsyncThunk(
  'upload/deleteImage',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await deleteImageApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete image');
    }
  }
);

export const uploadImage = createAsyncThunk(
  'upload/uploadImage',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await uploadImageApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to upload image');
    }
  }
);

export const uploadImageAsBase64 = createAsyncThunk(
  'upload/uploadImageAsBase64',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await uploadImageAsBase64Api({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to upload image');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadedPaths(state) {
      state.uploadedPaths = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const path = action.payload?.data;
        if (path) {
          state.uploadedPaths.push(path);
        }
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to upload image';
      })
      .addCase(uploadImageAsBase64.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadImageAsBase64.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const path = action.payload?.data;
        if (path) {
          state.uploadedPaths.push(path);
        }
      })
      .addCase(uploadImageAsBase64.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to upload image';
      });
  },
});

export const { clearUploadedPaths } = uploadSlice.actions;
export default uploadSlice.reducer;
