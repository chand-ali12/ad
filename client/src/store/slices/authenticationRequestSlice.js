import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAuthenticateNowView,
  submitAuthenticateNow as submitAuthenticateNowApi,
  submitAuthenticateNowBulk as submitAuthenticateNowBulkApi,
  getQueryPrice as getQueryPriceApi,
  freeSubmit as freeSubmitApi,
  bundleQueryFormSubmit as bundleQueryFormSubmitApi,
  processPaypal as processPaypalApi,
} from '../../services/authenticateNowService';

export const fetchAuthenticateNowView = createAsyncThunk(
  'authenticationRequest/fetchAuthenticateNowView',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAuthenticateNowView();
      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch brands and categories');
    }
  }
);

export const submitAuthenticateNow = createAsyncThunk(
  'authenticationRequest/submitAuthenticateNow',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await submitAuthenticateNowApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit authentication');
    }
  }
);

export const submitAuthenticateNowBulk = createAsyncThunk(
  'authenticationRequest/submitAuthenticateNowBulk',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await submitAuthenticateNowBulkApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit bulk authentication');
    }
  }
);

/** Phase 1: Get bulk query price */
export const getQueryPrice = createAsyncThunk(
  'authenticationRequest/getQueryPrice',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getQueryPriceApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to get price');
    }
  }
);

/** Phase 1: Free bulk submit */
export const freeSubmitBulk = createAsyncThunk(
  'authenticationRequest/freeSubmitBulk',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await freeSubmitApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit');
    }
  }
);

/** Phase 1: Paid bulk submit */
export const bundleQueryFormSubmitBulk = createAsyncThunk(
  'authenticationRequest/bundleQueryFormSubmitBulk',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await bundleQueryFormSubmitApi({ ...payload, token });
    } catch (error) {
      console.error('[bundleQueryFormSubmitBulk] API error:', error?.message, 'Backend data:', error?.data);
      return rejectWithValue(error?.message || 'Failed to submit');
    }
  }
);

/** Phase 1: Single auth PayPal */
export const processPaypalPayment = createAsyncThunk(
  'authenticationRequest/processPaypalPayment',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await processPaypalApi(payload, { token });
    } catch (error) {
      console.error('[processPaypalPayment] API error:', error?.message, 'Backend data:', error?.data);
      return rejectWithValue(error?.message || 'Payment failed');
    }
  }
);

const initialState = {
  form: {
    brand: '',
    category: '',
    model: '',
    sku: '',
    additionalInfo: '',
    email: '',
    confirmEmail: '',
    images: [],
    marketValuation: false,
    agreement: false,
  },
  status: 'idle',
  error: null,
  brands: [],
  category: [],
  viewLoading: false,
  viewError: null,
};

const authenticationRequestSlice = createSlice({
  name: 'authenticationRequest',
  initialState,
  reducers: {
    updateForm(state, action) {
      state.form = { ...state.form, ...action.payload };
    },
    setImages(state, action) {
      state.form.images = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetForm(state) {
      state.form = initialState.form;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthenticateNowView.pending, (state) => {
        state.viewLoading = true;
        state.viewError = null;
      })
      .addCase(fetchAuthenticateNowView.fulfilled, (state, action) => {
        state.viewLoading = false;
        state.viewError = null;
        state.brands = action.payload?.brands ?? [];
        state.category = action.payload?.category ?? [];
      })
      .addCase(fetchAuthenticateNowView.rejected, (state, action) => {
        state.viewLoading = false;
        state.viewError = action.payload || 'Failed to fetch brands and categories';
      })
      .addCase(submitAuthenticateNow.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitAuthenticateNow.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitAuthenticateNow.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit authentication';
      })
      .addCase(submitAuthenticateNowBulk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitAuthenticateNowBulk.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitAuthenticateNowBulk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit bulk authentication';
      })
      .addCase(getQueryPrice.fulfilled, () => {})
      .addCase(getQueryPrice.rejected, () => {})
      .addCase(freeSubmitBulk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(freeSubmitBulk.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(freeSubmitBulk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit';
      })
      .addCase(bundleQueryFormSubmitBulk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(bundleQueryFormSubmitBulk.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(bundleQueryFormSubmitBulk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit';
      })
      .addCase(processPaypalPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(processPaypalPayment.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(processPaypalPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to process payment';
      });
  },
});

export const { updateForm, setImages, setStatus, setError, resetForm } =
  authenticationRequestSlice.actions;

export default authenticationRequestSlice.reducer;
