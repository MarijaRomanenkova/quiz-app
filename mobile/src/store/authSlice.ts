import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuizTimeData, syncQuizTimeData } from '../services/api';
import { loadQuizTimeData } from './statisticsSlice';
import authService from '../services/authService';
import type { RootState, AppDispatch } from './index';

/**
 * Interface representing the user data structure in the authentication state
 */
interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  username: string;
  /** Whether the user's email has been verified */
  emailVerified: boolean;
  /** Current level/grade of the user */
  levelId: string;
  /** User's preferred study pace setting */
  studyPaceId: number;
  /** Whether the user has agreed to terms and conditions */
  agreedToTerms: boolean;
  /** Whether the user has opted in to marketing emails */
  marketingEmails: boolean;
  /** Whether the user has enabled device sharing */
  shareDevices: boolean;
}

/**
 * Interface representing the complete authentication state
 */
interface AuthState {
  /** JWT token for API authentication */
  token: string | null;
  /** Current user data, null if not authenticated */
  user: User | null;
  /** Loading state for authentication operations */
  isLoading: boolean;
  /** Error message from authentication operations */
  error: string | null;
}

/**
 * Initial state for the authentication slice
 */
const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

/**
 * Async thunk for user login with quiz time data loading
 * 
 * Authenticates the user and loads their quiz time data from the backend
 * into the Redux state for persistence.
 * 
 * @param credentials - User login credentials
 * @returns Promise resolving to authentication response
 */
export const loginWithQuizTime = createAsyncThunk(
  'auth/loginWithQuizTime',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    // Perform login
    const response = await authService.login(credentials);
    
    // Load quiz time data from backend
    try {
      const quizTimeData = await fetchQuizTimeData(response.access_token);
      dispatch(loadQuizTimeData(quizTimeData));
    } catch (error) {
      console.warn('Failed to load quiz time data:', error);
      // Don't fail login if quiz time loading fails
    }
    
    return response;
  }
);

/**
 * Async thunk for user logout with quiz time data syncing
 * 
 * Syncs the current quiz time data to the backend before clearing
 * the authentication state.
 * 
 * @param _ - Unused parameter (thunk requirement)
 * @returns Promise resolving to logout confirmation
 */
export const logoutWithQuizTimeSync = createAsyncThunk(
  'auth/logoutWithQuizTimeSync',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { token } = state.auth;
    const { totalQuizMinutes, dailyQuizTimes } = state.statistics;
    
    // Sync quiz time data to backend if user is authenticated
    if (token && (totalQuizMinutes > 0 || dailyQuizTimes.length > 0)) {
      try {
        await syncQuizTimeData({
          totalQuizMinutes,
          dailyQuizTimes
        }, token);
      } catch (error) {
        console.warn('Failed to sync quiz time data:', error);
        // Don't fail logout if sync fails
      }
    }
    
    // Clear authentication state
    dispatch(logout());
    
    return { message: 'Logged out successfully' };
  }
);

/**
 * Redux slice for managing authentication state
 * 
 * This slice handles user authentication, including login/logout,
 * token management, user data, and loading/error states.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets user credentials (token and user data) after successful authentication
     * @param state - Current authentication state
     * @param action - Payload containing token and user data
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: AuthState['user'];
      }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    
    /**
     * Sets the loading state for authentication operations
     * @param state - Current authentication state
     * @param action - Boolean indicating loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Sets an error message for authentication operations
     * @param state - Current authentication state
     * @param action - Error message string or null to clear errors
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    /**
     * Logs out the user by clearing all authentication data
     * @param state - Current authentication state
     */
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
    },
    
    /**
     * Updates user preferences in the authentication state
     * @param state - Current authentication state
     * @param action - User preferences to update
     */
    updateUserPreferences: (
      state,
      action: PayloadAction<{
        studyPaceId?: number;
        marketingEmails?: boolean;
        shareDevices?: boolean;
      }>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loginWithQuizTime
      .addCase(loginWithQuizTime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithQuizTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        // Handle missing user properties with defaults
        state.user = {
          ...action.payload.user,
          studyPaceId: 1, // Default value
          agreedToTerms: false, // Default value
          marketingEmails: false, // Default value
          shareDevices: false, // Default value
        };
        state.error = null;
      })
      .addCase(loginWithQuizTime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Handle logoutWithQuizTimeSync
      .addCase(logoutWithQuizTimeSync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutWithQuizTimeSync.fulfilled, (state) => {
        state.isLoading = false;
        // logout action is dispatched in the thunk
      })
      .addCase(logoutWithQuizTimeSync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      });
  },
});

export const { setCredentials, setLoading, setError, logout, updateUserPreferences } = authSlice.actions;

export default authSlice.reducer; 
