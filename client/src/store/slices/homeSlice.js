import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHomeData as getHomeDataApi, getAllSellers as getAllSellersApi, searchBusinesses as searchBusinessesApi, getAllReviews as getAllReviewsApi, getVerifiedSellers as getVerifiedSellersApi, getVerifiedBusiness as getVerifiedBusinessApi, getBusinessCountries as getBusinessCountriesApi } from '../../services/homeService';

const initialState = {
  business: [],
  businessCountries: [],
  sellersCurrentPage: 1,
  sellersLastPage: 1,
  reviews: [],
  reviewsCurrentPage: 1,
  reviewsLastPage: 1,
  reviewsStatus: 'idle',
  verifiedSellers: [],
  verifiedSellersCurrentPage: 1,
  verifiedSellersLastPage: 1,
  verifiedSellersStatus: 'idle',
  searchResults: [],
  searchStatus: 'idle',
  status: 'idle',
  error: null,
};

export const getHomeData = createAsyncThunk(
  'home/getHomeData',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getHomeDataApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch home data');
    }
  }
);

export const searchBusinesses = createAsyncThunk(
  'home/searchBusinesses',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await searchBusinessesApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Search failed');
    }
  }
);

export const getAllReviews = createAsyncThunk(
  'home/getAllReviews',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getAllReviewsApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch reviews');
    }
  }
);

export const getVerifiedSellers = createAsyncThunk(
  'home/getVerifiedSellers',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getVerifiedSellersApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch verified sellers');
    }
  }
);

export const getBusinessCountries = createAsyncThunk(
  'home/getBusinessCountries',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getBusinessCountriesApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch countries');
    }
  }
);

export const getAllSellers = createAsyncThunk(
  'home/getAllSellers',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getAllSellersApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch sellers');
    }
  }
);

/** GET /verified-business - all verified businesses (ad-old). Optional searchText for /verified-business/{searchText}. */
export const getVerifiedBusiness = createAsyncThunk(
  'home/getVerifiedBusiness',
  async (payload = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getVerifiedBusinessApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch verified businesses');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHomeData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getHomeData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const data = action.payload?.data || {};
        state.business = data.business || [];
        state.error = null;
      })
      .addCase(getAllSellers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllSellers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.business = Array.isArray(action.payload?.data) ? action.payload.data : [];
        state.sellersCurrentPage = action.payload?.current_page ?? 1;
        state.sellersLastPage = action.payload?.last_page ?? 1;
        state.error = null;
      })
      .addCase(getAllSellers.rejected, (state, action) => {
        state.status = 'failed';
        state.business = [];
        state.error = action.payload || 'Failed to fetch sellers';
      })
      .addCase(getBusinessCountries.fulfilled, (state, action) => {
        state.businessCountries = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(getBusinessCountries.rejected, (state) => {
        state.businessCountries = [];
      })
      .addCase(getHomeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch home data';
      })
      .addCase(searchBusinesses.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(searchBusinesses.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded';
        state.searchResults = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(searchBusinesses.rejected, (state, action) => {
        state.searchStatus = 'failed';
        state.searchResults = [];
      })
      .addCase(getAllReviews.pending, (state) => {
        state.reviewsStatus = 'loading';
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.reviewsStatus = 'succeeded';
        state.reviews = Array.isArray(action.payload?.data) ? action.payload.data : [];
        state.reviewsCurrentPage = action.payload?.current_page ?? 1;
        state.reviewsLastPage = action.payload?.last_page ?? 1;
      })
      .addCase(getAllReviews.rejected, (state) => {
        state.reviewsStatus = 'failed';
        state.reviews = [];
      })
      .addCase(getVerifiedSellers.pending, (state) => {
        state.verifiedSellersStatus = 'loading';
      })
      .addCase(getVerifiedSellers.fulfilled, (state, action) => {
        state.verifiedSellersStatus = 'succeeded';
        state.verifiedSellers = Array.isArray(action.payload?.data) ? action.payload.data : [];
        state.verifiedSellersCurrentPage = action.payload?.current_page ?? 1;
        state.verifiedSellersLastPage = action.payload?.last_page ?? 1;
      })
      .addCase(getVerifiedSellers.rejected, (state) => {
        state.verifiedSellersStatus = 'failed';
        state.verifiedSellers = [];
      })
      .addCase(getVerifiedBusiness.pending, (state) => {
        state.verifiedSellersStatus = 'loading';
      })
      .addCase(getVerifiedBusiness.fulfilled, (state, action) => {
        state.verifiedSellersStatus = 'succeeded';
        const raw = action.payload;
        const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        state.verifiedSellers = list;
        state.verifiedSellersCurrentPage = raw?.current_page ?? 1;
        state.verifiedSellersLastPage = raw?.last_page ?? 1;
      })
      .addCase(getVerifiedBusiness.rejected, (state) => {
        state.verifiedSellersStatus = 'failed';
        state.verifiedSellers = [];
      });
  },
});

export default homeSlice.reducer;
