/**
 * @fileoverview Register Screen component for the mobile application
 * 
 * This component provides a comprehensive user registration interface where
 * new users can create accounts with detailed information and preferences.
 * It features extensive form validation, study pace selection, and terms
 * agreement management.
 * 
 * The component includes:
 * - Complete user registration form with validation
 * - Password strength requirements and confirmation
 * - Study pace selection for personalized learning
 * - Terms and conditions agreement
 * - Email verification workflow
 * - Error handling for existing accounts
 * 
 * @module screens/Register
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Surface, Switch, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { theme, spacing } from '../../theme';
import { StudyPaceSelector } from '../../components/StudyPaceSelector/StudyPaceSelector';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '../../services/authService';
import { BackButton } from '../../components/BackButton';
import { registerSchema, type RegisterFormData } from '../../utils/validationSchemas';
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility';
import { useFormLoading } from '../../hooks/useFormLoading';
import { handleApiError } from '../../utils/apiUtils';
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;



/**
 * Register Screen component for new user account creation
 * 
 * Provides a comprehensive registration interface with extensive form
 * validation, study preferences, and account setup. Handles the complete
 * user onboarding process with proper error handling and success flows.
 * 
 * Key features:
 * - Complete user registration form with real-time validation
 * - Password strength requirements with visual feedback
 * - Password confirmation matching validation
 * - Study pace selection for personalized learning experience
 * - Terms and conditions agreement with navigation
 * - Email verification workflow after successful registration
 * - Error handling for existing email addresses
 * - Form validation using Zod schema with custom refinements
 * - Integration with authentication service for account creation
 * 
 * @returns {JSX.Element} The registration screen with comprehensive form
 * 
 * @example
 * ```tsx
 * // Navigation to registration screen
 * navigation.navigate('Register');
 * ```
 */
export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
  const { showPassword: showConfirmPassword, togglePasswordVisibility: toggleConfirmPasswordVisibility } = usePasswordVisibility();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);
  const { isLoading, withLoading } = useFormLoading();
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false,
      studyPaceId: 1,
    },
  });

  /**
   * Handles navigation to terms and conditions screen
   * 
   * Navigates to the terms screen for user review of
   * terms and conditions before registration.
   */
  const handleTermsPress = () => {
    navigation.navigate('Terms');
  };

  /**
   * Handles form submission for user registration
   * 
   * Validates form data and attempts to register the user with the backend.
   * Shows appropriate success or error messages based on the result.
   * 
   * @param {RegisterFormData} data - The validated registration form data
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register({
        email: data.email,
        username: data.name,
        password: data.password,
        studyPaceId: data.studyPaceId,
        agreedToTerms: data.agreedToTerms,
      });

      setShowSuccessModal(true);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User with this email already exists') {
        setShowEmailExistsModal(true);
        return;
      }
      
      handleApiError(error, 'Registration failed');
    }
  };

  /**
   * Handles navigation to password recovery
   * 
   * Closes the email exists modal and navigates to the
   * forgot password screen for existing users.
   */
  const handleRecoverPassword = () => {
    setShowEmailExistsModal(false);
    navigation.navigate('ForgotPassword');
  };

  /**
   * Handles successful registration modal dismissal
   * 
   * Closes the success modal and navigates to the login
   * screen for the user to sign in with their new account.
   */
  const handleSuccessModalDismiss = () => {
    setShowSuccessModal(false);
    navigation.navigate('Login');
  };

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton variant="dark" onPress={() => navigation.goBack()} />
          <Text variant="titleMedium" style={styles.backText}>Back to Login</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="John Doe"
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  placeholder="john.doe@example.com"
                  error={errors.email?.message}
                  keyboardType="email-address"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="At least 8 characters with uppercase, lowercase, number and special character"
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={togglePasswordVisibility}
                      color={theme.colors.surface}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Repeat your password"
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={toggleConfirmPasswordVisibility}
                      color={theme.colors.surface}
                    />
                  }
                />
              )}
            />

            <View style={styles.section}>
              <Text variant="headlineSmall" style={styles.sectionTitle}>Study Pace</Text>
              <Controller
                control={control}
                name="studyPaceId"
                render={({ field: { onChange, value } }) => (
                  <StudyPaceSelector 
                    currentPaceId={value} 
                    onPaceChange={onChange}
                  />
                )}
              />
              {errors.studyPaceId && (
                <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.studyPaceId.message}
                </Text>
              )}
            </View>

            <View style={styles.termsContainer}>
              <Controller
                control={control}
                name="agreedToTerms"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.toggleRow}>
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      color={theme.colors.secondary}
                    />
                    <Text variant="bodyMedium" style={styles.toggleLabel}>
                      I agree to the{' '}
                      <Text 
                        variant="bodyMedium" 
                        style={styles.termsLink}
                        onPress={handleTermsPress}
                      >
                        Terms and Conditions
                      </Text>
                    </Text>
                  </View>
                )}
              />
              {errors.agreedToTerms && (
                <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.agreedToTerms.message}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            variant="success"
          >
            Register
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <CustomModal
          visible={showEmailExistsModal}
          onDismiss={() => setShowEmailExistsModal(false)}
          title="Email Already Registered"
          message="We already have a user associated with this email. Would you like to recover your password?"
          primaryButtonText="Recover"
          onPrimaryButtonPress={handleRecoverPassword}
          secondaryButtonText="Cancel"
          onSecondaryButtonPress={() => setShowEmailExistsModal(false)}
        />
      </Portal>

      <Portal>
        <CustomModal
          visible={showSuccessModal}
          onDismiss={handleSuccessModalDismiss}
          title="Registration Successful"
          message="Please check your email to verify your account."
          primaryButtonText="OK"
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
  scrollView: {
    flex: 1,
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
  section: {
    marginVertical: 24,
  },
  sectionTitle: {
    color: theme.colors.surface,
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    color: theme.colors.surface,
    flex: 1,
  },
  termsLink: {
    color: theme.colors.surface,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    padding: 12,
    paddingBottom: 40,
  },
  errorText: {
    marginTop: 4,
  },
}); 
