/**
 * @fileoverview Forgot Password Screen component for the mobile application
 * 
 * This component provides a password recovery interface where users can
 * request a password reset email. It features email validation and
 * integration with the backend password recovery system.
 * 
 * The component includes:
 * - Email input with validation
 * - Password recovery request submission
 * - Loading states during API calls
 * - Success confirmation modal
 * - Navigation back to login
 * 
 * @module screens/ForgotPassword
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Surface, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme, spacing } from '../../theme';
import { createTextStyles } from '../../utils/themeUtils';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '../../config';
import { BackButton } from '../../components/BackButton';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../utils/validationSchemas';
import { useFormLoading } from '../../hooks/useFormLoading';
import { handleApiError, fetchWithAuth } from '../../utils/apiUtils';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

// Create utility styles
const backTextStyles = createTextStyles('medium', 'regular', theme.colors.surface);
const titleStyles = createTextStyles('xlarge', 'semiBold', theme.colors.surface);
const subtitleStyles = createTextStyles('large', 'regular', theme.colors.surface);

/**
 * Forgot Password Screen component for password recovery
 * 
 * Provides a simple and secure interface for users to request
 * password reset emails. Integrates with the backend to send
 * recovery instructions to the provided email address.
 * 
 * Key features:
 * - Email input with real-time validation
 * - Password recovery request submission
 * - Loading states during API communication
 * - Success confirmation with modal
 * - Error handling for failed requests
 * - Navigation back to login screen
 * - Form validation using Zod schema
 * 
 * @returns {JSX.Element} The password recovery screen with email form
 * 
 * @example
 * ```tsx
 * // Navigation to forgot password screen
 * navigation.navigate('ForgotPassword');
 * ```
 */
export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { isLoading, withLoading } = useFormLoading();

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handles password recovery form submission
   * 
   * Sends a password recovery request to the backend API
   * with the provided email address. Shows loading state
   * during the request and success modal on completion.
   * 
   * @param {ForgotPasswordFormData} data - The validated form data
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    await withLoading(async () => {
      try {
        await fetchWithAuth(`${API_URL}/auth/forgot-password`, {
          method: 'POST',
          body: JSON.stringify({
            email: data.email,
          }),
        });
        setShowSuccessModal(true);
      } catch (error) {
        handleApiError(error, 'Failed to send recovery email');
      }
    });
  };

  /**
   * Handles success modal dismissal
   * 
   * Closes the success modal and navigates back to the
   * login screen after successful password recovery request.
   */
  const handleSuccessModalDismiss = () => {
    setShowSuccessModal(false);
    navigation.navigate('Login');
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <BackButton variant="dark" onPress={() => navigation.goBack()} testID="back-button" />
        <Text variant="titleMedium" style={styles.backText}>Back to Login</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            Recover Password
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                placeholder="john@example.com"
                error={errors.email?.message}
                keyboardType="email-address"
              />
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            variant="success"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Recovery Email'}
          </Button>
        </View>
      </View>

      <Portal>
        <CustomModal
          visible={showSuccessModal}
          onDismiss={handleSuccessModalDismiss}
          title="Recovery Email Sent"
          message="Please check your email for instructions to reset your password."
          primaryButtonText="Back to Login"
          onPrimaryButtonPress={handleSuccessModalDismiss}
        />
      </Portal>
    </Surface>
  );
};

const styles = StyleSheet.create({
  backText: {
    ...backTextStyles.text,
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  subtitle: {
    ...subtitleStyles.text,
    marginBottom: spacing.xl,
    opacity: 0.8,
    textAlign: 'center',
  },
  title: {
    ...titleStyles.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
}); 
