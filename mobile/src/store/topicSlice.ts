/**
 * Topic slice for managing quiz topics and topic selection
 * 
 * This slice handles topic data management and organization including:
 * - Topic data fetching and storage from backend
 * - Topic selection state management
 * - Topic sorting and organization by category and order
 * - Integration with progress and questions slices
 * 
 * Key features:
 * - Automatic topic data fetching with authentication support
 * - Topic selection persistence and state management
 * - Topic sorting by topicOrder, categoryId, and topicId
 * - Integration with progress slice for completed topic tracking
 * - Error handling and loading states for topic operations
 * 
 * State management:
 * - topics: Array of available topics with metadata and ordering
 * - selectedTopicId: Currently selected topic for navigation
 * - isLoading: Loading state for topic operations
 * - error: Error state for failed operations
 * 
 * Selectors:
 * - selectSortedTopics: Returns topics sorted by topicOrder, categoryId, and topicId
 */

import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import { fetchTopics } from '../services/api';
import { RootState } from './index';
import { Topic } from '../types';

/**
 * Interface representing the topic slice state
 */
interface TopicState {
  /** Array of available topics */
  topics: Topic[];
  /** ID of the currently selected topic */
  selectedTopicId: string | null;
  /** Loading state for topic operations */
  isLoading: boolean;
  /** Error message from topic operations */
  error: string | null;
}

/**
 * Initial state for the topic slice
 */
const initialState: TopicState = {
  topics: [],
  selectedTopicId: null,
  isLoading: false,
  error: null,
};

/**
 * Async thunk to fetch topics from the backend
 * 
 * @returns Promise resolving to array of topics
 * 
 * @example
 * ```typescript
 * dispatch(fetchTopicsThunk());
 * ```
 */
export const fetchTopicsThunk = createAsyncThunk(
  'topics/fetchTopics',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    return fetchTopics(token);
  }
);

/**
 * Redux slice for managing topics and topic selection
 * 
 * This slice handles topic data fetching, topic selection state,
 * and provides selectors for sorted topic data.
 */
export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    /**
     * Sets the currently selected topic
     * @param state - Current topic state
     * @param action - Topic ID to select
     */
    setSelectedTopic: (state, action: PayloadAction<string>) => {
      state.selectedTopicId = action.payload;
    },
    
    /**
     * Clears the current topic selection
     * @param state - Current topic state
     */
    clearTopicSelection: (state) => {
      state.selectedTopicId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopicsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topics = action.payload;
        
        // Update category IDs for completed topics
        // We need to dispatch this action, but we can't do it directly in a reducer
        // So we'll handle this in the component that calls fetchTopicsThunk
      })
      .addCase(fetchTopicsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export const { setSelectedTopic, clearTopicSelection } = topicSlice.actions;

export default topicSlice.reducer;

/**
 * Selector to get topics sorted by topicOrder, categoryId, and topicId
 * @returns Array of topics sorted by order, category, and ID
 */
export const selectSortedTopics = createSelector(
  (state: RootState) => state.topic.topics,
  (topics) =>
    [...topics].sort(
      (a, b) =>
        a.topicOrder - b.topicOrder ||
        a.categoryId.localeCompare(b.categoryId) ||
        a.topicId.localeCompare(b.topicId)
    )
); 
