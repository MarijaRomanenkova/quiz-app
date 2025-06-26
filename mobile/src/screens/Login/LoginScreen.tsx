import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Surface, ActivityIndicator, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { containerStyles, textStyles } from '../../styles/components.styles';
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
 * Onboarding Component
 * Handles user onboarding and profile creation
 * @component
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

  const handleRegister = () => {
    setShowRegisterModal(false);
    navigation.navigate('Register');
  };

  if (isLoading) {
    return (
      <Surface style={[styles.container, containerStyles.loading]}>
        <ActivityIndicator size="large" color="#8BF224" />
        <Text style={textStyles.loading}>Logging in...</Text>
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
          style={[styles.registerButton, { backgroundColor: '#EDE7FF' }]}
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
}); 
