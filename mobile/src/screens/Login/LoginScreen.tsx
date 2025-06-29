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
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Surface, ActivityIndicator, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from 'react-native';
import { TextInput } from 'react-native-paper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/**
 * Zod schema for login form validation
 * 
 * Defines validation rules for email and password fields:
 * - Email must be a valid email format
 * - Password must be at least 8 characters with specific requirements
 */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

type LoginFormData = z.infer<typeof loginSchema>;

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
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { login, isLoading, error } = useAuth();

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
      <Surface style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
        <Text style={styles.loadingText}>Logging in...</Text>
      </Surface>
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
                    onPress={() => setShowPassword(!showPassword)}
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
          style={[styles.registerButton]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
    padding: 0,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
    color: theme.colors.surface,
    textAlign: 'center',
    fontFamily: 'BalooBhaina2-Bold',
    fontSize: 42,
    fontWeight: 'bold',
  },
  title: {
    color: theme.colors.surface,
    textAlign: 'center',
    fontFamily: 'BalooBhaina2-Bold',
    fontSize: 28,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 16, // Adjust this value to fine-tune the vertical centering
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  registerButton: {
    marginTop: 12,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: theme.colors.surface,
    fontSize: 14,
  },
  recoverLink: {
    color: theme.colors.surface,
    fontSize: 14,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
}); 
