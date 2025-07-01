import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, setLoading, setError, logout } from '../store/authSlice';
import { updateUserProfile } from '../store/userSlice';
import { loadStatisticsData } from '../store/statisticsSlice';
import { loadCompletedTopics } from '../store/progressSlice';
import authService from '../services/authService';
import { fetchUserProfile, fetchStatisticsData, syncStatisticsData } from '../services/api';

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
  const { topicProgress } = useSelector((state: RootState) => state.progress);

  /**
   * Authenticates a user with email and password
   * 
   * This function handles the complete login flow:
   * 1. Authenticates with the backend
   * 2. Stores credentials in Redux state
   * 3. Fetches and updates user profile data
   * 4. Loads statistics data (quiz time and completed topics)
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

      // Fetch statistics data from backend (quiz time and completed topics)
      try {
        const statisticsData = await fetchStatisticsData(response.access_token);
        dispatch(loadStatisticsData(statisticsData));
        
        // Also load completed topics to progress slice
        if (statisticsData.completedTopics && statisticsData.completedTopics.length > 0) {
          dispatch(loadCompletedTopics(statisticsData.completedTopics));
        }
      } catch (statisticsError) {
        console.warn('Failed to fetch statistics data:', statisticsError);
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
  const register = useCallback(async (email: string, password: string, username: string, studyPaceId = 1, agreedToTerms = false) => {
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
   * 1. Syncs statistics data to backend (if available)
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
      // Get completed topics from progress slice
      const completedTopics = Object.values(topicProgress)
        .filter(topic => topic.completed)
        .map(topic => ({
          topicId: topic.topicId,
          score: topic.score,
          completedAt: topic.lastAttemptDate || new Date().toISOString()
        }));

      // Sync statistics data to backend before logout
      if (token && (dailyQuizTimes.length > 0 || completedTopics.length > 0)) {
        try {
          await syncStatisticsData({
            dailyQuizTimes,
            totalQuizMinutes,
            completedTopics
          }, token);
        } catch (error) {
          console.warn('Failed to sync statistics data:', error);
        }
      }
    } catch (error) {
      console.warn('Error during logout sync:', error);
    } finally {
      dispatch(logout());
    }
  }, [dispatch, token, dailyQuizTimes, totalQuizMinutes, topicProgress]);

  /** Whether the user is currently authenticated */
  const isAuthenticated = !!(token && user);

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
