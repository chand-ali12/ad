import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import authenticationRequestReducer from './slices/authenticationRequestSlice';
import brandsReducer from './slices/brandsSlice';
import businessReducer from './slices/businessSlice';
import cartReducer from './slices/cartSlice';
import certificatesReducer from './slices/certificatesSlice';
import checkoutReducer from './slices/checkoutSlice';
import profileReducer from './slices/profileSlice';
import reviewsReducer from './slices/reviewsSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';
import uploadReducer from './slices/uploadSlice';
import claimReducer from './slices/claimSlice';
import homeReducer from './slices/homeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authenticationRequest: authenticationRequestReducer,
    brands: brandsReducer,
    business: businessReducer,
    cart: cartReducer,
    certificates: certificatesReducer,
    checkout: checkoutReducer,
    profile: profileReducer,
    reviews: reviewsReducer,
    subscription: subscriptionReducer,
    ui: uiReducer,
    upload: uploadReducer,
    claim: claimReducer,
    home: homeReducer,
  },
});
