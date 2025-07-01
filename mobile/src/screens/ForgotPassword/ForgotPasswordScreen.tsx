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
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;



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
            Enter your email address and we'll send you instructions to reset your password.
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  backText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontFamily: 'Baloo2-Regular',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.surface,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: theme.colors.surface,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
}); 
