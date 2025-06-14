import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from '../types';
import { fetchTopics } from '../services/api';

export const fetchTopicsThunk = createAsyncThunk(
  'topic/fetchTopics',
  async () => {
    const topics = await fetchTopics();
    return topics;
  }
);

interface TopicState {
  selectedTopicId: string | null;
  topics: Topic[];
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TopicState = {
  selectedTopicId: null,
  topics: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
};

export const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    setSelectedTopic: (state, action: PayloadAction<string | null>) => {
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
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTopicsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export const { 
  setSelectedTopic,
  clearTopicSelection
} = topicSlice.actions;

export default topicSlice.reducer; 
