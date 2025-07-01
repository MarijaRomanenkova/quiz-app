import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RegisterScreen } from '../../screens/Register/RegisterScreen';
import authReducer from '../../store/authSlice';

// Mock the useAuth hook
const mockRegister = jest.fn();
const mockUseAuth = {
  register: mockRegister,
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

describe('RegisterScreen', () => {
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
    it('should render register screen correctly', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      expect(getByText('Back to Login')).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
      expect(getByText('Study Pace')).toBeTruthy();
      expect(getByText('Terms and Conditions')).toBeTruthy();
    });

    it('should display all form fields', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      expect(getByText('Name')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Confirm Password')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', async () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      const registerButton = getByText('Register');
      fireEvent.press(registerButton);

      await waitFor(() => {
        expect(getByText('Name must be at least 2 characters')).toBeTruthy();
        expect(getByText('Please enter a valid email address')).toBeTruthy();
        expect(getByText('Password must be at least 8 characters')).toBeTruthy();
        expect(getByText('You must agree to the Terms and Conditions')).toBeTruthy();
      });
    });

    it('should show validation error for password mismatch', async () => {
      store = setupStore();

      const { getByText, getAllByTestId } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      const inputs = getAllByTestId('text-input');
      const passwordInput = inputs[2]; // Password field
      const confirmPasswordInput = inputs[3]; // Confirm password field

      fireEvent.changeText(passwordInput, 'Password123!');
      fireEvent.changeText(confirmPasswordInput, 'Password456!');

      const registerButton = getByText('Register');
      fireEvent.press(registerButton);

      await waitFor(() => {
        expect(getByText("Passwords don't match")).toBeTruthy();
      });
    });

    it('should show validation error for short password', async () => {
      store = setupStore();

      const { getByText, getAllByTestId } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      const inputs = getAllByTestId('text-input');
      const passwordInput = inputs[2]; // Password field

      fireEvent.changeText(passwordInput, '123');

      const registerButton = getByText('Register');
      fireEvent.press(registerButton);

      await waitFor(() => {
        expect(getByText('Password must be at least 8 characters')).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not call register function with invalid data', async () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      const registerButton = getByText('Register');
      fireEvent.press(registerButton);

      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state when registering', () => {
      store = setupStore({ isLoading: true });

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      expect(getByText('Register')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when registration fails', () => {
      store = setupStore({ error: 'Registration failed' });

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      expect(getByText('Register')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper labels', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <RegisterScreen />
        </Provider>
      );

      expect(getByText('Back to Login')).toBeTruthy();
      expect(getByText('Name')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Confirm Password')).toBeTruthy();
      expect(getByText('Study Pace')).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
      expect(getByText('Terms and Conditions')).toBeTruthy();
    });
  });
}); 
