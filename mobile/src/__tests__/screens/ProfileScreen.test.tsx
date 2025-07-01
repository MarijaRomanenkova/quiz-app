import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProfileScreen } from '../../screens/Profile/ProfileScreen';
import authReducer from '../../store/authSlice';
import userReducer from '../../store/userSlice';

// Mock useAuth hook
const mockLogout = jest.fn();
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

// Mock API service
jest.mock('../../services/api', () => ({
  deleteUserAccount: jest.fn().mockResolvedValue({ message: 'Account deleted' }),
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
jest.mock('../../components/BackButton', () => {
  const React = require('react');
  const { TouchableOpacity } = require('react-native');
  return {
    BackButton: ({ onPress, testID }: any) => (
      <TouchableOpacity onPress={onPress} testID={testID || 'back-button'} />
    ),
  };
});

jest.mock('../../components/StudyPaceSelector/StudyPaceSelector', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    StudyPaceSelector: ({ currentPaceId, onPaceChange }: any) => (
      <View testID="study-pace-selector">
        {[1, 2, 3].map((id) => (
          <TouchableOpacity key={id} onPress={() => onPaceChange(id)} testID={`pace-${id}`}> 
            <Text>Pace {id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});

jest.mock('../../components/Modal/CustomModal', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    CustomModal: ({ visible, onPrimaryButtonPress, onSecondaryButtonPress, title, message }: any) => (
      visible ? (
        <View testID="custom-modal">
          <Text>{title}</Text>
          <Text>{message}</Text>
          <TouchableOpacity onPress={onPrimaryButtonPress} testID="modal-cancel">
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSecondaryButtonPress} testID="modal-delete">
            <Text>Delete Account</Text>
          </TouchableOpacity>
        </View>
      ) : null
    ),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ...jest.requireActual('react-native-paper'),
    Switch: ({ value, onValueChange, testID, ...props }: any) => (
      <TouchableOpacity
        onPress={() => onValueChange(false)}
        testID={testID}
        accessibilityRole="switch"
        {...props}
      >
        <Text>{value ? 'On' : 'Off'}</Text>
      </TouchableOpacity>
    ),
  };
});

describe('ProfileScreen', () => {
  let store: ReturnType<typeof setupStore>;
  const user = {
    id: 'user_1',
    email: 'test@example.com',
    username: 'testuser',
    levelId: 'A1',
    studyPaceId: 1,
    agreedToTerms: true,
    marketingEmails: false,
    shareDevices: false,
    emailVerified: true,
  };

  const setupStore = (authState = {}, userState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        user: userReducer,
      },
      preloadedState: {
        auth: {
          user,
          token: 'mock-token',
          isLoading: false,
          error: null,
          ...authState,
        },
        user: {
          user,
          loading: false,
          error: null,
          ...userState,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user info and settings', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('Email:')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('Level:')).toBeTruthy();
    expect(getByText('A1')).toBeTruthy();
    expect(getByText('Pace 1')).toBeTruthy();
  });

  it('changes study pace', () => {
    store = setupStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByTestId('pace-2'));
    // No assertion here, but you could check Redux state if needed
  });

  it('toggles marketing emails', () => {
    store = setupStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByTestId('marketing-switch'));
  });

  it('shows and cancels terms modal', async () => {
    store = setupStore({ user: { ...user, agreedToTerms: true } });
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByTestId('terms-switch'));
    await waitFor(() => {
      expect(getByTestId('custom-modal')).toBeTruthy();
    });
    fireEvent.press(getByTestId('modal-cancel'));
    await waitFor(() => {
      expect(queryByTestId('custom-modal')).toBeNull();
    });
  });

  it('confirms terms modal and logs out', async () => {
    store = setupStore({ user: { ...user, agreedToTerms: true } });
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByTestId('terms-switch'));
    await waitFor(() => {
      expect(getByTestId('custom-modal')).toBeTruthy();
    });
    fireEvent.press(getByTestId('modal-delete'));
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('navigates to terms screen', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByText('Terms and Conditions'));
    expect(mockNavigate).toHaveBeenCalledWith('Terms');
  });

  it('logs out', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByText('Log Out'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('navigates back', () => {
    store = setupStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    fireEvent.press(getByTestId('back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows error if user is missing', () => {
    store = setupStore({ user: null });
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );
    expect(getByText('User not found')).toBeTruthy();
  });
}); 
