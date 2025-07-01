import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStatisticsData, syncStatisticsData, updateUserProfile } from '../services/api';
import { loadStatisticsData } from './statisticsSlice';
import authService from '../services/authService';
import type { RootState } from './index';
import { loadCompletedTopics } from './progressSlice';
import { User } from '../types/user.types';

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
 * Async thunk for user login with statistics data loading
 * 
 * Authenticates the user and loads their statistics data (quiz time and completed topics)
 * from the backend into the Redux state for persistence.
 * 
 * @param credentials - User login credentials
 * @returns Promise resolving to authentication response
 */
export const loginWithStatistics = createAsyncThunk(
  'auth/loginWithStatistics',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    // Perform login
    const response = await authService.login(credentials);
    
    // Load statistics data from backend
    try {
      const statisticsData = await fetchStatisticsData(response.access_token);
      dispatch(loadStatisticsData(statisticsData));
      
      // Also load completed topics to progress slice
      if (statisticsData.completedTopics && statisticsData.completedTopics.length > 0) {
        dispatch(loadCompletedTopics(statisticsData.completedTopics));
      }
    } catch (error) {
      console.warn('Failed to load statistics data:', error);
      // Don't fail login if statistics loading fails
    }
    
    return response;
  }
);

/**
 * Async thunk for user logout with statistics data syncing
 * 
 * Syncs the current statistics data (quiz time and completed topics) and user preferences
 * to the backend before clearing the authentication state.
 * 
 * @param _ - Unused parameter (thunk requirement)
 * @returns Promise resolving to logout confirmation
 */
export const logoutWithStatisticsSync = createAsyncThunk(
  'auth/logoutWithStatisticsSync',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { token, user } = state.auth;
    const { totalQuizMinutes, dailyQuizTimes } = state.statistics;
    const { topicProgress } = state.progress;
    
    // Convert topic progress to completed topics format
    const completedTopics = Object.values(topicProgress)
      .filter(topic => topic.completed)
      .map(topic => ({
        topicId: topic.topicId,
        score: topic.score,
        completedAt: topic.lastAttemptDate || new Date().toISOString()
      }));
    
    // Sync statistics data to backend if user is authenticated
    if (token && (totalQuizMinutes > 0 || dailyQuizTimes.length > 0 || completedTopics.length > 0)) {
      try {
        await syncStatisticsData({
          totalQuizMinutes,
          dailyQuizTimes,
          completedTopics
        }, token);
      } catch (error) {
        console.warn('Failed to sync statistics data:', error);
        // Don't fail logout if sync fails
      }
    }
    
    // Sync user preferences to backend if user is authenticated
    if (token && user) {
      try {
        await updateUserProfile({
          studyPaceId: user.studyPaceId,
          marketingEmails: user.marketingEmails,
          shareDevices: user.shareDevices,
        }, token);
      } catch (error) {
        console.warn('Failed to sync user preferences:', error);
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
        agreedToTerms?: boolean;
      }>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loginWithStatistics
      .addCase(loginWithStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        // Use complete user data from backend response
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginWithStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Handle logoutWithStatisticsSync
      .addCase(logoutWithStatisticsSync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutWithStatisticsSync.fulfilled, (state) => {
        state.isLoading = false;
        // logout action is dispatched in the thunk
      })
      .addCase(logoutWithStatisticsSync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      });
  },
});

export const { setCredentials, setLoading, setError, logout, updateUserPreferences } = authSlice.actions;

export default authSlice.reducer; 
