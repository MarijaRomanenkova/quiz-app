import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ResultsScreen } from '../../screens/Results/ResultsScreen';
import progressReducer from '../../store/progressSlice';
import topicReducer from '../../store/topicSlice';
import userReducer from '../../store/userSlice';
import { quizSlice } from '../../store/quizSlice';

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
    params: { quizId: 'grammar-quiz' },
  }),
}));

// Mock components
jest.mock('../../components/Results/ScoreCircle', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ScoreCircle: ({ score, total }: any) => (
      <View testID="score-circle">
        <Text>Score: {score}/{total}</Text>
      </View>
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

describe('ResultsScreen', () => {
  let store: ReturnType<typeof setupStore>;
  
  const mockTopics = [
    { topicId: 'topic1', categoryId: 'grammar', levelId: 'A1', topicOrder: 1 },
    { topicId: 'topic2', categoryId: 'grammar', levelId: 'A1', topicOrder: 2 },
    { topicId: 'topic3', categoryId: 'grammar', levelId: 'A1', topicOrder: 3 },
  ];

  const setupStore = (quizState = {}, progressState = {}, userState = {}, topicState = {}) => {
    return configureStore({
      reducer: {
        quiz: quizSlice.reducer,
        progress: progressReducer,
        user: userReducer,
        topic: topicReducer,
      },
      preloadedState: {
        quiz: {
          currentTopicId: null,
          currentResult: {
            score: 8,
            totalQuestions: 10,
            timeSpent: 5,
            quizId: 'grammar-quiz',
          },
          wrongQuestions: [
            { 
              id: '1', 
              questionId: 'q1',
              questionText: 'Wrong question 1',
              topicId: 'topic1',
              categoryId: 'grammar', 
              correctAnswerId: 'a1',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
            { 
              id: '2', 
              questionId: 'q2',
              questionText: 'Wrong question 2',
              topicId: 'topic1',
              categoryId: 'grammar', 
              correctAnswerId: 'a2',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z'
            },
          ],
          dailyStats: [],
          activeQuiz: null,
          ...quizState,
        },
        progress: {
          topicProgress: {
            topic1: { topicId: 'topic1', categoryId: 'grammar', completed: true, score: 85, attempts: 1, lastAttemptDate: '2024-01-01' },
            topic2: { topicId: 'topic2', categoryId: 'grammar', completed: true, score: 92, attempts: 1, lastAttemptDate: '2024-01-02' },
          },
          categoryProgress: {
            grammar: { categoryId: 'grammar', completedTopics: 2, totalTopics: 3, unlockedTopics: 3 },
          },
          isLoading: false,
          error: null,
          ...progressState,
        },
        user: {
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
          loading: false,
          error: null,
          ...userState,
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

  it('renders results screen with score and congratulations', () => {
    store = setupStore();
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    expect(getByText('Congrats!')).toBeTruthy();
    expect(getByText('Great job, testuser!')).toBeTruthy();
    expect(getByTestId('score-circle')).toBeTruthy();
  });



  it('shows wrong questions training option when there are wrong questions', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    expect(getByText('Would you like to train harder questions?')).toBeTruthy();
    expect(getByText('Repeat Wrong Questions')).toBeTruthy();
  });

  it('navigates to quiz with repeat flag when repeat wrong questions is pressed', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    fireEvent.press(getByText('Repeat Wrong Questions'));
    expect(mockNavigate).toHaveBeenCalledWith('Quiz', { 
      quizId: 'grammar-quiz',
      categoryId: 'grammar',
      isRepeating: true 
    });
  });

  it('navigates to home when continue learning is pressed', () => {
    store = setupStore();
    const { getByText } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    fireEvent.press(getByText('Continue Learning'));
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });





  it('handles perfect score scenario', () => {
    store = setupStore({
      currentResult: {
        score: 10,
        totalQuestions: 10,
        timeSpent: 5,
        quizId: 'grammar-quiz',
      },
      wrongQuestions: [],
    });
    const { queryByText } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    // Should not show wrong questions training option
    expect(queryByText('Would you like to train harder questions?')).toBeNull();
    expect(queryByText('Repeat Wrong Questions')).toBeNull();
  });

  it('handles missing user gracefully', () => {
    store = setupStore({}, {}, { user: null });
    const { getByText } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    expect(getByText('Great job, User!')).toBeTruthy();
  });

  it('returns null when no quiz result is available', () => {
    store = setupStore({ currentResult: null });
    const { queryByTestId } = render(
      <Provider store={store}>
        <ResultsScreen />
      </Provider>
    );
    
    // Should not render any content when no quiz result
    expect(queryByTestId('score-circle')).toBeNull();
  });
}); 
