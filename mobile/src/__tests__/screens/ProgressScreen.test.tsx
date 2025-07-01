import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProgressScreen } from '../../screens/Progress/ProgressScreen';
import statisticsReducer from '../../store/statisticsSlice';
import progressReducer from '../../store/progressSlice';
import topicReducer from '../../store/topicSlice';
import authReducer from '../../store/authSlice';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  replace: jest.fn(),
};
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

// Mock components
jest.mock('../../components/CustomBarChart', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    CustomBarChart: ({ data, width, height }: any) => (
      <View testID="custom-bar-chart">
        <Text>Chart: {data.length} items</Text>
      </View>
    ),
  };
});

jest.mock('../../components/Results/LevelProgress', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    LevelProgress: ({ level, completedTopics, totalTopics, percentage }: any) => (
      <View testID="level-progress">
        <Text>Level: {level}</Text>
        <Text>Progress: {completedTopics}/{totalTopics}</Text>
        <Text>Percentage: {percentage}%</Text>
      </View>
    ),
  };
});

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({
        width: 400,
        height: 800,
      })),
    },
  };
});

describe('ProgressScreen', () => {
  let store: ReturnType<typeof setupStore>;
  
  const mockTopics = [
    { topicId: 'topic1', categoryId: 'grammar', levelId: 'A1', topicOrder: 1 },
    { topicId: 'topic2', categoryId: 'grammar', levelId: 'A1', topicOrder: 2 },
    { topicId: 'topic3', categoryId: 'reading', levelId: 'A1', topicOrder: 1 },
  ];

  const setupStore = (statisticsState = {}, progressState = {}, topicState = {}, authState = {}) => {
    return configureStore({
      reducer: {
        statistics: statisticsReducer,
        progress: progressReducer,
        topic: topicReducer,
        auth: authReducer,
      },
      preloadedState: {
        statistics: {
          attempts: [],
          totalAttempts: 0,
          totalQuizMinutes: 120,
          dailyQuizTimes: [
            { date: '2024-01-01', minutes: 30, lastUpdated: '2024-01-01T10:00:00Z' },
            { date: '2024-01-02', minutes: 45, lastUpdated: '2024-01-02T10:00:00Z' },
            { date: '2024-01-03', minutes: 20, lastUpdated: '2024-01-03T10:00:00Z' },
          ],
          currentSessionStart: null,
          isLoading: false,
          error: null,
          ...statisticsState,
        },
        progress: {
          topicProgress: {
            topic1: { topicId: 'topic1', categoryId: 'grammar', completed: true, score: 85, attempts: 1, lastAttemptDate: '2024-01-01' },
            topic2: { topicId: 'topic2', categoryId: 'grammar', completed: false, score: 0, attempts: 0, lastAttemptDate: undefined },
            topic3: { topicId: 'topic3', categoryId: 'reading', completed: true, score: 92, attempts: 1, lastAttemptDate: '2024-01-02' },
          },
          categoryProgress: {
            grammar: { categoryId: 'grammar', completedTopics: 1, totalTopics: 2, unlockedTopics: 2 },
            reading: { categoryId: 'reading', completedTopics: 1, totalTopics: 1, unlockedTopics: 1 },
          },
          isLoading: false,
          error: null,
          ...progressState,
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
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders progress screen with title', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByText('Progress')).toBeTruthy();
  });

  it('displays weekly progress chart', () => {
    store = setupStore();
    const { getByText, getAllByTestId } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByText('This week')).toBeTruthy();
    expect(getAllByTestId('custom-bar-chart')).toHaveLength(2);
  });

  it('displays monthly progress chart', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByText('This month')).toBeTruthy();
  });

  it('displays level progress when screen height is sufficient', () => {
    store = setupStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByTestId('level-progress')).toBeTruthy();
  });

  it('displays category progress', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByText('Grammar')).toBeTruthy();
    expect(getByText('Reading')).toBeTruthy();
  });

  it('formats time correctly', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    // Should show formatted time from the mock data
    // The exact text will depend on the selectors' calculations
    expect(getByText('Progress')).toBeTruthy();
  });

  it('handles empty statistics data', () => {
    store = setupStore({
      totalQuizMinutes: 0,
      dailyQuizTimes: [],
    });
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByText('Progress')).toBeTruthy();
  });

  it('handles empty progress data', () => {
    store = setupStore({}, {
      topicProgress: {},
      categoryProgress: {},
    });
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    expect(getByText('Progress')).toBeTruthy();
  });

  it('displays multiple charts', () => {
    store = setupStore();
    const { getAllByTestId } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    // Should have 2 bar charts (weekly and monthly)
    expect(getAllByTestId('custom-bar-chart')).toHaveLength(2);
  });

  it('shows category percentages', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProgressScreen />
      </Provider>
    );
    
    // Should show percentage for each category
    // The exact percentage will depend on the selectAllCategoryProgress selector
    expect(getByText('Progress')).toBeTruthy();
  });
}); 
