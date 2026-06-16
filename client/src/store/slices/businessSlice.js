import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getBusinessProfile as getBusinessProfileApi,
  updateBusinessProfile as updateBusinessProfileApi,
} from '../../services/businessServices';

const initialState = {
  business: null,
  businessUserLogin: false,
  userClaimBusiness: null,
  alreadyGivenReview: null,
  addOns: null,
  reviews: [],
  profile: {
    businessName: '',
    email: '',
    aboutBusiness: '',
    companyAddress: '',
    companyWebsite: '',
    brands: '',
    country: '',
    countryCode: '',
    phoneNumber: '',
    aboutBusinessLong: '',
    facebookLink: '',
    instagramLink: '',
    linkedInLink: '',
    marketplaceLink: '',
  },
  addBusiness: {
    businessName: '',
    brands: '',
    website: '',
    country: '',
  },
  status: 'idle',
  error: null,
  message: null,
};

export const getBusinessProfile = createAsyncThunk(
  'business/getBusinessProfile',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getBusinessProfileApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch business profile');
    }
  },
);

export const updateBusinessProfile = createAsyncThunk(
  'business/updateBusinessProfile',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await updateBusinessProfileApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update business profile');
    }
  },
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setBusinessProfileLocal(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateAddBusiness(state, action) {
      state.addBusiness = { ...state.addBusiness, ...action.payload };
    },
    resetAddBusiness(state) {
      state.addBusiness = initialState.addBusiness;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBusinessProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(getBusinessProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.message || action.payload?.msg || null;
        // New backend: { status, data: { user: {...}, business: [{ ...businessFields }] } }
        const incomingBusiness = action.payload?.data?.business?.[0] || null;
        if (incomingBusiness) {
          state.business = {
            ...state.business,
            ...incomingBusiness,
            profile_picture_url: incomingBusiness.profile_picture_url ?? state.business?.profile_picture_url ?? null,
            cover_picture_url: incomingBusiness.cover_picture_url ?? state.business?.cover_picture_url ?? null,
          };
        } else {
          state.business = null;
        }
      })
      .addCase(getBusinessProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch business profile';
      })
      .addCase(updateBusinessProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(updateBusinessProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.message || action.payload?.msg || null;
        if (action.payload?.data) {
          const incoming = action.payload.data;
          state.business = {
            ...state.business,
            ...incoming,
            profile_picture_url: incoming.profile_picture_url ?? state.business?.profile_picture_url ?? null,
            cover_picture_url: incoming.cover_picture_url ?? state.business?.cover_picture_url ?? null,
          };
        }
      })
      .addCase(updateBusinessProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update business profile';
      });
  },
});

export const {
  setBusinessProfileLocal,
  updateAddBusiness,
  resetAddBusiness,
  setStatus,
  setError,
  setMessage,
} = businessSlice.actions;

export default businessSlice.reducer;
