import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginScreen } from '../../screens/Login/LoginScreen';
import authReducer from '../../store/authSlice';

// Mock the useAuth hook
const mockLogin = jest.fn();
const mockUseAuth = {
  login: mockLogin,
  isLoading: false,
  error: null,
};

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock react-native-paper components
jest.mock('react-native-paper', () => ({
  TextInput: ({ label, value, onChangeText, error, secureTextEntry, right, testID, ...props }: any) => {
    const React = require('react');
    const { View, TextInput, Text } = require('react-native');
    return (
      <View testID={testID || 'text-input-container'}>
        {label && <Text testID="text-input-label">{label}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          testID="text-input"
          {...props}
        />
        {right && <View testID="text-input-right">{right}</View>}
        {error && <Text testID="text-input-error">{error}</Text>}
      </View>
    );
  },
  Button: ({ onPress, children, disabled, testID, mode }: any) => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={testID}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
  Portal: ({ children }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return <View testID="portal">{children}</View>;
  },
  Modal: ({ visible, children, onDismiss }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return visible ? (
      <View testID="modal">
        <Text>{children}</Text>
      </View>
    ) : null;
  },
}));

// Mock components
jest.mock('../../components/Logo', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Logo: ({ width, height }: any) => (
      <View testID="logo">
        <Text>Logo {width}x{height}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/Modal/CustomModal', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    CustomModal: ({ visible, children, onPrimaryButtonPress, onSecondaryButtonPress }: any) => (
      visible ? (
        <View testID="custom-modal">
          <Text>{children}</Text>
          <TouchableOpacity onPress={onPrimaryButtonPress} testID="modal-primary-button">
            <Text>Primary</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSecondaryButtonPress} testID="modal-secondary-button">
            <Text>Secondary</Text>
          </TouchableOpacity>
        </View>
      ) : null
    ),
  };
});

describe('LoginScreen', () => {
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
    mockUseAuth.isLoading = false;
    mockUseAuth.error = null;
  });

  describe('Rendering', () => {
    it('should render login form correctly', () => {
      store = setupStore();

      const { getByText, getByTestId } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(getByText('DEUTSCH')).toBeTruthy();
      expect(getByText('Learn on the go')).toBeTruthy();
      expect(getByTestId('logo')).toBeTruthy();
      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
      expect(getByText('Create Account')).toBeTruthy();
    });

    it('should render forgot password link', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(getByText('Forgot your password?')).toBeTruthy();
      expect(getByText('Recover')).toBeTruthy();
    });
  });

  describe('Form Interaction', () => {
    it('should handle email input changes', () => {
      store = setupStore();

      const { getByTestId } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getByTestId('text-input');
      fireEvent.changeText(emailInput, 'test@example.com');
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should handle password input changes', () => {
      store = setupStore();

      const { getByTestId } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const passwordInput = getByTestId('text-input');
      fireEvent.changeText(passwordInput, 'password123');
      expect(passwordInput.props.value).toBe('password123');
    });
  });

  describe('Authentication', () => {
    it('should call login function with valid credentials', async () => {
      store = setupStore();
      mockLogin.mockResolvedValue(true);

      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getByTestId('text-input');
      const passwordInput = getByTestId('text-input');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const loginButton = getByText('Login');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123!');
      });
    });

    it('should navigate to Home on successful login', async () => {
      store = setupStore();
      mockLogin.mockResolvedValue(true);

      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getByTestId('text-input');
      const passwordInput = getByTestId('text-input');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const loginButton = getByText('Login');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Home');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during authentication', () => {
      store = setupStore();
      mockUseAuth.isLoading = true;

      const { getByText, queryByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(getByText('Logging in...')).toBeTruthy();
      expect(queryByText('Login')).toBeNull();
    });

    it('should not show loading state when not authenticating', () => {
      store = setupStore();
      mockUseAuth.isLoading = false;

      const { queryByText, getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(queryByText('Logging in...')).toBeNull();
      expect(getByText('Login')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to ForgotPassword when recover link is pressed', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const recoverLink = getByText('Recover');
      fireEvent.press(recoverLink);

      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });

    it('should navigate to Register when create account is pressed', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const createAccountButton = getByText('Create Account');
      fireEvent.press(createAccountButton);

      expect(mockNavigate).toHaveBeenCalledWith('Register');
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      store = setupStore();
      mockLogin.mockRejectedValue(new Error('Network error'));

      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getByTestId('text-input');
      const passwordInput = getByTestId('text-input');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const loginButton = getByText('Login');
      fireEvent.press(loginButton);

      // Should not crash and should handle error gracefully
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper labels', () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
      expect(getByText('Create Account')).toBeTruthy();
    });
  });
}); 
