import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserProfile as getUserProfileApi,
  updateUserProfile as updateUserProfileApi,
  getUserCertificate as getUserCertificateApi,
  getUserQueries as getUserQueriesApi,
} from '../../services/profileServices';
import { updateCertificateNote as updateCertificateNoteApi } from '../../services/forumService';

const initialState = {
  user: null,
  addOns: null,
  businessReviewCount: 0,
  certificates: [],
  queries: [],
  queryCounts: {
    pendingCount: 0,
    completeCount: 0,
    pendingRequestCount: 0,
    pendingValuationCount: 0,
    completedValuationCount: 0,
  },
  profile: {
    bannerImage: null,
    profileImage: null,
    name: '',
    subtitle: '',
    reviewsCount: 0,
    rating: null,
    verifiedBadgeImage: null,
  },
  status: 'idle',
  error: null,
  message: null,
};

export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getUserProfileApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch user profile');
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await updateUserProfileApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update user profile');
    }
  },
);

export const getUserCertificate = createAsyncThunk(
  'profile/getUserCertificate',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getUserCertificateApi({ ...payload, token });
    } catch (error) {
      // If "No Record Found", treat as success with empty certificates
      if (error?.message === 'No Record Found!') {
        return { status: true, data: [], msg: 'No certificates yet' };
      }
      return rejectWithValue(error?.message || 'Failed to fetch user certificates');
    }
  },
);

export const getUserQueries = createAsyncThunk(
  'profile/getUserQueries',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getUserQueriesApi({ ...payload, token });
    } catch (error) {
      // If "No record found" or 404, treat as success with empty queries
      if (error?.message === 'No record found.' || error?.status === 404) {
        return { status: true, data: [], additional_data: {}, msg: 'No queries yet' };
      }
      return rejectWithValue(error?.message || 'Failed to fetch user queries');
    }
  },
);

export const updateCertificateNote = createAsyncThunk(
  'profile/updateCertificateNote',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await updateCertificateNoteApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update certificate note');
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    setProfileImages(state, action) {
      state.profile.bannerImage = action.payload.bannerImage ?? null;
      state.profile.profileImage = action.payload.profileImage ?? null;
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
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
        const additionalData = action.payload?.additional_data || {};
        const incomingUser = additionalData.user || null;
        if (incomingUser) {
          state.user = {
            ...incomingUser,
            profile_picture: incomingUser.profile_picture ?? state.user?.profile_picture ?? null,
            cover_picture: incomingUser.cover_picture ?? state.user?.cover_picture ?? null,
          };
          try {
            const rawAuthUser = localStorage.getItem('authUser');
            const authUser = rawAuthUser ? JSON.parse(rawAuthUser) : {};
            localStorage.setItem('authUser', JSON.stringify({
              ...authUser,
              ...state.user,
              profile_picture: state.user.profile_picture ?? authUser?.profile_picture ?? null,
              cover_picture: state.user.cover_picture ?? authUser?.cover_picture ?? null,
            }));
          } catch (_) {}
          state.profile.name = incomingUser.name || '';
          state.profile.profileImage = state.user.profile_picture || null;
          state.profile.bannerImage = state.user.cover_picture || null;
        } else {
          state.user = null;
        }
        state.addOns = additionalData.add_ons || null;
        state.businessReviewCount = additionalData.businessReviewCount || 0;
        state.certificates = Array.isArray(additionalData.certificates) ? additionalData.certificates : [];
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user profile';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
        // Update user state with new data from API response; preserve existing images when API omits them
        if (action.payload?.data) {
          const incoming = action.payload.data;
          state.user = {
            ...state.user,
            ...incoming,
            profile_picture: incoming.profile_picture ?? state.user?.profile_picture ?? null,
            cover_picture: incoming.cover_picture ?? state.user?.cover_picture ?? null,
          };
          try {
            const rawAuthUser = localStorage.getItem('authUser');
            const authUser = rawAuthUser ? JSON.parse(rawAuthUser) : {};
            localStorage.setItem('authUser', JSON.stringify({
              ...authUser,
              ...state.user,
              profile_picture: state.user.profile_picture ?? authUser?.profile_picture ?? null,
              cover_picture: state.user.cover_picture ?? authUser?.cover_picture ?? null,
            }));
          } catch (_) {}
          // Update profile state for backward compatibility
          state.profile.name = incoming.name || '';
          state.profile.profileImage = state.user.profile_picture || null;
          state.profile.bannerImage = state.user.cover_picture || null;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update user profile';
      })
      .addCase(getUserCertificate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(getUserCertificate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
        const data = action.payload?.data;
        const arr = Array.isArray(data) ? data : [];
        // Don't overwrite with empty if we already have certificates (e.g. from getUserProfile additional_data)
        if (arr.length > 0 || state.certificates.length === 0) {
          state.certificates = arr;
        }
      })
      .addCase(getUserCertificate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user certificates';
      })
      .addCase(getUserQueries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(getUserQueries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
        // Same API as old site getCertificates: response may be { data: [...] } or { data: { data: [...] } }
        const rawData = action.payload?.data;
        const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);
        const additionalData = action.payload?.additional_data || {};
        const requestType = action.meta?.arg?.type;
        // type=1: completed certificates (same endpoint as old website getCertificates type=1)
        if (requestType === 1) {
          const arr = Array.isArray(data) ? data : [];
          // Don't overwrite existing certificates with empty array; backend often returns empty
          // even when profile additional_data already contains completed items.
          if (arr.length > 0 || state.certificates.length === 0) {
            state.certificates = arr;
          }
          if (additionalData.complete_count !== undefined) {
            state.queryCounts.completeCount = additionalData.complete_count;
          }
        } else {
          state.queries = data;
          // Debug: log first pending item shape so we can fix image URL (matches authentic-detective-talha getCertificates type=0)
          if (Array.isArray(data) && data.length > 0 && typeof console !== 'undefined' && console.log) {
            const first = data[0];
            console.log('[getUserQueries type=0] First item keys:', Object.keys(first));
            console.log('[getUserQueries type=0] First item image fields:', {
              request_images: first?.request_images,
              attribute_images: first?.attribute_images,
              image: first?.image,
              thumbnail: first?.thumbnail,
              authenticate_query_keys: first?.authenticate_query ? Object.keys(first.authenticate_query) : null,
              query_detail_keys: first?.query_detail ? Object.keys(first.query_detail) : null,
            });
          }
          state.queryCounts = {
            pendingCount: additionalData.pending_count ?? state.queryCounts.pendingCount ?? 0,
            completeCount: additionalData.complete_count ?? state.queryCounts.completeCount ?? 0,
            pendingRequestCount: additionalData.pending_request_count ?? state.queryCounts.pendingRequestCount ?? 0,
            pendingValuationCount: additionalData.pending_valuation_count ?? state.queryCounts.pendingValuationCount ?? 0,
            completedValuationCount: additionalData.completed_valuation_count ?? state.queryCounts.completedValuationCount ?? 0,
          };
        }
      })
      .addCase(getUserQueries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user queries';
      });
  },
});

export const {
  updateProfile,
  setProfileImages,
  setStatus,
  setError,
  setMessage,
} = profileSlice.actions;

export default profileSlice.reducer;

