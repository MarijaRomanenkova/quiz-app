import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Surface, IconButton, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '../../config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send recovery email');
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Password recovery error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalDismiss = () => {
    setShowSuccessModal(false);
    navigation.navigate('Login');
  };

  return (
    <Surface style={styles.container}>
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
            variant="primary"
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
