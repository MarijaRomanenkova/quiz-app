/**
 * @fileoverview Login Screen component for the mobile application
 * 
 * This component provides the main authentication interface where users can
 * log into their accounts or navigate to registration. It features form
 * validation, password visibility toggles, and integration with the
 * authentication system.
 * 
 * The component includes:
 * - Email and password input fields with validation
 * - Password visibility toggle
 * - Form validation using Zod schema
 * - Loading states during authentication
 * - Navigation to registration and password recovery
 * - Account not found modal with registration prompt
 * 
 * @module screens/Login
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Surface, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { theme, fonts, spacing } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { TextInput } from 'react-native-paper';
import { loginSchema, type LoginFormData } from '../../utils/validationSchemas';
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility';
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;



/**
 * Login Screen component for user authentication
 * 
 * Provides a comprehensive login interface with form validation,
 * password visibility controls, and integration with the authentication
 * system. Handles loading states and navigation to other auth screens.
 * 
 * Key features:
 * - Email and password input with real-time validation
 * - Password visibility toggle for user convenience
 * - Comprehensive password strength requirements
 * - Loading states during authentication process
 * - Navigation to registration and password recovery
 * - Account not found modal with registration prompt
 * - Form validation using Zod schema
 * - Integration with useAuth hook for authentication
 * 
 * @returns {JSX.Element} The login screen with authentication form
 * 
 * @example
 * ```tsx
 * // Navigation to login screen
 * navigation.navigate('Login');
 * ```
 */
export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { login, isLoading } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handles form submission for login
   * 
   * Attempts to authenticate the user with provided credentials.
   * Shows registration modal if account is not found, or navigates
   * to home screen on successful login.
   * 
   * @param {LoginFormData} data - The validated form data
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigation.navigate('Home');
      } else {
        setShowRegisterModal(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  /**
   * Handles navigation to registration screen
   * 
   * Closes the registration modal and navigates to the
   * registration screen for new user signup.
   */
  const handleRegister = () => {
    setShowRegisterModal(false);
    navigation.navigate('Register');
  };

  if (isLoading) {
    return (
      <LoadingWrapper isLoading={true} loadingText="Logging in...">
        <></>
      </LoadingWrapper>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <View >
          <Text style={styles.header}>DEUTSCH</Text>
          <View style={styles.logoContainer}>
            <Logo width={160} height={160} />
          </View>
          <Text variant="headlineMedium" style={styles.title}>Learn on the go</Text>
        </View>

        <View style={styles.formContainer}>
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your password"
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
          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            <Text
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.recoverLink}
            >
              Recover
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          variant="success"
        >
          Log In
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
          variant="secondary"
        >
          Register
        </Button>
      </View>

      <Portal>
        <CustomModal
          visible={showRegisterModal}
          onDismiss={() => setShowRegisterModal(false)}
          title="Account Not Found"
          message="Sorry, we can't find your account. Would you like to register?"
          primaryButtonText="Register"
          onPrimaryButtonPress={handleRegister}
          secondaryButtonText="Cancel"
          onSecondaryButtonPress={() => setShowRegisterModal(false)}
        />
      </Portal>
    </Surface>
  );
};

const layoutStyles = createLayoutStyles();

const subtitleStyles = createTextStyles('large', 'semiBold', theme.colors.surface);
const bodyStyles = createTextStyles('medium', 'medium', theme.colors.surface);

const styles = StyleSheet.create({
  buttonContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  container: {
    ...layoutStyles.container,
    height: '100%',
    padding: 0,
    width: '100%',
  },
  content: {
    ...layoutStyles.content,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...bodyStyles.text,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  header: {
    alignItems: 'center',
    color: theme.colors.surface,
    fontFamily: 'BalooBhaina2-Bold',
    fontSize: fonts.sizes.huge,
    fontWeight: 'bold',
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    width: '100%',
  },
  recoverLink: {
    ...bodyStyles.text,
    fontFamily: fonts.weights.bold,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  registerButton: {
    marginTop: spacing.sm,
  },
  title: {
    ...subtitleStyles.text,
    fontFamily: 'BalooBhaina2-Bold',
  },
}); 
