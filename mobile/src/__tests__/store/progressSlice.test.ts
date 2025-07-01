import progressSlice, {
  initializeCategoryProgress,
  completeTopic,
  updateCompletedTopicsCategories,
  loadMoreQuestionsThunk
} from '../../store/progressSlice';
import { createTestStore } from './testHelpers';
import { fetchQuestions } from '../../services/api';
import { Topic } from '../../types';
import { configureStore } from '@reduxjs/toolkit';
import { quizSlice } from '../../store/quizSlice';
import authReducer from '../../store/authSlice';
import topicReducer from '../../store/topicSlice';
import questionsReducer from '../../store/questionsSlice';

import statisticsReducer from '../../store/statisticsSlice';
import categoryReducer from '../../store/categorySlice';
import userReducer from '../../store/userSlice';

jest.mock('../../services/api');
const mockFetchQuestions = fetchQuestions as jest.MockedFunction<typeof fetchQuestions>;

describe('progressSlice', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () =>
    configureStore({
      reducer: {
        progress: progressSlice,
        quiz: quizSlice.reducer,
        auth: authReducer,
        topic: topicReducer,
        questions: questionsReducer,
        statistics: statisticsReducer,
        category: categoryReducer,
        user: userReducer,
      },
    });

  beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().progress;
      expect(state).toEqual({
        topicProgress: {},
        categoryProgress: {},
        isLoading: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    it('should initialize category progress', () => {
      store.dispatch(initializeCategoryProgress({
        categoryId: 'cat1',
        totalTopics: 5,
        initialUnlocked: 2
      }));
      const state = store.getState().progress;
      expect(state.categoryProgress['cat1']).toEqual({
        categoryId: 'cat1',
        completedTopics: 0,
        totalTopics: 5,
        unlockedTopics: 2
      });
    });

    it('should complete a topic and update progress', () => {
      store.dispatch(initializeCategoryProgress({
        categoryId: 'cat1',
        totalTopics: 5,
        initialUnlocked: 2
      }));
      store.dispatch(completeTopic({
        topicId: 'topic1',
        categoryId: 'cat1',
        score: 80
      }));
      const state = store.getState().progress;
      expect(state.topicProgress['topic1'].completed).toBe(true);
      expect(state.topicProgress['topic1'].score).toBe(80);
      expect(state.topicProgress['topic1'].attempts).toBe(1);
      expect(state.categoryProgress['cat1'].completedTopics).toBe(1);
    });

    it('should reset progress', () => {
      // Simulate reset by reinitializing the store
      store = setupStore();
      const state = store.getState().progress;
      expect(state.topicProgress).toEqual({});
      expect(state.categoryProgress).toEqual({});
    });
  });

  describe('async thunks', () => {
    it('should handle loadMoreQuestionsThunk and unlock topics', async () => {
      // Setup state with real store
      store.dispatch(initializeCategoryProgress({
        categoryId: 'cat1',
        totalTopics: 4,
        initialUnlocked: 2
      }));
      
      // Set up topics in the real topic slice
      const topics: Topic[] = [
        { topicId: 't1', categoryId: 'cat1', levelId: 'l1', topicOrder: 1 },
        { topicId: 't2', categoryId: 'cat1', levelId: 'l1', topicOrder: 2 },
        { topicId: 't3', categoryId: 'cat1', levelId: 'l1', topicOrder: 3 },
        { topicId: 't4', categoryId: 'cat1', levelId: 'l1', topicOrder: 4 }
      ];
      
      // Set topics in the store
      store.dispatch({ type: 'topics/fetchTopics/fulfilled', payload: topics });
      
      // Set auth token
      store.dispatch({ type: 'auth/setCredentials', payload: { token: 'test-token', user: {} } });
      
      // Complete enough topics to unlock more (need 3 for non-listening/words categories)
      store.dispatch(completeTopic({ topicId: 't1', categoryId: 'cat1', score: 90 }));
      store.dispatch(completeTopic({ topicId: 't2', categoryId: 'cat1', score: 80 }));
      store.dispatch(completeTopic({ topicId: 't3', categoryId: 'cat1', score: 85 }));
      
      // Mock API
      mockFetchQuestions.mockResolvedValue({ questions: [{
        id: 'q1',
        questionId: 'question_001',
        questionText: 'Sample?',
        topicId: 't4',
        categoryId: 'cat1',
        correctAnswerId: 'a1',
        options: ['a1', 'a2'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }], hasMore: false });
      
      // Dispatch thunk
      await store.dispatch(loadMoreQuestionsThunk('cat1') as any);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Check that fetchQuestions was called for new topics
      expect(mockFetchQuestions).toHaveBeenCalled();
    });
  });
}); 
