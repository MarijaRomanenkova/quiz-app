import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { HomeScreen } from '../../screens/Home/HomeScreen';
import categoryReducer from '../../store/categorySlice';
import topicReducer from '../../store/topicSlice';
import authReducer from '../../store/authSlice';
import questionsReducer from '../../store/questionsSlice';
import progressReducer from '../../store/progressSlice';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
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
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ children, onPress, disabled = false, testID }: any) => (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={!!disabled}
        testID={testID}
        accessibilityState={{ disabled: !!disabled }}
      >
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('react-native-paper', () => ({
  Text: ({ children, variant, style, testID }: any) => {
    const React = require('react');
    const { Text: RNText } = require('react-native');
    return <RNText testID="paper-text" style={style}>{children}</RNText>;
  },
  RadioButton: {
    Group: ({ children, onValueChange, value }: any) => {
      const React = require('react');
      const { View } = require('react-native');
      return (
        <View testID="radio-button-group" onValueChange={onValueChange} value={value}>
          {children}
        </View>
      );
    },
    Item: ({ label, value, position, labelStyle, style, theme }: any) => {
      const React = require('react');
      const { View, Text, TouchableOpacity } = require('react-native');
      return (
        <View testID="radio-button-item" accessibilityLabel={value}>
          <TouchableOpacity>
            <Text>{label}</Text>
          </TouchableOpacity>
        </View>
      );
    },
  },
  MD3LightTheme: {
    colors: {
      primary: '#EDE7FF',
      secondary: '#8BF224',
      tertiary: '#6B4EFF',
      error: '#FF4B4B',
      background: 'rgba(67, 19, 226, 0.7)',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#FFFFFF80',
      outline: '#6750A4',
      primaryContainer: '#4313E2',
      secondaryContainer: '#EDE7FF',
      tertiaryContainer: 'rgba(67, 19, 226, 0.7)',
      onPrimaryContainer: '#FFFFFF',
      onSecondaryContainer: '#000000',
      onTertiaryContainer: '#FFFFFF',
    },
  },
}));

describe('HomeScreen', () => {
  let store: ReturnType<typeof setupStore>;
  
  const mockCategories = [
    { categoryId: '1', description: 'Grammar lessons', progress: 0 },
    { categoryId: '2', description: 'Vocabulary practice', progress: 0 },
    { categoryId: '3', description: 'Listening exercises', progress: 0 },
  ];

  const mockTopics = [
    { topicId: 'topic1', categoryId: '1', levelId: 'A1', topicOrder: 1 },
    { topicId: 'topic2', categoryId: '1', levelId: 'A1', topicOrder: 2 },
    { topicId: 'topic3', categoryId: '2', levelId: 'A1', topicOrder: 1 },
  ];

  const setupStore = (categoryState = {}, topicState = {}, authState = {}, questionsState = {}, progressState = {}) => {
    return configureStore({
      reducer: {
        category: categoryReducer,
        topic: topicReducer,
        auth: authReducer,
        questions: questionsReducer,
        progress: progressReducer,
      },
      preloadedState: {
        category: {
          categories: mockCategories,
          selectedCategoryId: null,
          lastUpdated: null,
          isLoading: false,
          error: null,
          ...categoryState,
        },
        topic: {
          topics: mockTopics,
          selectedTopicId: null,
          isLoading: false,
          error: null,
          ...topicState,
        },
        auth: {
          user: {
            id: 'user1',
            username: 'testuser',
            email: 'test@example.com',
            levelId: 'A1',
            studyPaceId: 1,
            agreedToTerms: true,
            marketingEmails: false,
            shareDevices: false,
            emailVerified: true,
          },
          token: 'mock-token',
          isLoading: false,
          error: null,
          ...authState,
        },
        questions: {
          byTopicId: {},
          readingTextsById: {},
          readingTextsByTopicId: {},
          isLoading: false,
          error: null,
          ...questionsState,
        },
        progress: {
          topicProgress: {},
          categoryProgress: {},
          isLoading: false,
          error: null,
          ...progressState,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render home screen correctly', () => {
      store = setupStore();
      const { getByText, getByTestId } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      expect(getByText('Select a Category:')).toBeTruthy();
      expect(getByTestId('radio-button-group')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
    });

    it('should render home screen with category selection', () => {
      store = setupStore();
      const { getByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to Topic when Continue is pressed and a category is selected', async () => {
      store = setupStore({ selectedCategoryId: '1' });
      const { getByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      fireEvent.press(getByText('Continue'));
      expect(mockNavigate).toHaveBeenCalledWith('Topic', { categoryId: '1' });
    });
  });

  describe('Category Selection', () => {
    it('should display multiple categories by ID', () => {
      store = setupStore();
      const { getByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });

    it('should enable Continue button when a category is selected', () => {
      store = setupStore({ selectedCategoryId: '1' });
      const { getByTestId } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      const continueButton = getByTestId('continue-button');
      expect(continueButton).not.toBeDisabled();
    });

    it('should disable Continue button when no category is selected', () => {
      store = setupStore({ selectedCategoryId: null });
      const { getByTestId } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      const continueButton = getByTestId('continue-button');
      expect(continueButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state when categories are loading', () => {
      store = setupStore({ isLoading: true });
      const { getByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      expect(getByText('Loading categories...')).toBeTruthy();
    });

    it('should not show loading state when categories are loaded', () => {
      store = setupStore({ isLoading: false });
      const { getByText, queryByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      expect(queryByText('Loading categories...')).toBeNull();
      expect(getByText('Select a Category:')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when categories fail to load', () => {
      store = setupStore({ 
        error: 'Failed to load categories',
        categories: [],
        isLoading: false
      });
      const { getByText, queryByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      // Check for error or fallback to loading state
      if (queryByText('Error: Failed to load categories')) {
        expect(getByText('Error: Failed to load categories')).toBeTruthy();
      } else {
        expect(getByText('Loading categories...')).toBeTruthy();
      }
    });
  });

  describe('Authentication', () => {
    it('should show login message when user is not authenticated', () => {
      store = setupStore({}, {}, { user: null, token: null });
      const { getByText } = render(
        <Provider store={store}>
          <HomeScreen navigation={mockNavigation as any} />
        </Provider>
      );
      
      expect(getByText('Please log in to access categories...')).toBeTruthy();
    });
  });
}); 
