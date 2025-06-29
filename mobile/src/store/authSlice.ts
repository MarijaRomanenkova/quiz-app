import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { setCredentials, setLoading, setError, logout } = authSlice.actions;

export default authSlice.reducer; 
