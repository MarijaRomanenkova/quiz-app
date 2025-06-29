import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { Question } from '../types';
import { fetchQuestions } from '../services/api';
import { RootState } from './index';

/**
 * Interface representing the questions slice state
 */
interface QuestionsState {
  /** Questions grouped by topic ID */
  byTopicId: Record<string, Question[]>;
  /** Loading state for questions operations */
  isLoading: boolean;
  /** Error message from questions operations */
  error: string | null;
}

/**
 * Initial state for the questions slice
 */
const initialState: QuestionsState = {
  byTopicId: {},
  isLoading: false,
  error: null,
};

/**
 * Async thunk to fetch questions for all topics with specific filtering
 * 
 * This thunk fetches questions for topics based on category-specific rules:
 * - Listening and Words categories: Only fetch first 3 topics
 * - Grammar and Reading categories: Fetch all topics
 * 
 * @returns Promise resolving to questions organized by topic ID
 * 
 * @example
 * ```typescript
 * dispatch(fetchAllQuestionsThunk());
 * ```
 */
export const fetchAllQuestionsThunk = createAsyncThunk(
  'questions/fetchAll',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const topics = state.topic.topics;
    
    const questionsByTopic: Record<string, any[]> = {};
    
    // Group topics by category for efficient fetching
    const topicsByCategory: Record<string, typeof topics> = {};
    topics.forEach(topic => {
      if (!topicsByCategory[topic.categoryId]) {
        topicsByCategory[topic.categoryId] = [];
      }
      topicsByCategory[topic.categoryId].push(topic);
    });
    
    // Fetch questions for each category
    for (const [categoryId, categoryTopics] of Object.entries(topicsByCategory)) {
      // For each category, fetch questions for the first 3 topics initially
      const topicsToFetch = categoryTopics.slice(0, 3);
      
      // If there are more than 3 topics, fetch all of them
      if (categoryTopics.length > 3) {
        const allTopics = categoryTopics;
        for (const topic of allTopics) {
          try {
            const response = await fetchQuestions(topic.topicId, undefined, token);
            questionsByTopic[topic.topicId] = response.questions;
          } catch (error) {
            console.warn(`Failed to fetch questions for topic ${topic.topicId}:`, error);
            questionsByTopic[topic.topicId] = [];
          }
        }
      } else {
        // Fetch questions for the first 3 topics
        for (const topic of topicsToFetch) {
          try {
            const response = await fetchQuestions(topic.topicId, undefined, token);
            questionsByTopic[topic.topicId] = response.questions;
          } catch (error) {
            console.warn(`Failed to fetch questions for topic ${topic.topicId}:`, error);
            questionsByTopic[topic.topicId] = [];
          }
        }
      }
    }
    
    return questionsByTopic;
  }
);

/**
 * Redux slice for managing questions
 * 
 * This slice handles question data fetching, storage, and organization.
 * Questions are stored by topic ID for easy access during quizzes.
 */
export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    /**
     * Sets questions for a specific topic
     * @param state - Current questions state
     * @param action - Object containing topic ID and questions array
     */
    setQuestionsForTopic: (state, action: PayloadAction<{
      topicId: string;
      questions: Question[];
    }>) => {
      state.byTopicId[action.payload.topicId] = action.payload.questions;
    },
    
    /**
     * Adds questions for multiple topics
     * @param state - Current questions state
     * @param action - Object mapping topic IDs to questions arrays
     */
    addQuestionsForTopics: (state, action: PayloadAction<Record<string, Question[]>>) => {
      state.byTopicId = { ...state.byTopicId, ...action.payload };
    },
    
    /**
     * Clears all questions data
     * @param state - Current questions state
     */
    clearQuestions: (state) => {
      state.byTopicId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQuestionsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllQuestionsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byTopicId = action.payload;
      })
      .addCase(fetchAllQuestionsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch questions';
      });
  },
});

/**
 * Selector to get questions for a specific topic
 * @returns Array of questions for the specified topic
 */
export const selectQuestionsForTopic = createSelector(
  [(state: RootState) => state.questions.byTopicId, (_state: RootState, topicId: string) => topicId],
  (byTopicId, topicId) => byTopicId?.[topicId] || []
);

/**
 * Selector to get the loading state for questions
 * @returns Boolean indicating if questions are being loaded
 */
export const selectQuestionsLoading = (state: RootState) => state.questions.isLoading;

/**
 * Selector to get the error state for questions
 * @returns Error message or null if no error
 */
export const selectQuestionsError = (state: RootState) => state.questions.error;

export const { setQuestionsForTopic, addQuestionsForTopics, clearQuestions } = questionsSlice.actions;

export default questionsSlice.reducer;
