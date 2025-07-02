/**
 * User slice for managing user profile data and preferences
 * 
 * This slice handles user profile management separate from authentication including:
 * - User profile data storage and updates
 * - User preferences management (study pace, marketing emails, device sharing)
 * - Profile data synchronization with backend
 * - Loading and error states for user operations
 * 
 * Key features:
 * - Separate user data management from authentication state
 * - User preferences updates with backend synchronization
 * - Profile data clearing and reset functionality
 * - Loading and error state management for user operations
 * 
 * State management:
 * - user: Complete user profile data including preferences and settings
 * - loading: Loading state for user operations
 * - error: Error state for failed operations
 * 
 * Note: This slice is separate from auth slice to allow for different
 * persistence strategies and to handle user data independently of
 * authentication state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/user.types';

/**
 * Interface representing the user slice state
 */
interface UserState {
  /** Current user data, null if no user is set */
  user: User | null;
  /** Loading state for user operations */
  loading: boolean;
  /** Error message from user operations */
  error: string | null;
}

/**
 * Initial state for the user slice
 */
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Redux slice for managing user data and profile information
 * 
 * This slice handles user profile data, preferences, and user-related
 * operations separate from authentication state.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Sets the complete user data
     * @param state - Current user state
     * @param action - Complete user data to set
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    
    /**
     * Updates specific user profile fields
     * @param state - Current user state
     * @param action - Partial user data to update
     */
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    /**
     * Updates user preferences (study pace, marketing emails, device sharing)
     * @param state - Current user state
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
    
    /**
     * Clears all user data
     * @param state - Current user state
     */
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
    
    /**
     * Sets the loading state for user operations
     * @param state - Current user state
     * @param action - Boolean indicating loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Sets an error message for user operations
     * @param state - Current user state
     * @param action - Error message string
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  updateUserProfile,
  updateUserPreferences,
  clearUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer; 
