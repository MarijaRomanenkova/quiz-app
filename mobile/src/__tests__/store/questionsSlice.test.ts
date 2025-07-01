import { configureStore } from '@reduxjs/toolkit';
import questionsReducer, {
  setQuestionsForTopic,
  addQuestionsForTopics,
  clearQuestions
} from '../../store/questionsSlice';

const initialState = {
  byTopicId: {},
  readingTextsById: {},
  isLoading: false,
  error: null,
};

const mockQuestion = {
  id: 'q1',
  questionId: 'question_001',
  questionText: 'What is the capital of Germany?',
  topicId: 't1',
  categoryId: 'c1',
  correctAnswerId: 'berlin',
  options: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};
const mockQuestion2 = {
  id: 'q2',
  questionId: 'question_002',
  questionText: 'What is the capital of France?',
  topicId: 't1',
  categoryId: 'c1',
  correctAnswerId: 'paris',
  options: ['Paris', 'Lyon', 'Marseille', 'Nice'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('questionsSlice', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => {
    return configureStore({
      reducer: {
        questions: questionsReducer,
      },
    });
  };

  beforeEach(() => {
    store = setupStore();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = store.getState().questions;
      expect(state).toEqual(initialState);
    });
  });

  describe('setQuestionsForTopic', () => {
    it('should set questions for a topic', () => {
      const topicId = 't1';
      const mockQuestions = [mockQuestion, mockQuestion2];
      store.dispatch(setQuestionsForTopic({ topicId, questions: mockQuestions }));
      const state = store.getState().questions;
      expect(state.byTopicId[topicId]).toEqual(mockQuestions);
    });
  });

  describe('addQuestionsForTopics', () => {
    it('should add questions for multiple topics', () => {
      const payload = {
        t1: [mockQuestion],
        t2: [
          {
            ...mockQuestion2,
            id: 'q3',
            questionId: 'question_003',
            questionText: 'What is the capital of Italy?',
            topicId: 't2',
            correctAnswerId: 'rome',
            options: ['Rome', 'Milan', 'Naples', 'Turin'],
          },
        ],
      };
      store.dispatch(addQuestionsForTopics(payload));
      const state = store.getState().questions;
      expect(state.byTopicId).toEqual(payload);
    });
  });

  describe('clearQuestions', () => {
    it('should clear all questions', () => {
      store.dispatch(addQuestionsForTopics({ t1: [mockQuestion] }));
      expect(Object.keys(store.getState().questions.byTopicId).length).toBe(1);
      store.dispatch(clearQuestions());
      expect(store.getState().questions.byTopicId).toEqual({});
    });
  });
}); 
