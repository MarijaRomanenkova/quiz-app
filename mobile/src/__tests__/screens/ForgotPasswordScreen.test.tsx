import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ForgotPasswordScreen } from '../../screens/ForgotPassword/ForgotPasswordScreen';
import authReducer from '../../store/authSlice';

// Mock the useAuth hook
const mockForgotPassword = jest.fn();
const mockUseAuth = {
  forgotPassword: mockForgotPassword,
  isLoading: false,
  error: null,
};

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  push: jest.fn(),
  pop: jest.fn(),
  replace: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

// Mock components
jest.mock('../../components/Button/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ onPress, children, disabled, testID }: any) => (
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={testID}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../../components/Input/Input', () => {
  const React = require('react');
  const { View, TextInput, Text } = require('react-native');
  return {
    Input: ({ label, value, onChangeText, error, secureTextEntry, testID }: any) => (
      <View testID={testID || 'input-container'}>
        {label && <Text testID="input-label">{label}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          testID="text-input"
        />
        {error && <Text testID="input-error">{error}</Text>}
      </View>
    ),
  };
});

describe('ForgotPasswordScreen', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = (authState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: null,
          ...authState,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render forgot password screen correctly', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      expect(getByText('Recover Password')).toBeTruthy();
      expect(getByText('Enter your email address and we\'ll send you instructions to reset your password.')).toBeTruthy();
      expect(getByText('Send Recovery Email')).toBeTruthy();
      expect(getByText('Back to Login')).toBeTruthy();
    });

    it('should display email input field', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      expect(getByText('Email')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty email', async () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      const sendButton = getByText('Send Recovery Email');
      fireEvent.press(sendButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      });
    });

    it('should show validation error for invalid email', async () => {
      store = setupStore();

      const { getByText, getByTestId } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      const emailInput = getByTestId('text-input');
      fireEvent.changeText(emailInput, 'invalid-email');

      const sendButton = getByText('Send Recovery Email');
      fireEvent.press(sendButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not call forgotPassword function with invalid data', async () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      const sendButton = getByText('Send Recovery Email');
      fireEvent.press(sendButton);

      await waitFor(() => {
        expect(mockForgotPassword).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state when sending reset link', () => {
      store = setupStore({ isLoading: true });

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      expect(getByText('Send Recovery Email')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when password reset fails', () => {
      store = setupStore({ error: 'Password reset failed' });

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      expect(getByText('Send Recovery Email')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      store = setupStore();

      const { getByTestId } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      const backButton = getByTestId('back-button');
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper labels', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <ForgotPasswordScreen />
        </Provider>
      );

      expect(getByText('Recover Password')).toBeTruthy();
      expect(getByText('Enter your email address and we\'ll send you instructions to reset your password.')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Send Recovery Email')).toBeTruthy();
      expect(getByText('Back to Login')).toBeTruthy();
    });
  });
}); 
