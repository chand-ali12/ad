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
        state.message = action.payload?.msg || null;
        const additionalData = action.payload?.additional_data || {};
        const incomingBusiness = additionalData.business || null;
        // Preserve existing business profile/cover image URLs when API returns null to avoid blink
        if (incomingBusiness) {
          state.business = {
            ...state.business,
            ...incomingBusiness,
            business_profile_picture: incomingBusiness.business_profile_picture ?? state.business?.business_profile_picture ?? null,
            business_cover_picture: incomingBusiness.business_cover_picture ?? state.business?.business_cover_picture ?? null,
          };
          try {
            const rawAuthUser = localStorage.getItem('authUser');
            const authUser = rawAuthUser ? JSON.parse(rawAuthUser) : {};
            const mergedBusinessList = Array.isArray(authUser?.user_business)
              ? authUser.user_business.map((b) =>
                  String(b?.id) === String(state.business?.id) ? { ...b, ...state.business } : b,
                )
              : authUser?.user_business;
            localStorage.setItem('authUser', JSON.stringify({
              ...authUser,
              user_business: mergedBusinessList,
            }));
          } catch (_) {}
        } else {
          state.business = null;
        }
        state.businessUserLogin = additionalData.business_user_login || false;
        state.userClaimBusiness = additionalData.user_claim_business || null;
        state.alreadyGivenReview = additionalData.already_given_review || null;
        state.addOns = additionalData.add_ons || null;
        // Reviews come from top-level data array in get-business-profile response
        state.reviews = Array.isArray(action.payload?.data) ? action.payload.data : [];
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
        state.message = action.payload?.msg || null;
        // Update business state with new data from API response
        if (action.payload?.data) {
          const incoming = action.payload.data;
          state.business = {
            ...state.business,
            ...incoming,
            business_profile_picture: incoming.business_profile_picture ?? state.business?.business_profile_picture ?? null,
            business_cover_picture: incoming.business_cover_picture ?? state.business?.business_cover_picture ?? null,
          };
          try {
            const rawAuthUser = localStorage.getItem('authUser');
            const authUser = rawAuthUser ? JSON.parse(rawAuthUser) : {};
            const mergedBusinessList = Array.isArray(authUser?.user_business)
              ? authUser.user_business.map((b) =>
                  String(b?.id) === String(state.business?.id) ? { ...b, ...state.business } : b,
                )
              : authUser?.user_business;
            localStorage.setItem('authUser', JSON.stringify({
              ...authUser,
              user_business: mergedBusinessList,
            }));
          } catch (_) {}
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
