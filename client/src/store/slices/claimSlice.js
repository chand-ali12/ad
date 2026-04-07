import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { claimBusiness as claimBusinessApi } from '../../services/claimService';

const initialState = {
  status: 'idle',
  error: null,
  message: null,
};

export const claimBusiness = createAsyncThunk(
  'claim/claimBusiness',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await claimBusinessApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit claim');
    }
  }
);

const claimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetClaim(state) {
      state.status = 'idle';
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(claimBusiness.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(claimBusiness.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || 'Your Claim has been submitted.';
        state.error = null;
      })
      .addCase(claimBusiness.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit claim';
        state.message = null;
      });
  },
});

export const { resetClaim } = claimSlice.actions;
export default claimSlice.reducer;
