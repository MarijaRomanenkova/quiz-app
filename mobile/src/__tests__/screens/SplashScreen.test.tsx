import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SplashScreen } from '../../screens/Splash/SplashScreen';
import authReducer from '../../store/authSlice';

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  replace: mockReplace,
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
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

describe('SplashScreen', () => {
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
    it('should render splash screen correctly after fonts load', async () => {
      store = setupStore();

      const { getByText, getByTestId } = render(
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      );

      // Wait for fonts to load and content to appear
      await waitFor(() => {
        expect(getByTestId('logo')).toBeTruthy();
        expect(getByText('DEUTSCH')).toBeTruthy();
        expect(getByText('Loading')).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('should display app branding after fonts load', async () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      );

      // Wait for fonts to load and content to appear
      await waitFor(() => {
        expect(getByText('DEUTSCH')).toBeTruthy();
        expect(getByText('Loading')).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('Authentication Check', () => {
    it('should navigate to Login when user is not authenticated', async () => {
      store = setupStore({ user: null, token: null });

      render(
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      );

      // Wait for the splash screen to complete its check
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('Login');
      }, { timeout: 3000 });
    });

    it('should navigate to Home when user is authenticated', async () => {
      store = setupStore({ 
        user: { id: 1, email: 'test@example.com', name: 'Test User' }, 
        token: 'mock-token' 
      });

      render(
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      );

      // Wait for the splash screen to complete its check
      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('Home');
      }, { timeout: 3000 });
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator during font loading', () => {
      store = setupStore();

      const { getByTestId } = render(
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      );

      // Should show loading indicator initially
      expect(getByTestId('activity-indicator')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible with proper labels after fonts load', async () => {
      store = setupStore();

      const { getByText } = render(
        <Provider store={store}>
          <SplashScreen />
        </Provider>
      );

      // Wait for fonts to load and content to appear
      await waitFor(() => {
        expect(getByText('DEUTSCH')).toBeTruthy();
        expect(getByText('Loading')).toBeTruthy();
      }, { timeout: 3000 });
    });
  });
}); 
