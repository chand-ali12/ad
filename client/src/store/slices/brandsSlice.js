import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBrands as getBrandsApi } from '../../services/brandsService';

const initialState = {
  brands: [],
  status: 'idle',
  error: null,
};

export const getBrands = createAsyncThunk(
  'brands/getBrands',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getBrandsApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch brands');
    }
  }
);

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const d = action.payload?.data;
        state.brands = Array.isArray(d) ? d : (Array.isArray(d?.brands) ? d.brands : []);
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch brands';
      });
  },
});

export default brandsSlice.reducer;
