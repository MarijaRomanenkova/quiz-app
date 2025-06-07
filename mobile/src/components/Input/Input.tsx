import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { theme } from '../../theme';

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
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.label, { color: theme.colors.surface }]}>
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
          },
          roundness: 20,
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
