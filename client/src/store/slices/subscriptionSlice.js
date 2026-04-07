import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllPlans as getAllPlansApi,
  getSubscription as getSubscriptionApi,
  createSubscription as createSubscriptionApi,
  cancelSubscription as cancelSubscriptionApi,
  freeProcessPaypal as freeProcessPaypalApi,
} from '../../services/subscriptionService';

const initialPlans = [
  { title: 'Bronze', price: '$190', features: ['20 requests/month', '5% off Authentications'], additionalNote: 'Additional requests can be added at $9.5/request', headerBgColor: '#CD7F32', headerTextColor: 'white' },
  { title: 'Silver', price: '$450', features: ['50 requests/month', '10% off Authentications'], additionalNote: 'Additional requests can be added at $9/request', headerBgColor: '#C0C0C0', headerTextColor: '#333333' },
  { title: 'Gold', price: '$850', features: ['100 requests/month', '15% off Authentications'], additionalNote: 'Additional requests can be added at $8.5/request', headerBgColor: '#FFD700', headerTextColor: '#333333' },
  { title: 'Platinum', price: '$850', features: ['300 requests/month', '15% off Authentications', 'Account Manager'], additionalNote: 'Additional requests can be added at $8.5/request', headerBgColor: '#E5E4E2', headerTextColor: '#333333' },
];

export const fetchAllPlans = createAsyncThunk(
  'subscription/fetchAllPlans',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      const res = await getAllPlansApi({ token });
      const data = res?.data ?? res;
      const list = Array.isArray(data) ? data : data?.plans ?? data?.data ?? [];
      return Array.isArray(list) ? list.reverse() : [];
    } catch (e) {
      return rejectWithValue(e?.message || 'Failed to fetch plans');
    }
  }
);

export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      const res = await getSubscriptionApi({ token });
      return res?.data ?? res ?? null;
    } catch (e) {
      // ad-old: no subscription = no data, still show plans. Backend returns status false / 401 "No Record Found!" when user has no subscription.
      const data = e?.data;
      const msg = e?.message || data?.msg || data?.message || '';
      const code = data?.status_code ?? e?.status;
      const noData = data?.data == null || data?.data === undefined;
      if (
        msg === 'No Record Found!' ||
        (code === 401 && (msg.includes('Record') || msg.includes('Found') || noData)) ||
        (noData && (code === 401 || msg === 'No Record Found!'))
      ) {
        return null;
      }
      return rejectWithValue(e?.message || 'Failed to fetch subscription');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async (plan_id, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await createSubscriptionApi({ plan_id, token });
    } catch (e) {
      return rejectWithValue(e?.message || 'Failed to create subscription');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await cancelSubscriptionApi({ token });
    } catch (e) {
      return rejectWithValue(e?.message || 'Failed to cancel subscription');
    }
  }
);

/** POST /ad/free-process-paypal - free subscription PayPal (ad-old: SINGLE_FREE_SUBSCRIPTION) */
export const freeProcessPaypalSubscription = createAsyncThunk(
  'subscription/freeProcessPaypal',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await freeProcessPaypalApi(payload, { token });
    } catch (e) {
      return rejectWithValue(e?.message || 'Failed to process free subscription');
    }
  }
);

const initialState = {
  plans: initialPlans,
  plansFromApi: [],
  currentSubscription: null,
  selectedPlan: null,
  status: 'idle',
  createStatus: 'idle',
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans(state, action) {
      state.plans = action.payload;
    },
    selectPlan(state, action) {
      state.selectedPlan = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.plansFromApi = action.payload ?? [];
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload ?? null;
      })
      .addCase(createSubscription.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state) => {
        state.createStatus = 'succeeded';
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.currentSubscription = null;
      })
      .addCase(freeProcessPaypalSubscription.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(freeProcessPaypalSubscription.fulfilled, (state) => {
        state.createStatus = 'succeeded';
      })
      .addCase(freeProcessPaypalSubscription.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload ?? null;
      });
  },
});

export const { setPlans, selectPlan, setStatus, setError } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;
