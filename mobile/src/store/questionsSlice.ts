import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { Question, ReadingText } from '../types';
import { fetchQuestions, fetchReadingTexts } from '../services/api';
import { RootState } from './index';

/**
 * Interface representing the questions slice state
 */
interface QuestionsState {
  /** Questions grouped by topic ID */
  byTopicId: Record<string, Question[]>;
  /** Reading texts indexed by their ID */
  readingTextsById: Record<string, ReadingText>;
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
  readingTextsById: {},
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
  'questions/fetchAllQuestions',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const topics = state.topic.topics;
    
    console.log('fetchAllQuestionsThunk - Starting with token:', token ? 'Present' : 'Missing');
    console.log('fetchAllQuestionsThunk - Topics count:', topics.length);
    console.log('fetchAllQuestionsThunk - Topics:', topics);
    
    const questionsByTopic: Record<string, Question[]> = {};
    
    // Group topics by category
    const topicsByCategory: Record<string, typeof topics> = {};
    topics.forEach(topic => {
      if (!topicsByCategory[topic.categoryId]) {
        topicsByCategory[topic.categoryId] = [];
      }
      topicsByCategory[topic.categoryId].push(topic);
    });
    
    console.log('fetchAllQuestionsThunk - Topics by category:', Object.keys(topicsByCategory));
    
    // Sort topics within each category by topicOrder
    Object.keys(topicsByCategory).forEach(categoryId => {
      topicsByCategory[categoryId].sort((a, b) => a.topicOrder - b.topicOrder);
    });
    
    // Fetch questions based on category rules
    for (const [categoryId, categoryTopics] of Object.entries(topicsByCategory)) {
      let topicsToFetch = categoryTopics;
      
      // Apply filtering rules
      if (categoryId === 'listening' || categoryId === 'words') {
        // Only fetch first 3 topics for listening and words
        topicsToFetch = categoryTopics.slice(0, 3);
        console.log(`fetchAllQuestionsThunk - Fetching first 3 topics for ${categoryId}:`, topicsToFetch.map(t => t.topicId));
      } else {
        // Fetch all topics for grammar and reading
        console.log(`fetchAllQuestionsThunk - Fetching all topics for ${categoryId}:`, topicsToFetch.map(t => t.topicId));
      }
      
      // Fetch questions for selected topics
      for (const topic of topicsToFetch) {
        try {
          console.log(`fetchAllQuestionsThunk - Fetching questions for topic: ${topic.topicId}`);
          const response = await fetchQuestions(topic.topicId, undefined, token);
          questionsByTopic[topic.topicId] = response.questions;
          console.log(`fetchAllQuestionsThunk - Fetched ${response.questions.length} questions for topic ${topic.topicId}`);
        } catch (error) {
          console.warn(`fetchAllQuestionsThunk - Failed to fetch questions for topic ${topic.topicId}:`, error);
          questionsByTopic[topic.topicId] = [];
        }
      }
    }
    
    console.log('fetchAllQuestionsThunk - Questions fetch completed. Total topics with questions:', Object.keys(questionsByTopic).length);
    console.log('fetchAllQuestionsThunk - Questions by topic:', questionsByTopic);
    return questionsByTopic;
  }
);

/**
 * Async thunk to fetch all reading texts for all topics
 * 
 * This thunk analyzes questions to find which topics have reading texts,
 * then fetches all reading texts for those topics and organizes them
 * by ID and by topic.
 * 
 * @returns Promise resolving to object containing reading texts organized by ID and topic
 * 
 * @example
 * ```typescript
 * dispatch(fetchAllReadingTextsThunk());
 * ```
 */
export const fetchAllReadingTextsThunk = createAsyncThunk(
  'questions/fetchAllReadingTexts',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const questionsState = state.questions;
    
    // Get all questions from Redux state
    const allQuestions = Object.values(questionsState.byTopicId).flat();
    
    // Filter questions that have reading texts
    const questionsWithReadingTexts = allQuestions.filter(q => q.readingTextId);
    
    // Group questions by topic to fetch reading texts efficiently
    const topicsWithReadingQuestions = new Set(
      questionsWithReadingTexts.map(q => q.topicId)
    );
    
    const readingTextsById: Record<string, ReadingText> = {};
    
    // Fetch reading texts for each topic that has reading questions
    for (const topicId of topicsWithReadingQuestions) {
      try {
        const response = await fetchReadingTexts(topicId, token);
        
        // Add reading texts to our collection
        response.forEach(text => {
          readingTextsById[text.id] = text;
        });
      } catch (error) {
        console.warn(`Failed to fetch reading texts for topic ${topicId}:`, error);
      }
    }
    
    return readingTextsById;
  }
);

/**
 * Redux slice for managing questions and reading texts
 * 
 * This slice handles question data fetching, storage, and organization.
 * Questions are stored by topic ID for easy access during quizzes.
 * Reading texts are stored both by ID for quick lookup and by topic ID
 * for grouping related texts.
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
      })
      .addCase(fetchAllReadingTextsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllReadingTextsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.readingTextsById = action.payload;
      })
      .addCase(fetchAllReadingTextsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reading texts';
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
 * Selector to get a reading text by its ID
 * @returns Reading text object or undefined if not found
 */
export const selectReadingTextById = createSelector(
  [(state: RootState) => state.questions.readingTextsById, (_state: RootState, textId: string) => textId],
  (readingTextsById, textId) => readingTextsById[textId]
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

export const { 
  setQuestionsForTopic, 
  addQuestionsForTopics, 
  clearQuestions
} = questionsSlice.actions;

export default questionsSlice.reducer;
