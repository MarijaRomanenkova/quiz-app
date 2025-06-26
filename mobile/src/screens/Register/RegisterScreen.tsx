import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Surface, IconButton, Switch, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { theme } from '../../theme';
import { StudyPaceSelector } from '../../components/StudyPaceSelector/StudyPaceSelector';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '../../services/authService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Conditions',
  }),
  studyPaceId: z.number().min(1, 'Please select a study pace'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEmailExistsModal, setShowEmailExistsModal] = useState(false);

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

  const handleTermsPress = () => {
    navigation.navigate('Terms');
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Registration attempt with data:', {
      email: data.email,
      name: data.name,
      studyPaceId: data.studyPaceId,
      agreedToTerms: data.agreedToTerms,
    });
    
    try {
      console.log('Making API call to register user...');
      await authService.register({
        email: data.email,
        username: data.name,
        password: data.password,
        studyPaceId: data.studyPaceId,
        agreedToTerms: data.agreedToTerms,
      });

      setShowSuccessModal(true);
    } catch (error: unknown) {
      console.error('Registration error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        email: data.email,
        timestamp: new Date().toISOString(),
      });
      
      if (error instanceof Error && error.message === 'User with this email already exists') {
        setShowEmailExistsModal(true);
        return;
      }
      
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRecoverPassword = () => {
    setShowEmailExistsModal(false);
    navigation.navigate('ForgotPassword');
  };

  const handleSuccessModalDismiss = () => {
    setShowSuccessModal(false);
    navigation.navigate('Login');
  };

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            iconColor={theme.colors.surface}
            size={24}
            onPress={() => navigation.goBack()}
          />
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
                      onPress={() => setShowPassword(!showPassword)}
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
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
            variant="primary"
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
