import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

/**
 * Custom hook for managing authentication token and related operations
 * 
 * This hook provides utilities for working with the JWT token including
 * generating authorization headers and handling token expiration.
 * 
 * @returns Object containing token utilities and handlers
 * 
 * @example
 * ```typescript
 * const { token, getAuthHeader, handleTokenExpiration } = useToken();
 * 
 * // Use in API calls
 * const headers = getAuthHeader();
 * fetch('/api/protected', { headers });
 * 
 * // Handle expired token
 * if (tokenExpired) {
 *   handleTokenExpiration();
 * }
 * ```
 */
export const useToken = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  /**
   * Generates authorization header for API requests
   * 
   * @returns Object with Authorization header if token exists, empty object otherwise
   * 
   * @example
   * ```typescript
   * const headers = getAuthHeader();
   * // Returns: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
   * // or: {}
   * ```
   */
  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  /**
   * Handles token expiration by logging out the user
   * 
   * This function should be called when the backend returns a 401 Unauthorized
   * response, indicating that the token has expired or is invalid.
   * 
   * @example
   * ```typescript
   * // In API error handler
   * if (response.status === 401) {
   *   handleTokenExpiration();
   *   // Redirect to login screen
   * }
   * ```
   */
  const handleTokenExpiration = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    /** Current JWT token, null if not authenticated */
    token,
    /** Function to generate authorization header for API requests */
    getAuthHeader,
    /** Function to handle token expiration by logging out user */
    handleTokenExpiration,
  };
}; 
