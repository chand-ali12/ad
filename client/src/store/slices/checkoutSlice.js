import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  changePaymentStatus as changePaymentStatusApi,
  changePaymentStatusBundle as changePaymentStatusBundleApi,
  isSold as isSoldApi,
} from '../../services/paymentService';
import { verifyCoupon as verifyCouponApi } from '../../services/couponService';
import {
  submitAuthenticityCardsOrder as submitAuthenticityCardsOrderApi,
  getAuthenticityCardPricing as getAuthenticityCardPricingApi,
  authenticityCardsChangeStatus as authenticityCardsChangeStatusApi,
  valuationCoaCheckoutBraintree as valuationCoaCheckoutBraintreeApi,
  checkoutBraintree as checkoutBraintreeApi,
  prepareAuthCheckoutBraintree as prepareAuthCheckoutBraintreeApi,
} from '../../services/forumService';

export const verifyCoupon = createAsyncThunk(
  'checkout/verifyCoupon',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await verifyCouponApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Invalid coupon code');
    }
  }
);

export const changePaymentStatus = createAsyncThunk(
  'checkout/changePaymentStatus',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await changePaymentStatusApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to change payment status');
    }
  }
);

export const changePaymentStatusBundle = createAsyncThunk(
  'checkout/changePaymentStatusBundle',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      const userId = getState()?.auth?.user?.id;
      return await changePaymentStatusBundleApi({
        id: userId,
        ...payload,
        token,
      });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to change payment status for bundle');
    }
  }
);

export const isSold = createAsyncThunk(
  'checkout/isSold',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await isSoldApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to mark as sold');
    }
  }
);

export const submitAuthenticityCardsOrder = createAsyncThunk(
  'checkout/submitAuthenticityCardsOrder',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await submitAuthenticityCardsOrderApi({ ...payload, token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to submit order');
    }
  }
);

export const getAuthenticityCardPricing = createAsyncThunk(
  'checkout/getAuthenticityCardPricing',
  async (_payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await getAuthenticityCardPricingApi({ token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch pricing');
    }
  }
);

/** Phase 1: Complete auth-cards payment via Braintree (change-status) */
export const submitBraintreeAuthCards = createAsyncThunk(
  'checkout/submitBraintreeAuthCards',
  async (body, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await authenticityCardsChangeStatusApi(body, { token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Payment failed');
    }
  }
);

/** Phase 1: Valuation checkout via Braintree */
export const submitBraintreeValuation = createAsyncThunk(
  'checkout/submitBraintreeValuation',
  async (body, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await valuationCoaCheckoutBraintreeApi(body, { token });
    } catch (error) {
      return rejectWithValue(error?.message || 'Payment failed');
    }
  }
);

/** Phase 1: General checkout via Braintree (submit payment with nonce) */
export const submitBraintreeCheckout = createAsyncThunk(
  'checkout/submitBraintreeCheckout',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      const { is_expedited, ...body } = payload && typeof payload === 'object' ? payload : {};
      return await checkoutBraintreeApi(body, { token, is_expedited });
    } catch (error) {
      return rejectWithValue(error?.message || 'Payment failed');
    }
  }
);

/** ad-old: Get Braintree token for auth checkout (no authenticity-cards-submit) */
export const getAuthCheckoutBraintreeToken = createAsyncThunk(
  'checkout/getAuthCheckoutBraintreeToken',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await prepareAuthCheckoutBraintreeApi(payload, { token, is_expedited: payload?.is_expedited });
    } catch (error) {
      const msg = error?.response?.data?.msg ?? error?.response?.data?.message ?? error?.message;
      return rejectWithValue(msg || 'Failed to prepare checkout');
    }
  }
);

const initialState = {
  customer: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    country: '',
    city: '',
  },
  payment: {
    cardNumber: '',
    expirationDate: '',
    cvc: '',
  },
  promoCode: '',
  coupon: null,
  couponError: null,
  cardPricing: [],
  cardPricingStatus: 'idle',
  cardPricingError: null,
  status: 'idle',
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateCustomer(state, action) {
      state.customer = { ...state.customer, ...action.payload };
    },
    updatePayment(state, action) {
      state.payment = { ...state.payment, ...action.payload };
    },
    setPromoCode(state, action) {
      state.promoCode = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetCheckout(state) {
      state.customer = initialState.customer;
      state.payment = initialState.payment;
      state.promoCode = '';
      state.coupon = null;
      state.couponError = null;
      state.couponStatus = 'idle';
      state.status = 'idle';
      state.error = null;
    },
    clearCoupon(state) {
      state.coupon = null;
      state.couponError = null;
      state.couponStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyCoupon.pending, (state) => {
        state.couponStatus = 'loading';
        state.couponError = null;
      })
      .addCase(verifyCoupon.fulfilled, (state, action) => {
        const data = action.payload?.data;
        if (data === null || data === undefined) {
          // API signals an invalid/unrecognised coupon by returning data: null
          state.coupon = null;
          state.couponError = 'Invalid coupon code';
          state.couponStatus = 'failed';
        } else {
          // data is the new total after the discount (works for both fixed-price and percentage coupons)
          state.coupon = data;
          state.couponError = null;
          state.couponStatus = 'succeeded';
        }
      })
      .addCase(verifyCoupon.rejected, (state, action) => {
        state.coupon = null;
        state.couponError = action.payload || 'Invalid coupon code';
        state.couponStatus = 'failed';
      })
      .addCase(changePaymentStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePaymentStatus.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePaymentStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to change payment status';
      })
      .addCase(changePaymentStatusBundle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePaymentStatusBundle.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(changePaymentStatusBundle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to change payment status for bundle';
      })
      .addCase(isSold.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(isSold.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(isSold.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to mark as sold';
      })
      .addCase(submitAuthenticityCardsOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitAuthenticityCardsOrder.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitAuthenticityCardsOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to submit order';
      })
      .addCase(getAuthenticityCardPricing.pending, (state) => {
        state.cardPricingStatus = 'loading';
        state.cardPricingError = null;
      })
      .addCase(getAuthenticityCardPricing.fulfilled, (state, action) => {
        const data = action.payload?.data;
        state.cardPricing = Array.isArray(data) ? data : [];
        state.cardPricingStatus = 'succeeded';
        state.cardPricingError = null;
      })
      .addCase(getAuthenticityCardPricing.rejected, (state, action) => {
        state.cardPricing = [];
        state.cardPricingStatus = 'failed';
        state.cardPricingError = action.payload || 'Failed to fetch pricing';
      })
      .addCase(submitBraintreeAuthCards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBraintreeAuthCards.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitBraintreeAuthCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Payment failed';
      })
      .addCase(submitBraintreeValuation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBraintreeValuation.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitBraintreeValuation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Payment failed';
      })
      .addCase(submitBraintreeCheckout.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBraintreeCheckout.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitBraintreeCheckout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Payment failed';
      })
      .addCase(getAuthCheckoutBraintreeToken.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAuthCheckoutBraintreeToken.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(getAuthCheckoutBraintreeToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to prepare checkout';
      });
  },
});

export const {
  updateCustomer,
  updatePayment,
  setPromoCode,
  setStatus,
  setError,
  resetCheckout,
  clearCoupon,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
