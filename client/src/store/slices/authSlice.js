import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerUser as registerUserApi,
  registerBusinessUser as registerBusinessUserApi,
  loginUser as loginUserApi,
  logoutUser as logoutUserApi,
  forgetPassword as forgetPasswordApi,
  changePassword as changePasswordApi,
  resetPasswordSubmit as resetPasswordSubmitApi,
} from '../../services/authServices';

// Load persisted auth state from localStorage
const loadPersistedAuth = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
    };
  } catch (error) {
    console.error('Failed to load persisted auth:', error);
    return { token: null, user: null };
  }
};

const persistedAuth = loadPersistedAuth();

const initialState = {
  userType: 'User',
  user: persistedAuth.user,
  token: persistedAuth.token,
  status: 'idle',
  error: null,
  message: null,
  signIn: {
    email: '',
    password: '',
  },
  signUp: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  resetPassword: {
    newPassword: '',
    confirmPassword: '',
  },
  onboarding: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street1: '',
    street2: '',
    country: '',
    city: '',
    state: '',
    countryCode: '',
    coaCount: '',
  },
  dateRange: {
    startDate: '',
    endDate: '',
  },
};

const toFriendlyRegisterError = (message) => {
  const msg = (message || '').toLowerCase();
  if (/already|exist|registered|taken|duplicate/.test(msg)) {
    return 'This email is already registered. Please sign in or use a different email.';
  }
  return message || 'Registration failed. Please check your details and try again.';
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerUserApi(payload);
    } catch (error) {
      const friendly = toFriendlyRegisterError(error?.message);
      return rejectWithValue(friendly);
    }
  },
);

export const registerBusinessUser = createAsyncThunk(
  'auth/registerBusinessUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await registerBusinessUserApi(payload);
    } catch (error) {
      const friendly = toFriendlyRegisterError(error?.message);
      return rejectWithValue(friendly);
    }
  },
);

const toFriendlyLoginError = (message) => {
  const msg = (message || '').toLowerCase();
  if (/invalid|incorrect|wrong|failed|credentials/.test(msg)) {
    return 'The email or password you entered is incorrect. Please enter your correct email and password.';
  }
  return message || 'Unable to sign in. Please check your details and try again.';
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await loginUserApi(payload);
    } catch (error) {
      const friendly = toFriendlyLoginError(error?.message);
      return rejectWithValue(friendly);
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.auth?.token;
      return await logoutUserApi(token);
    } catch (error) {
      return rejectWithValue(error?.message || 'Logout failed');
    }
  },
);

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      return await forgetPasswordApi(payload);
    } catch (error) {
      return rejectWithValue(error?.message || 'Forget password failed');
    }
  },
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      return await changePasswordApi(payload);
    } catch (error) {
      return rejectWithValue(error?.message || 'Change password failed');
    }
  },
);

/** Phase 1: Reset password via reset link (uses /reset-password-submit) */
export const resetPasswordSubmit = createAsyncThunk(
  'auth/resetPasswordSubmit',
  async (payload, { rejectWithValue }) => {
    try {
      return await resetPasswordSubmitApi(payload);
    } catch (error) {
      return rejectWithValue(error?.message || 'Reset password failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType(state, action) {
      state.userType = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    /** Update user after adding a business (e.g. from register-business API). Persists to localStorage so header sees user_business and hides "Add Business". */
    updateUserAfterAddBusiness(state, action) {
      const user = action.payload;
      if (user != null && typeof user === 'object') {
        state.user = user;
        try {
          localStorage.setItem('authUser', JSON.stringify(user));
        } catch (_) {}
      }
    },
    setToken(state, action) {
      state.token = action.payload;
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
    updateSignIn(state, action) {
      state.signIn = { ...state.signIn, ...action.payload };
    },
    updateSignUp(state, action) {
      state.signUp = { ...state.signUp, ...action.payload };
    },
    updateResetPassword(state, action) {
      state.resetPassword = { ...state.resetPassword, ...action.payload };
    },
    updateOnboarding(state, action) {
      state.onboarding = { ...state.onboarding, ...action.payload };
    },
    updateDateRange(state, action) {
      state.dateRange = { ...state.dateRange, ...action.payload };
    },
    resetAuthForms(state) {
      state.signIn = initialState.signIn;
      state.signUp = initialState.signUp;
      state.resetPassword = initialState.resetPassword;
      state.onboarding = initialState.onboarding;
      state.dateRange = initialState.dateRange;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      .addCase(registerBusinessUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(registerBusinessUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
      })
      .addCase(registerBusinessUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Business registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload ?? {};
        const data = payload?.data ?? {};
        const userInfo = data?.userInfo ?? payload?.userInfo ?? {};
        const user =
          data?.user ??
          userInfo?.user ??
          payload?.user ??
          payload?.additional_data?.user ??
          null;
        const token =
          data?.accessToken ??
          data?.token ??
          data?.access_token ??
          userInfo?.accessToken ??
          userInfo?.token ??
          payload?.accessToken ??
          payload?.token ??
          payload?.access_token ??
          null;

        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
        state.token = token;
        state.user = user;

        // Persist to localStorage
        if (token) {
          localStorage.setItem('authToken', token);
        }
        if (user) {
          localStorage.setItem('authUser', JSON.stringify(user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.message = action.payload?.msg || null;
        state.user = null;
        state.token = null;
        state.error = null;
        
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'idle';
        state.message = action.payload || 'Logout failed';
        state.user = null;
        state.token = null;
        state.error = null;
        
        // Clear localStorage even on logout failure
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      })
      .addCase(forgetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Forget password failed';
      })
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload?.msg || null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Change password failed';
      })
      .addCase(resetPasswordSubmit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(resetPasswordSubmit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const raw = (action.payload?.msg || '').toString();
        // Backend sometimes returns the same success copy as login; always show reset-specific text.
        const looksLikeLogin =
          /now\s*logged?\s*in|you\s*are\s*now\s*login|successfully\s*logged?\s*in|login\s*success/i.test(
            raw,
          );
        state.message =
          raw && !looksLikeLogin
            ? raw
            : 'Your password has been updated. You can sign in with your new password.';
      })
      .addCase(resetPasswordSubmit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Reset password failed';
      });
  },
});

export const {
  setUserType,
  setUser,
  updateUserAfterAddBusiness,
  setToken,
  setStatus,
  setError,
  setMessage,
  updateSignIn,
  updateSignUp,
  updateResetPassword,
  updateOnboarding,
  updateDateRange,
  resetAuthForms,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
