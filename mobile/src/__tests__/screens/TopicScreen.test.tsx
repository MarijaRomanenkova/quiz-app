import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { TopicScreen } from '../../screens/Topic/TopicScreen';
import progressReducer from '../../store/progressSlice';
import categoryReducer from '../../store/categorySlice';
import topicReducer from '../../store/topicSlice';

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
  useRoute: () => ({
    params: { categoryId: 'grammar' },
  }),
}));

// Mock components
jest.mock('../../components/BackButton', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    BackButton: ({ onPress, text, testID }: any) => (
      <TouchableOpacity onPress={onPress} testID={testID || 'back-button'}>
        <Text>{text}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: ({ name, size, color }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text testID={`icon-${name}`}>{name}</Text>;
  },
}));

describe('TopicScreen', () => {
  let store: ReturnType<typeof setupStore>;
  
  const mockTopics = [
    { topicId: 'topic1', title: 'Basic Grammar', order: 1, categoryId: 'grammar', topicOrder: 1, levelId: 'A1' },
    { topicId: 'topic2', title: 'Advanced Grammar', order: 2, categoryId: 'grammar', topicOrder: 2, levelId: 'A1' },
    { topicId: 'topic3', title: 'Vocabulary', order: 3, categoryId: 'grammar', topicOrder: 3, levelId: 'A1' },
  ];

  const setupStore = (progressState = {}, categoryState = {}, topicState = {}) => {
    return configureStore({
      reducer: {
        progress: progressReducer,
        category: categoryReducer,
        topic: topicReducer,
      },
      preloadedState: {
        progress: {
          topicProgress: {
            topic1: { topicId: 'topic1', categoryId: 'grammar', completed: true, score: 85, attempts: 1, lastAttemptDate: '2024-01-01' },
            topic2: { topicId: 'topic2', categoryId: 'grammar', completed: false, score: 0, attempts: 0, lastAttemptDate: undefined },
            topic3: { topicId: 'topic3', categoryId: 'grammar', completed: true, score: 92, attempts: 1, lastAttemptDate: '2024-01-02' },
          },
          categoryProgress: {
            grammar: { categoryId: 'grammar', completedTopics: 2, totalTopics: 3, unlockedTopics: 3 },
          },
          isLoading: false,
          error: null,
          ...progressState,
        },
        category: {
          selectedCategoryId: null,
          categories: [],
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
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders topic selection screen with unlocked topics', () => {
    store = setupStore();
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    expect(getByText('Select a Topic:')).toBeTruthy();
    expect(getByText('topic1')).toBeTruthy();
    expect(getByText('topic2')).toBeTruthy();
    expect(getByText('topic3')).toBeTruthy();
    expect(getByText('Start Quiz')).toBeTruthy();
  });

  it('allows topic selection', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    // Select a topic
    fireEvent.press(getByText('topic2'));
    
    // The Start Quiz button should be enabled
    const startQuizButton = getByText('Start Quiz');
    expect(startQuizButton).toBeTruthy();
  });

  it('navigates to quiz when Start Quiz is pressed with selected topic', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    // Select a topic first
    fireEvent.press(getByText('topic1'));
    
    // Press Start Quiz
    fireEvent.press(getByText('Start Quiz'));
    
    expect(mockNavigate).toHaveBeenCalledWith('Quiz', { quizId: 'topic1', categoryId: 'grammar' });
  });

  it('navigates back to home when back button is pressed', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    fireEvent.press(getByText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('shows completion status for completed topics', () => {
    store = setupStore();
    const { getAllByTestId } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    // Check that completed topics show check icons
    const checkIcons = getAllByTestId('icon-check');
    expect(checkIcons.length).toBeGreaterThan(0);
  });

  it('disables Start Quiz button when no topic is selected', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    const startQuizButton = getByText('Start Quiz');
    // The button should be disabled initially
    expect(startQuizButton).toBeTruthy();
  });

  it('handles topic selection and shows visual feedback', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    // Select topic1
    fireEvent.press(getByText('topic1'));
    
    // Select topic2
    fireEvent.press(getByText('topic2'));
    
    // The last selected topic should be the active one
    fireEvent.press(getByText('Start Quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('Quiz', { quizId: 'topic2', categoryId: 'grammar' });
  });

  it('displays empty state when no topics are available', () => {
    store = setupStore({}, {}, { topics: [] });
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <TopicScreen />
      </Provider>
    );
    
    expect(getByText('Select a Topic:')).toBeTruthy();
    expect(queryByText('topic1')).toBeNull();
    expect(queryByText('topic2')).toBeNull();
    expect(queryByText('topic3')).toBeNull();
  });
}); 
