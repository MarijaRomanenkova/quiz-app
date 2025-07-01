import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from './useAuth';

/**
 * Custom hook for protecting routes that require authentication
 * 
 * This hook automatically redirects unauthenticated users to the login screen.
 * It should be used in screens that require user authentication.
 * 
 * @returns Object containing authentication state
 * 
 * @example
 * ```typescript
 * const ProtectedScreen = () => {
 *   const { isLoading, isAuthenticated } = useProtectedRoute();
 * 
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 * 
 *   if (!isAuthenticated) {
 *     return null; // Will be redirected to login
 *   }
 * 
 *   return <ProtectedContent />;
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
