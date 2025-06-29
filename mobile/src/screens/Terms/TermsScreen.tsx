/**
 * @fileoverview Terms and Conditions Screen component for the mobile application
 * 
 * This component displays the terms and conditions of the application
 * for user review. It provides a simple interface for users to read
 * the legal terms before agreeing to them during registration or
 * profile management.
 * 
 * The component includes:
 * - Terms and conditions text display
 * - Navigation back to previous screen
 * - Consistent styling with app theme
 * 
 * @module screens/Terms
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Terms'>;

/**
 * Terms and Conditions Screen component
 * 
 * Displays the application's terms and conditions for user review.
 * Provides a clean, readable interface for legal text with navigation
 * back to the previous screen. This screen is typically accessed from
 * registration or profile management flows.
 * 
 * Key features:
 * - Clear display of terms and conditions text
 * - Consistent styling with app theme
 * - Simple navigation back to previous screen
 * - Responsive layout with proper spacing
 * - Accessible text formatting for readability
 * 
 * @returns {JSX.Element} The terms and conditions display screen
 * 
 * @example
 * ```tsx
 * // Navigation to terms screen
 * navigation.navigate('Terms');
 * ```
 */
export const TermsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Surface style={[styles.container, styles.screenContainer]}>
      <Text variant="headlineMedium" style={[styles.title, styles.titleText]}>
        Terms and Conditions
      </Text>
      <Text style={styles.termsText}>
        By using this app, you agree to our terms and conditions...
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={[styles.backButton, styles.buttonMargin]}
      >
        Back
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
    padding: 24,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  titleText: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  termsText: {
    marginVertical: 24,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 6,
  },
  buttonMargin: {
    marginTop: 16,
  },
}); 
