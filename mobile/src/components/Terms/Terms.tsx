/**
 * @fileoverview Terms and Conditions component for the mobile application
 * 
 * This component displays the application's terms and conditions in a
 * scrollable format. It provides a clean, readable interface for users
 * to review the legal terms before agreeing to use the application.
 * 
 * The component uses react-native-paper's Surface and Text components
 * for consistent styling and proper typography hierarchy.
 * 
 * @module components/Terms
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { theme } from '../../theme';

/**
 * Terms and Conditions component
 * 
 * Displays the application's terms and conditions in a scrollable
 * container with proper typography and spacing. The component is
 * designed to be used in legal compliance screens where users
 * need to review and accept terms before proceeding.
 * 
 * @returns {JSX.Element} A scrollable terms and conditions display
 * 
 * @example
 * ```tsx
 * <Terms />
 * ```
 * 
 * @example
 * ```tsx
 * <Surface style={{ flex: 1 }}>
 *   <Terms />
 * </Surface>
 * ```
 */
export function Terms() {
  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text variant="headlineMedium" style={styles.title}>
          Terms and Conditions
        </Text>
        <Text style={styles.text}>
          {/* Add your terms text here */}
          By using this application, you agree to...
        </Text>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  text: {
    lineHeight: 24,
  },
}); 
