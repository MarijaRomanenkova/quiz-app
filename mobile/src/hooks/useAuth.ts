import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, setLoading, setError, logout } from '../store/authSlice';
import { updateUserProfile } from '../store/userSlice';
import authService from '../services/authService';
import { fetchUserProfile } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login({ email, password });
      dispatch(setCredentials({
        token: response.access_token,
        user: response.user,
      }));
      
      // Fetch complete user profile data from backend
      try {
        const profileData = await fetchUserProfile(response.access_token);
        if (profileData) {
          dispatch(updateUserProfile({
            name: profileData.username || '',
            email: profileData.email || '',
            level: profileData.levelId || '',
            studyPaceId: profileData.studyPaceId || 1,
            agreedToTerms: profileData.agreedToTerms || false,
            marketingEmails: profileData.marketingEmails || false,
            shareDevices: profileData.shareDevices || false,
            pushNotifications: profileData.pushNotifications || false,
          }));
        }
      } catch (profileError) {
        console.warn('Failed to fetch user profile:', profileError);
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

  const register = useCallback(async (email: string, password: string, username: string) => {
    try {
      dispatch(setLoading(true));
      await authService.register({ email, password, username });
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

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
  };
}; 
