import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { theme, spacing } from '../../theme';
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';

/**
 * Props for the LoadingWrapper component
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
 * error handling and retry functionality.
 * 
 * @param props - Component props
 * @returns Loading state or children
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
