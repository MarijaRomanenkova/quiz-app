import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, setLoading, setError, logout } from '../store/authSlice';
import { updateUserProfile } from '../store/userSlice';
import { loadQuizTimeData } from '../store/statisticsSlice';
import authService from '../services/authService';
import { fetchUserProfile, fetchQuizTimeData, syncQuizTimeData } from '../services/api';

/**
 * Custom hook for managing user authentication state and operations
 * 
 * This hook provides a centralized way to handle user authentication including
 * login, registration, logout, and access to current authentication state.
 * It also handles syncing user profile data and quiz time statistics.
 * 
 * @returns Object containing authentication state and methods
 * 
 * @example
 * ```typescript
 * const { user, isAuthenticated, login, logout, isLoading } = useAuth();
 * 
 * const handleLogin = async () => {
 *   const success = await login('user@example.com', 'password123');
 *   if (success) {
 *     console.log('Login successful');
 *   }
 * };
 * ```
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const { dailyQuizTimes, totalQuizMinutes } = useSelector((state: RootState) => state.statistics);

  /**
   * Authenticates a user with email and password
   * 
   * This function handles the complete login flow:
   * 1. Authenticates with the backend
   * 2. Stores credentials in Redux state
   * 3. Fetches and updates user profile data
   * 4. Loads quiz time statistics
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to boolean indicating success
   * 
   * @example
   * ```typescript
   * const success = await login('user@example.com', 'password123');
   * if (success) {
   *   // Navigate to main app
   * } else {
   *   // Show error message
   * }
   * ```
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login({ email, password });
      
      // Set basic user info initially
      dispatch(setCredentials({
        token: response.access_token,
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          emailVerified: response.user.emailVerified,
          levelId: response.user.levelId,
          studyPaceId: 1, // Default value, will be updated from profile
          agreedToTerms: true, // Default value, will be updated from profile
          marketingEmails: false, // Default value, will be updated from profile
          shareDevices: false, // Default value, will be updated from profile
        },
      }));
      
      // Fetch complete user profile data from backend
      try {
        const profileData = await fetchUserProfile(response.access_token);
        if (profileData) {
          dispatch(updateUserProfile({
            username: profileData.username || '',
            email: profileData.email || '',
            levelId: profileData.levelId || '',
            studyPaceId: profileData.studyPaceId || 1,
            agreedToTerms: profileData.agreedToTerms || false,
            marketingEmails: profileData.marketingEmails || false,
            shareDevices: profileData.shareDevices || false,
          }));
        }
      } catch (profileError) {
        console.warn('Failed to fetch user profile:', profileError);
        // This is not critical - user can still use the app
      }

      // Fetch quiz time data from backend
      try {
        const quizTimeData = await fetchQuizTimeData(response.access_token);
        dispatch(loadQuizTimeData(quizTimeData));
      } catch (quizTimeError) {
        console.warn('Failed to fetch quiz time data:', quizTimeError);
        // This is not critical - user can still use the app
      }
      
      // Clear password from memory
      password = '';
      return true;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Login failed'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Registers a new user account
   * 
   * @param email - User's email address
   * @param password - User's password
   * @param username - User's display name
   * @param studyPaceId - User's preferred study pace (default: 1)
   * @param agreedToTerms - Whether user agreed to terms (default: false)
   * @returns Promise resolving to boolean indicating success
   * 
   * @example
   * ```typescript
   * const success = await register(
   *   'newuser@example.com',
   *   'password123',
   *   'newuser',
   *   2, // study pace
   *   true // agreed to terms
   * );
   * ```
   */
  const register = useCallback(async (email: string, password: string, username: string, studyPaceId: number = 1, agreedToTerms: boolean = false) => {
    try {
      dispatch(setLoading(true));
      await authService.register({ email, password, username, studyPaceId, agreedToTerms });
      // Clear password from memory
      password = '';
      return true;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Registration failed'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Logs out the current user
   * 
   * This function handles the complete logout flow:
   * 1. Syncs quiz time data to backend (if available)
   * 2. Clears all authentication data from Redux state
   * 
   * @returns Promise that resolves when logout is complete
   * 
   * @example
   * ```typescript
   * await logout();
   * // User is now logged out and should be redirected to login screen
   * ```
   */
  const logoutUser = useCallback(async () => {
    try {
      // Sync quiz time data to backend before logout
      if (token && dailyQuizTimes.length > 0) {
        try {
          await syncQuizTimeData(token, {
            dailyQuizTimes,
            totalQuizMinutes
          });
          console.log('Quiz time data synced successfully');
        } catch (syncError) {
          console.warn('Failed to sync quiz time data:', syncError);
          // Continue with logout even if sync fails
        }
      }
    } catch (error) {
      console.warn('Error during logout sync:', error);
    } finally {
      dispatch(logout());
    }
  }, [dispatch, token, dailyQuizTimes, totalQuizMinutes]);

  /** Whether the user is currently authenticated */
  const isAuthenticated = !!token;

  return {
    /** Current user data, null if not authenticated */
    user,
    /** JWT token for API authentication, null if not authenticated */
    token,
    /** Whether an authentication operation is in progress */
    isLoading,
    /** Error message from the last authentication operation */
    error,
    /** Whether the user is currently authenticated */
    isAuthenticated,
    /** Function to authenticate a user */
    login,
    /** Function to register a new user */
    register,
    /** Function to log out the current user */
    logout: logoutUser,
  };
}; 
