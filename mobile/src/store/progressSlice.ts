import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { fetchQuestions } from '../services/api';
import { Topic } from '../types';

interface TopicProgress {
  topicId: string;
  categoryId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttemptDate?: string;
}

interface CategoryProgress {
  categoryId: string;
  completedTopics: number;
  totalTopics: number;
  unlockedTopics: number; // How many topics are currently unlocked for this category
}

interface ProgressState {
  topicProgress: Record<string, TopicProgress>;
  categoryProgress: Record<string, CategoryProgress>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  topicProgress: {},
  categoryProgress: {},
  isLoading: false,
  error: null,
};

// Thunk to load more questions when progress threshold is met
export const loadMoreQuestionsThunk = createAsyncThunk(
  'progress/loadMoreQuestions',
  async (categoryId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const topics = state.topic.topics;
    const categoryProgress = state.progress.categoryProgress[categoryId];
    
    if (!categoryProgress) {
      throw new Error(`No progress found for category ${categoryId}`);
    }

    // Get topics for this category, sorted by topicOrder
    const categoryTopics = topics
      .filter(topic => topic.categoryId === categoryId)
      .sort((a, b) => a.topicOrder - b.topicOrder);

    // Calculate how many more topics to unlock
    const currentUnlocked = categoryProgress.unlockedTopics;
    const nextUnlockThreshold = categoryId === 'listening' || categoryId === 'words' ? 2 : 3;
    
    // If we've completed enough topics, unlock more
    if (categoryProgress.completedTopics >= nextUnlockThreshold && 
        currentUnlocked < categoryTopics.length) {
      
      const newUnlockedCount = Math.min(currentUnlocked + 2, categoryTopics.length);
      const topicsToUnlock = categoryTopics.slice(currentUnlocked, newUnlockedCount);
      
      console.log(`Unlocking ${topicsToUnlock.length} more topics for ${categoryId}:`, 
        topicsToUnlock.map(t => t.topicId));
      
      // Fetch questions for newly unlocked topics
      const questionsByTopic: Record<string, any[]> = {};
      
      for (const topic of topicsToUnlock) {
        try {
          const response = await fetchQuestions(topic.topicId, undefined, token);
          questionsByTopic[topic.topicId] = response.questions;
          console.log(`Loaded ${response.questions.length} questions for ${topic.topicId}`);
        } catch (error) {
          console.warn(`Failed to load questions for ${topic.topicId}:`, error);
          questionsByTopic[topic.topicId] = [];
        }
      }
      
      // Update the questions slice with new questions
      dispatch({
        type: 'questions/addQuestionsForTopics',
        payload: questionsByTopic
      });
      
      return {
        categoryId,
        newUnlockedCount,
        questionsByTopic
      };
    }
    
    return null;
  }
);

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // Initialize progress for a category
    initializeCategoryProgress: (state, action: PayloadAction<{
      categoryId: string;
      totalTopics: number;
      initialUnlocked: number;
    }>) => {
      const { categoryId, totalTopics, initialUnlocked } = action.payload;
      
      state.categoryProgress[categoryId] = {
        categoryId,
        completedTopics: 0,
        totalTopics,
        unlockedTopics: initialUnlocked
      };
    },
    
    // Mark a topic as completed
    completeTopic: (state, action: PayloadAction<{
      topicId: string;
      categoryId: string;
      score: number;
    }>) => {
      const { topicId, categoryId, score } = action.payload;
      
      // Update topic progress
      state.topicProgress[topicId] = {
        topicId,
        categoryId,
        completed: true,
        score,
        attempts: (state.topicProgress[topicId]?.attempts || 0) + 1,
        lastAttemptDate: new Date().toISOString()
      };
      
      // Update category progress
      if (state.categoryProgress[categoryId]) {
        state.categoryProgress[categoryId].completedTopics += 1;
      }
    },
    
    // Update topic attempt (without completion)
    updateTopicAttempt: (state, action: PayloadAction<{
      topicId: string;
      categoryId: string;
      score: number;
    }>) => {
      const { topicId, categoryId, score } = action.payload;
      
      const existing = state.topicProgress[topicId];
      state.topicProgress[topicId] = {
        topicId,
        categoryId,
        completed: existing?.completed || false,
        score: Math.max(existing?.score || 0, score),
        attempts: (existing?.attempts || 0) + 1,
        lastAttemptDate: new Date().toISOString()
      };
    },
    
    // Update unlocked topics count for a category
    updateUnlockedTopics: (state, action: PayloadAction<{
      categoryId: string;
      unlockedCount: number;
    }>) => {
      const { categoryId, unlockedCount } = action.payload;
      
      if (state.categoryProgress[categoryId]) {
        state.categoryProgress[categoryId].unlockedTopics = unlockedCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoreQuestionsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMoreQuestionsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.categoryProgress[action.payload.categoryId].unlockedTopics = 
            action.payload.newUnlockedCount;
        }
      })
      .addCase(loadMoreQuestionsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load more questions';
      });
  },
});

// Selectors
export const selectTopicProgress = (state: RootState, topicId: string) => 
  state.progress.topicProgress[topicId];

export const selectCategoryProgress = (state: RootState, categoryId: string) => 
  state.progress.categoryProgress[categoryId];

export const selectUnlockedTopicsForCategory = createSelector(
  [(state: RootState) => state.topic.topics, 
   (state: RootState) => state.progress.categoryProgress,
   (_state: RootState, categoryId: string) => categoryId],
  (topics: Topic[], categoryProgress: Record<string, CategoryProgress>, categoryId: string) => {
    const progress = categoryProgress[categoryId];
    if (!progress) return [];
    
    return topics
      .filter((topic: Topic) => topic.categoryId === categoryId)
      .sort((a: Topic, b: Topic) => a.topicOrder - b.topicOrder)
      .slice(0, progress.unlockedTopics);
  }
);

export const selectIsTopicUnlocked = createSelector(
  [(state: RootState) => state.progress.categoryProgress,
   (state: RootState) => state.topic.topics,
   (_state: RootState, topicId: string) => topicId],
  (categoryProgress, topics, topicId) => {
    const topic = topics.find(t => t.topicId === topicId);
    if (!topic) return false;
    
    const progress = categoryProgress[topic.categoryId];
    if (!progress) return false;
    
    const categoryTopics = topics
      .filter(t => t.categoryId === topic.categoryId)
      .sort((a, b) => a.topicOrder - b.topicOrder);
    
    const topicIndex = categoryTopics.findIndex(t => t.topicId === topicId);
    return topicIndex < progress.unlockedTopics;
  }
);

export const { 
  initializeCategoryProgress, 
  completeTopic, 
  updateTopicAttempt, 
  updateUnlockedTopics 
} = progressSlice.actions;

export default progressSlice.reducer; 
