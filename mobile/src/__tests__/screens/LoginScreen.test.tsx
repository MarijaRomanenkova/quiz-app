import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginScreen } from '../../screens/Login/LoginScreen';
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

// Mock themeUtils
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

// Mock LoadingWrapper
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
  Text: ({ children, style, ...props }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text style={style} {...props}>{children}</Text>;
  },
  Surface: ({ children, style, ...props }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return <View style={style} {...props}>{children}</View>;
  },
  TextInput: Object.assign(
    ({ label, value, onChangeText, error, secureTextEntry, right, testID, ...props }: any) => {
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
    {
      Icon: ({ icon, onPress }: { icon: string; onPress: () => void }) => {
        const React = require('react');
        const { TouchableOpacity, Text } = require('react-native');
        return (
          <TouchableOpacity onPress={onPress} testID="text-input-icon">
            <Text>{icon}</Text>
          </TouchableOpacity>
        );
      },
    }
  ),
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
  ActivityIndicator: ({ size, color, ...props }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View testID="activity-indicator" {...props}>
        <Text>Loading...</Text>
      </View>
    );
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

jest.mock('../../components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ onPress, children, disabled, testID, mode, variant }: any) => (
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={testID}>
        <Text>{children}</Text>
      </TouchableOpacity>
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
      const { getByText, getAllByTestId } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(getByText('Email')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Log In')).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
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
      const { getAllByTestId } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getAllByTestId('text-input')[0];
      fireEvent.changeText(emailInput, 'test@example.com');
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should handle password input changes', () => {
      store = setupStore();
      const { getAllByTestId } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const passwordInput = getAllByTestId('text-input')[1];
      fireEvent.changeText(passwordInput, 'password123');
      expect(passwordInput.props.value).toBe('password123');
    });
  });

  describe('Authentication', () => {
    it('should call login function with valid credentials', async () => {
      store = setupStore();
      mockLogin.mockResolvedValue(true);
      const { getAllByTestId, findByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getAllByTestId('text-input')[0];
      const passwordInput = getAllByTestId('text-input')[1];
      await waitFor(() => fireEvent.changeText(emailInput, 'test@example.com'));
      await waitFor(() => fireEvent.changeText(passwordInput, 'Password123!'));
      const loginButton = await findByText('Log In');
      await waitFor(() => fireEvent.press(loginButton));
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123!');
      });
    });

    it('should navigate to Home on successful login', async () => {
      store = setupStore();
      mockLogin.mockResolvedValue(true);
      const { getAllByTestId, findByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getAllByTestId('text-input')[0];
      const passwordInput = getAllByTestId('text-input')[1];
      await waitFor(() => fireEvent.changeText(emailInput, 'test@example.com'));
      await waitFor(() => fireEvent.changeText(passwordInput, 'Password123!'));
      const loginButton = await findByText('Log In');
      await waitFor(() => fireEvent.press(loginButton));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('Home');
      });
    });

    it('should handle authentication errors', async () => {
      store = setupStore();
      mockLogin.mockRejectedValue(new Error('Network error'));
      const { getAllByTestId, findByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      const emailInput = getAllByTestId('text-input')[0];
      const passwordInput = getAllByTestId('text-input')[1];
      await waitFor(() => fireEvent.changeText(emailInput, 'test@example.com'));
      await waitFor(() => fireEvent.changeText(passwordInput, 'Password123!'));
      const loginButton = await findByText('Log In');
      await waitFor(() => fireEvent.press(loginButton));
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123!');
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
      mockUseAuth.isLoading = false;
      store = setupStore();
      const { queryByText, getByText } = render(
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );

      expect(queryByText('Logging in...')).toBeNull();
      expect(getByText('Log In')).toBeTruthy();
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

      const registerButton = getByText('Register');
      fireEvent.press(registerButton);
      expect(mockNavigate).toHaveBeenCalledWith('Register');
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
      expect(getByText('Log In')).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
    });
  });
}); 
