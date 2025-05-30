
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../api/authApi';

// Async thunk for automatic token refresh (example of createAsyncThunk)
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Mock token refresh logic
      const currentState = getState() as any;
      const refreshToken = currentState.auth.refreshToken;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        token: 'new-jwt-token-' + Date.now(),
        refreshToken: 'new-refresh-token-' + Date.now(),
      };
    } catch (error) {
      return rejectWithValue('Failed to refresh token');
    }
  }
);

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: string | null;
  loginAttempts: number;
  isTokenRefreshing: boolean;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  lastLoginTime: localStorage.getItem('lastLoginTime'),
  loginAttempts: 0,
  isTokenRefreshing: false,
  preferences: {
    theme: 'dark',
    notifications: true,
    language: 'en',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user preferences
    updatePreferences: (state, action: PayloadAction<Partial<AuthState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    // Increment login attempts
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
    },
    
    // Reset login attempts
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Manual logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastLoginTime = null;
      state.loginAttempts = 0;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('lastLoginTime');
    },
  },
  
  // Handle async actions and RTK Query actions
  extraReducers: (builder) => {
    // Handle login mutation from RTK Query
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        state.lastLoginTime = new Date().toISOString();
        state.loginAttempts = 0;
        
        // Persist to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('lastLoginTime', state.lastLoginTime);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        state.loginAttempts += 1;
      });
    
    // Handle register mutation
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        state.lastLoginTime = new Date().toISOString();
        
        // Persist to localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('lastLoginTime', state.lastLoginTime);
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });
    
    // Handle logout mutation
    builder
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastLoginTime = null;
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('lastLoginTime');
      });
    
    // Handle token refresh async thunk
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isTokenRefreshing = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isTokenRefreshing = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        
        // Update localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isTokenRefreshing = false;
        // Force logout on refresh failure
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('lastLoginTime');
      });
  },
});

export const {
  clearError,
  updatePreferences,
  incrementLoginAttempts,
  resetLoginAttempts,
  setLoading,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
