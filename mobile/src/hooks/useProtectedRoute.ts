import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './useAuth';

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // @ts-ignore - navigation type will be properly typed when used with specific navigator
      navigation.replace('Login');
    }
  }, [isAuthenticated, isLoading, navigation]);

  return {
    isLoading,
    isAuthenticated,
  };
}; 
