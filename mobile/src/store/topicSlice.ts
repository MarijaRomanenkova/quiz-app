import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { Topic } from '../types';
import { fetchTopics } from '../services/api';
import { RootState } from './index';

interface TopicState {
  topics: Topic[];
  selectedTopicId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TopicState = {
  topics: [],
  selectedTopicId: null,
  isLoading: false,
  error: null,
};

export const fetchTopicsThunk = createAsyncThunk(
  'topics/fetchTopics',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    return fetchTopics(token);
  }
);

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setSelectedTopic: (state, action: PayloadAction<string>) => {
      state.selectedTopicId = action.payload;
    },
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
      })
      .addCase(fetchTopicsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export const { setSelectedTopic, clearTopicSelection } = topicSlice.actions;

export default topicSlice.reducer;

// Selector to get topics sorted by topicOrder, categoryId, and topicId
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
