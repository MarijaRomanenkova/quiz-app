/**
 * @fileoverview Protected Route Hook for Authentication Guarding
 * 
 * This hook provides automatic route protection for screens that require
 * user authentication. It monitors the authentication state and automatically
 * redirects unauthenticated users to the login screen.
 * 
 * The hook integrates with React Navigation and the authentication system
 * to provide seamless route protection without manual navigation logic
 * in each protected screen.
 * 
 * Key Features:
 * - Automatic redirection to login for unauthenticated users
 * - Loading state handling during authentication checks
 * - Integration with React Navigation
 * - Seamless integration with useAuth hook
 * 
 * @module hooks/useProtectedRoute
 */

import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from './useAuth';

/**
 * Custom hook for protecting routes that require authentication
 * 
 * This hook automatically redirects unauthenticated users to the login screen.
 * It should be used in screens that require user authentication to provide
 * seamless route protection without manual navigation logic.
 * 
 * The hook monitors authentication state changes and automatically handles
 * navigation to the login screen when the user is not authenticated. It also
 * provides loading state information to handle authentication checks gracefully.
 * 
 * @returns {Object} Object containing authentication state and loading information
 * @returns {boolean} returns.isLoading - Whether authentication state is being loaded
 * @returns {boolean} returns.isAuthenticated - Whether the user is currently authenticated
 * 
 * @example
 * ```typescript
 * // Basic usage in a protected screen
 * const ProtectedScreen = () => {
 *   const { isLoading, isAuthenticated } = useProtectedRoute();
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   if (!isAuthenticated) {
 *     return null; // Will be redirected to login automatically
 *   }
 * 
 *   return <ProtectedContent />;
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Usage with conditional rendering
 * const ProfileScreen = () => {
 *   const { isLoading, isAuthenticated } = useProtectedRoute();
 * 
 *   if (isLoading) {
 *     return <ActivityIndicator size="large" />;
 *   }
 * 
 *   return isAuthenticated ? (
 *     <UserProfile />
 *   ) : (
 *     <Text>Redirecting to login...</Text>
 *   );
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Usage in a component with multiple authentication states
 * const DashboardScreen = () => {
 *   const { isLoading, isAuthenticated } = useProtectedRoute();
 *   const { user } = useAuth();
 * 
 *   if (isLoading) {
 *     return <LoadingScreen />;
 *   }
 * 
 *   if (!isAuthenticated) {
 *     return null; // Automatic redirect to login
 *   }
 * 
 *   return (
 *     <View>
 *       <Text>Welcome, {user?.username}!</Text>
 *       <DashboardContent />
 *     </View>
 *   );
 * };
 * ```
 */
export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.navigate('Login');
    }
  }, [isAuthenticated, isLoading, navigation]);

  return {
    /** Whether authentication state is being loaded */
    isLoading,
    /** Whether the user is currently authenticated */
    isAuthenticated,
  };
}; 
