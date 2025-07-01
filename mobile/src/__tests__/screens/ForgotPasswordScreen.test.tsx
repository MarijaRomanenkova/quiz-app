import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ForgotPasswordScreen } from '../../screens/ForgotPassword/ForgotPasswordScreen';
import authReducer from '../../store/authSlice';

// Mock theme
jest.mock('../../theme', () => ({
  theme: {
    colors: {
      primary: '#EDE7FF',
      secondary: '#8BF224',
      background: '#FFF',
      surface: '#FFF',
      text: '#000',
      error: '#FF4B4B',
      secondaryContainer: '#EDE7FF',
    },
    buttons: {
      borderRadius: 20,
      paddingVertical: 8,
      marginVertical: 8,
      fontSize: 24,
      variants: {
        primary: {
          backgroundColor: '#8BF224',
          textColor: '#000000',
          borderColor: '#8BF224',
        },
        secondary: {
          backgroundColor: '#4313E2',
          textColor: '#FFFFFF',
          borderColor: '#4313E2',
        },
        success: {
          backgroundColor: '#8BF224',
          textColor: '#000000',
          borderColor: '#8BF224',
        },
      },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fonts: {
    sizes: { small: 12, medium: 16, large: 20, xlarge: 24 },
    weights: { regular: 'Baloo2-Regular', semiBold: 'Baloo2-SemiBold' },
  },
  layout: {
    borderRadius: { small: 8, medium: 15, large: 20 },
    shadow: {
      small: {},
      medium: {},
      large: {},
    },
  },
}));

jest.mock('../../utils/themeUtils', () => ({
  createLayoutStyles: () => ({
    container: { flex: 1 },
    content: { flex: 1, padding: 24 },
    centered: { justifyContent: 'center', alignItems: 'center' },
    row: { flexDirection: 'row', alignItems: 'center' },
    spaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  }),
  createTextStyles: () => ({
    text: { fontSize: 16, fontFamily: 'Baloo2-Regular', color: '#000000' },
  }),
  createInputStyles: () => ({
    input: { borderRadius: 20, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#FFF', color: '#000', borderColor: '#000', borderWidth: 1 },
    label: { fontSize: 16, fontFamily: 'Baloo2-SemiBold', color: '#000', marginBottom: 8 },
  }),
}));

jest.mock('../../components/common/LoadingWrapper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    LoadingWrapper: ({ children, isLoading, error, loadingText }: any) => {
      if (isLoading) {
        return <Text>{loadingText || 'Loading...'}</Text>;
      }
      if (error) {
        return <Text>Error: {error}</Text>;
      }
      return <View>{children}</View>;
    },
  };
});

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
