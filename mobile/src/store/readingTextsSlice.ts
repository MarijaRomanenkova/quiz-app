import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { ReadingText } from '../types';
import { fetchReadingTexts } from '../services/api';
import { RootState } from './index';

interface ReadingTextsState {
  byId: Record<string, ReadingText>;
  byTopicId: Record<string, ReadingText[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReadingTextsState = {
  byId: {},
  byTopicId: {},
  isLoading: false,
  error: null,
};

// Thunk to fetch all reading texts for all topics
export const fetchAllReadingTextsThunk = createAsyncThunk(
  'readingTexts/fetchAllReadingTexts',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const questionsState = state.questions;
    
    console.log('fetchAllReadingTextsThunk - Starting with token:', token ? 'Present' : 'Missing');
    console.log('fetchAllReadingTextsThunk - Questions by topic count:', Object.keys(questionsState.byTopicId).length);
    console.log('fetchAllReadingTextsThunk - Questions state:', questionsState);
    
    const readingTextsById: Record<string, ReadingText> = {};
    const readingTextsByTopic: Record<string, ReadingText[]> = {};
    
    // Get all questions from Redux
    const allQuestions = Object.values(questionsState.byTopicId).flat();
    console.log('fetchAllReadingTextsThunk - All questions:', allQuestions.length);
    console.log('fetchAllReadingTextsThunk - Sample questions:', allQuestions.slice(0, 3));
    
    const questionsWithReadingTexts = allQuestions.filter(q => q.readingTextId);
    console.log('fetchAllReadingTextsThunk - Questions with reading texts:', questionsWithReadingTexts.length);
    console.log('fetchAllReadingTextsThunk - Questions with reading texts:', questionsWithReadingTexts);
    
    // Get unique reading text IDs from questions
    const readingTextIds = [...new Set(questionsWithReadingTexts.map(q => q.readingTextId!))];
    console.log('fetchAllReadingTextsThunk - Unique reading text IDs:', readingTextIds);
    
    // Get unique topic IDs from questions that have reading texts
    const topicsWithReadingQuestions = [...new Set(questionsWithReadingTexts.map(q => q.topicId))];
    console.log('fetchAllReadingTextsThunk - Topics with reading questions:', topicsWithReadingQuestions);
    
    for (const topicId of topicsWithReadingQuestions) {
      try {
        console.log(`fetchAllReadingTextsThunk - Fetching reading texts for topic: ${topicId}`);
        const response = await fetchReadingTexts(topicId, token);
        console.log(`fetchAllReadingTextsThunk - Response for ${topicId}:`, response);
        
        // Store by ID and by topic
        response.forEach(text => {
          readingTextsById[text.id] = text;
          if (!readingTextsByTopic[topicId]) {
            readingTextsByTopic[topicId] = [];
          }
          readingTextsByTopic[topicId].push(text);
        });
        
        console.log(`fetchAllReadingTextsThunk - Fetched ${response.length} reading texts for topic ${topicId}`);
      } catch (error) {
        console.warn(`fetchAllReadingTextsThunk - Failed to fetch reading texts for topic ${topicId}:`, error);
        readingTextsByTopic[topicId] = [];
      }
    }
    
    console.log('fetchAllReadingTextsThunk - Reading texts fetch completed. Total texts:', Object.keys(readingTextsById).length);
    console.log('fetchAllReadingTextsThunk - Final reading texts by ID:', readingTextsById);
    return { byId: readingTextsById, byTopicId: readingTextsByTopic };
  }
);

export const readingTextsSlice = createSlice({
  name: 'readingTexts',
  initialState,
  reducers: {
    setReadingTextsForTopic: (state, action: PayloadAction<{
      topicId: string;
      readingTexts: ReadingText[];
    }>) => {
      const { topicId, readingTexts } = action.payload;
      state.byTopicId[topicId] = readingTexts;
      readingTexts.forEach(text => {
        state.byId[text.id] = text;
      });
    },
    addReadingTextsForTopics: (state, action: PayloadAction<Record<string, ReadingText[]>>) => {
      state.byTopicId = { ...state.byTopicId, ...action.payload };
      Object.values(action.payload).flat().forEach(text => {
        state.byId[text.id] = text;
      });
    },
    clearReadingTexts: (state) => {
      state.byId = {};
      state.byTopicId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReadingTextsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllReadingTextsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byId = action.payload.byId;
        state.byTopicId = action.payload.byTopicId;
      })
      .addCase(fetchAllReadingTextsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch reading texts';
      });
  },
});

// Selectors
export const selectReadingTextById = createSelector(
  [(state: RootState) => state.readingTexts.byId, (_state: RootState, textId: string) => textId],
  (byId, textId) => byId[textId]
);

export const selectReadingTextsForTopic = createSelector(
  [(state: RootState) => state.readingTexts.byTopicId, (_state: RootState, topicId: string) => topicId],
  (byTopicId, topicId) => byTopicId[topicId] || []
);

export const selectReadingTextsLoading = (state: RootState) => state.readingTexts.isLoading;
export const selectReadingTextsError = (state: RootState) => state.readingTexts.error;

export const { setReadingTextsForTopic, addReadingTextsForTopics, clearReadingTexts } = readingTextsSlice.actions;

export default readingTextsSlice.reducer; 
