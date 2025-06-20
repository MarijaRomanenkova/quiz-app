import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { Question } from '../types';
import { fetchQuestions } from '../services/api';
import { RootState } from './index';

interface QuestionsState {
  byTopicId: Record<string, Question[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  byTopicId: {},
  isLoading: false,
  error: null,
};

// Thunk to fetch questions for all topics with specific filtering
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

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestionsForTopic: (state, action: PayloadAction<{
      topicId: string;
      questions: Question[];
    }>) => {
      state.byTopicId[action.payload.topicId] = action.payload.questions;
    },
    addQuestionsForTopics: (state, action: PayloadAction<Record<string, Question[]>>) => {
      state.byTopicId = { ...state.byTopicId, ...action.payload };
    },
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

// Selectors
export const selectQuestionsForTopic = createSelector(
  [(state: RootState) => state.questions.byTopicId, (_state: RootState, topicId: string) => topicId],
  (byTopicId, topicId) => byTopicId?.[topicId] || []
);

export const selectQuestionsLoading = (state: RootState) => state.questions.isLoading;
export const selectQuestionsError = (state: RootState) => state.questions.error;

export const { setQuestionsForTopic, addQuestionsForTopics, clearQuestions } = questionsSlice.actions;

export default questionsSlice.reducer;
