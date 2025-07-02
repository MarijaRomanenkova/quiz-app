/**
 * @fileoverview Loading Wrapper component for the mobile application
 * 
 * This component provides a reusable loading state wrapper that can be used
 * throughout the app to show loading indicators, error states, and retry
 * functionality. It ensures consistent loading experiences across all screens.
 * 
 * The component supports:
 * - Loading states with customizable text
 * - Error states with optional retry functionality
 * - Proper accessibility features
 * - Consistent styling with the app theme
 * 
 * @module components/common/LoadingWrapper
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { theme, spacing } from '../../theme';
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';

/**
 * Props interface for the LoadingWrapper component
 * 
 * @interface LoadingWrapperProps
 * @property {boolean} isLoading - Whether to show the loading state
 * @property {React.ReactNode} children - Content to display when not loading
 * @property {string} [loadingText='Loading...'] - Text to display during loading
 * @property {string | null} [error] - Error message to display if provided
 * @property {() => void} [onRetry] - Function called when retry is pressed
 */
interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * Reusable loading wrapper component
 * 
 * Provides consistent loading states across the app with optional
 * error handling and retry functionality. The component automatically
 * switches between loading, error, and content states based on props.
 * 
 * @param {LoadingWrapperProps} props - The loading wrapper props
 * @param {boolean} props.isLoading - Whether to show the loading state
 * @param {React.ReactNode} props.children - Content to display when not loading
 * @param {string} [props.loadingText='Loading...'] - Text to display during loading
 * @param {string | null} [props.error] - Error message to display if provided
 * @param {() => void} [props.onRetry] - Function called when retry is pressed
 * @returns {JSX.Element} Loading state, error state, or children based on props
 * 
 * @example
 * ```tsx
 * <LoadingWrapper isLoading={isLoadingData}>
 *   <UserProfile user={user} />
 * </LoadingWrapper>
 * ```
 * 
 * @example
 * ```tsx
 * <LoadingWrapper
 *   isLoading={isLoading}
 *   loadingText="Fetching questions..."
 *   error={error}
 *   onRetry={refetchData}
 * >
 *   <QuizScreen />
 * </LoadingWrapper>
 * ```
 */
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  error,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <Text style={styles.retryText} onPress={onRetry}>
            Tap to retry
          </Text>
        )}
      </View>
    );
  }

  return <>{children}</>;
};

const layoutStyles = createLayoutStyles();
const bodyStyles = createTextStyles('medium', 'regular', theme.colors.surface);
const errorStyles = createTextStyles('medium', 'regular', theme.colors.error);
const retryStyles = createTextStyles('medium', 'semiBold', theme.colors.primary);

const styles = StyleSheet.create({
  errorContainer: {
    ...layoutStyles.centered,
    flex: 1,
    padding: spacing.lg,
  },
  errorText: {
    ...errorStyles.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loadingContainer: {
    ...layoutStyles.centered,
    flex: 1,
  },
  loadingText: {
    ...bodyStyles.text,
    marginTop: spacing.sm,
  },
  retryText: {
    ...retryStyles.text,
    textDecorationLine: 'underline',
  },
}); 
