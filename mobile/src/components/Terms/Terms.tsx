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

// React and core libraries
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

// Theme and styling
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
export const Terms = () => {
  return (
    <View testID="terms" style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text variant="headlineMedium" style={styles.title}>
          Terms and Conditions
        </Text>
        <Text style={styles.text}>
          By using this quiz application, you agree to the following terms and conditions:
        </Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.text}>
          Permission is granted to temporarily download one copy of the application for personal, non-commercial transitory viewing only.
        </Text>
        
        <Text style={styles.sectionTitle}>3. Disclaimer</Text>
        <Text style={styles.text}>
          The materials on this application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Limitations</Text>
        <Text style={styles.text}>
          In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our application.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the application, to understand our practices.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Modifications</Text>
        <Text style={styles.text}>
          We may revise these terms of service for our application at any time without notice. By using this application, you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Contact Information</Text>
        <Text style={styles.text}>
          If you have any questions about these Terms and Conditions, please contact us through the application.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  text: {
    lineHeight: 24,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.primaryContainer,
  },
}); 
