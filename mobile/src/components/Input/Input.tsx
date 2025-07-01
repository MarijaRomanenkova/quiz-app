/**
 * @fileoverview Custom Input component for the mobile application
 * 
 * This component provides a consistent text input interface across the app
 * with proper theming, error handling, and accessibility features. It wraps
 * react-native-paper's TextInput component with custom styling and validation.
 * 
 * The component supports various input types including text, email, numeric,
 * and secure text entry, with optional right-side content and error messages.
 * 
 * @module components/Input
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { theme, spacing, layout } from '../../theme';
import { createInputStyles } from '../../utils/themeUtils';

/**
 * Props interface for the Input component
 * 
 * @interface InputProps
 * @property {string} label - The label text displayed above the input
 * @property {string} value - The current value of the input field
 * @property {(text: string) => void} onChangeText - Function called when input text changes
 * @property {string} [placeholder] - Placeholder text shown when input is empty
 * @property {string} [error] - Error message to display below the input
 * @property {boolean} [secureTextEntry] - Whether to hide the input text (for passwords)
 * @property {'default' | 'email-address' | 'numeric' | 'phone-pad'} [keyboardType='default'] - Type of keyboard to show
 * @property {React.ReactNode} [right] - Content to display on the right side of the input
 */
export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  right?: React.ReactNode;
}

/**
 * Custom Input component with consistent styling and error handling
 * 
 * Provides a themed text input with label, error display, and various
 * input types. The component uses the app's theme colors and provides
 * proper accessibility features through react-native-paper.
 * 
 * @param {InputProps} props - The input props
 * @param {string} props.label - The label text displayed above the input
 * @param {string} props.value - The current value of the input field
 * @param {(text: string) => void} props.onChangeText - Function called when input text changes
 * @param {string} [props.placeholder] - Placeholder text shown when input is empty
 * @param {string} [props.error] - Error message to display below the input
 * @param {boolean} [props.secureTextEntry] - Whether to hide the input text (for passwords)
 * @param {'default' | 'email-address' | 'numeric' | 'phone-pad'} [props.keyboardType='default'] - Type of keyboard to show
 * @param {React.ReactNode} [props.right] - Content to display on the right side of the input
 * @returns {JSX.Element} A styled input component with label and error handling
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   value={email}
 *   onChangeText={setEmail}
 *   placeholder="Enter your email"
 *   keyboardType="email-address"
 *   error={emailError}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Password"
 *   value={password}
 *   onChangeText={setPassword}
 *   secureTextEntry
 *   right={<TextInput.Icon icon="eye" />}
 * />
 * ```
 */
export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = 'default',
  right,
}: InputProps) => {
  const inputStyles = createInputStyles('light');
  
  return (
    <View style={styles.container}>
      <Text style={[inputStyles.label, { color: theme.colors.surface }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.surface}
        style={styles.input}
        textColor={theme.colors.surface}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        right={right}
        mode="outlined"
        theme={{
          colors: {
            primary: theme.colors.primary,
            onSurfaceVariant: theme.colors.surface,
            onSurface: theme.colors.surface,
          },
          roundness: layout.borderRadius.large,
        }}
        outlineColor={theme.colors.surface}
        activeOutlineColor={theme.colors.primary}
      />
      {error && (
        <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: 4,
  },
}); 
