import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { fetchQuestions } from '../services/api';
import { Topic } from '../types';
import { CategoryProgress, ProgressState } from '../types/progress.types';



/**
 * Async thunk to load more questions when progress threshold is met
 * 
 * This thunk automatically unlocks new topics and loads their questions
 * when a user completes enough topics in a category.
 * 
 * @param categoryId - Category ID to check for unlocking new topics
 * @returns Promise resolving to unlock result or null if no unlock needed
 * 
 * @example
 * ```typescript
 * // Dispatch when a topic is completed
 * dispatch(loadMoreQuestionsThunk('listening'));
 * ```
 */
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
    
    const unlockCondition = categoryProgress.completedTopics >= nextUnlockThreshold && currentUnlocked < categoryTopics.length;
    
    // If we've completed enough topics, unlock more
    if (unlockCondition) {
      
      const newUnlockedCount = Math.min(currentUnlocked + 2, categoryTopics.length);
      const topicsToUnlock = categoryTopics.slice(currentUnlocked, newUnlockedCount);
      
      // Fetch questions for newly unlocked topics
      const questionsByTopic: Record<string, any[]> = {};
      
      for (const topic of topicsToUnlock) {
        try {
          const response = await fetchQuestions(topic.topicId, undefined, token);
          questionsByTopic[topic.topicId] = response.questions;
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
    } else {
      // Unlock condition not met
    }
    
    return null;
  }
);

/**
 * Redux slice for managing learning progress and topic unlocking
 * 
 * This slice handles topic completion tracking, category progress,
 * automatic topic unlocking based on completion thresholds, and
 * provides selectors for progress data used throughout the app.
 */
export const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    topicProgress: {},
    categoryProgress: {},
    isLoading: false,
    error: null,
  } as ProgressState,
  reducers: {
    /**
     * Initializes progress tracking for a category
     * @param state - Current progress state
     * @param action - Category initialization data
     */
    initializeCategoryProgress: (state, action: PayloadAction<{
      categoryId: string;
      totalTopics: number;
      initialUnlocked: number;
    }>) => {
      const { categoryId, totalTopics, initialUnlocked } = action.payload;
      
      // Check if category progress already exists
      const existingProgress = state.categoryProgress[categoryId];
      
      // Count existing completed topics for this category
      const existingCompletedTopics = Object.values(state.topicProgress)
        .filter(topic => topic.categoryId === categoryId && topic.completed)
        .length;
      
      state.categoryProgress[categoryId] = {
        categoryId,
        completedTopics: existingProgress ? existingProgress.completedTopics : existingCompletedTopics,
        totalTopics,
        unlockedTopics: existingProgress ? existingProgress.unlockedTopics : initialUnlocked,

      };
    },
    
    /**
     * Marks a topic as completed and updates progress
     * @param state - Current progress state
     * @param action - Topic completion data
     */
    completeTopic: (state, action: PayloadAction<{
      topicId: string;
      categoryId: string;
      score: number;
    }>) => {
      const { topicId, categoryId, score } = action.payload;
      const wasAlreadyCompleted = state.topicProgress[topicId]?.completed;
      
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
      if (state.categoryProgress[categoryId] && !wasAlreadyCompleted) {
        state.categoryProgress[categoryId].completedTopics += 1;
      }
    },
    
    /**
     * Updates topic attempt data without marking as completed
     * @param state - Current progress state
     * @param action - Topic attempt data
     */
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
    
    /**
     * Updates the number of unlocked topics for a category
     * @param state - Current progress state
     * @param action - Category unlock data
     */
    updateUnlockedTopics: (state, action: PayloadAction<{
      categoryId: string;
      unlockedCount: number;
    }>) => {
      const { categoryId, unlockedCount } = action.payload;
      
      if (state.categoryProgress[categoryId]) {
        state.categoryProgress[categoryId].unlockedTopics = unlockedCount;
      }
    },
    
    /**
     * Loads completed topics from backend (on login)
     * @param state - Current progress state
     * @param action - Array of completed topics from backend
     */
    loadCompletedTopics: (state, action: PayloadAction<Array<{topicId: string, score: number, completedAt: string}>>) => {
      const completedTopics = action.payload;
      
      // Convert completed topics to topic progress format
      completedTopics.forEach(completedTopic => {
        // We'll need to get topics from the topic slice, so just store the completed topic data
        // The category will be determined when topics are loaded
        state.topicProgress[completedTopic.topicId] = {
          topicId: completedTopic.topicId,
          categoryId: '', // Will be set when topics are loaded
          completed: true,
          score: completedTopic.score,
          attempts: 1, // We don't store attempts in backend, so default to 1
          lastAttemptDate: completedTopic.completedAt
        };
      });
    },

    /**
     * Updates category IDs for completed topics when topics are loaded
     * @param state - Current progress state
     * @param action - Array of topics from backend
     */
    updateCompletedTopicsCategories: (state, action: PayloadAction<Array<{topicId: string, categoryId: string}>>) => {
      const topics = action.payload;
      
      // Update category IDs for completed topics that don't have them set
      Object.values(state.topicProgress).forEach(topicProgress => {
        if (topicProgress.completed && topicProgress.categoryId === '') {
          const topic = topics.find(t => t.topicId === topicProgress.topicId);
          if (topic) {
            topicProgress.categoryId = topic.categoryId;
            
            // Also update category progress
            if (state.categoryProgress[topic.categoryId]) {
              state.categoryProgress[topic.categoryId].completedTopics += 1;
            }
          }
        }
      });
    },
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

/**
 * Selector to get progress data for a specific topic
 * @param state - Root state
 * @param topicId - Topic ID to get progress for
 * @returns Topic progress data or undefined if not found
 */
export const selectTopicProgress = (state: RootState, topicId: string) => 
  state.progress.topicProgress[topicId];

/**
 * Selector to get progress data for a specific category with calculated total topics
 * @param state - Root state
 * @param categoryId - Category ID to get progress for
 * @returns Category progress data with actual total topics or undefined if not found
 */
export const selectCategoryProgress = createSelector(
  [(state: RootState) => state.progress.categoryProgress,
   (state: RootState) => state.topic.topics,
   (_state: RootState, categoryId: string) => categoryId],
  (categoryProgress, topics, categoryId) => {
    const progress = categoryProgress[categoryId];
    if (!progress) return undefined;
    
    // Calculate actual total topics for this category from the topics slice
    const actualTotalTopics = topics.filter(topic => topic.categoryId === categoryId).length;
    
    return {
      ...progress,
      totalTopics: actualTotalTopics // Use actual total from topics slice
    };
  }
);

/**
 * Selector to get unlocked topics for a category
 * @returns Array of unlocked topics for the specified category
 */
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

/**
 * Selector to check if a specific topic is unlocked
 * @returns Boolean indicating if the topic is unlocked
 */
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

/**
 * Selector to get all category progress with calculated percentages
 * @returns Array of category progress objects with completion percentages
 */
export const selectAllCategoryProgress = createSelector(
  [(state: RootState) => state.progress.categoryProgress,
   (state: RootState) => state.topic.topics],
  (categoryProgress, topics) => {
    return Object.values(categoryProgress).map(progress => {
      // Get the actual total topics for this category from the topics slice
      const actualTotalTopics = topics.filter(topic => topic.categoryId === progress.categoryId).length;
      
      return {
        categoryId: progress.categoryId,
        completedTopics: progress.completedTopics,
        totalTopics: actualTotalTopics, // Use actual total from topics slice
        percentage: actualTotalTopics > 0 ? Math.round((progress.completedTopics / actualTotalTopics) * 100) : 0
      };
    });
  }
);

export const { 
  initializeCategoryProgress, 
  completeTopic, 
  updateTopicAttempt, 
  updateUnlockedTopics,
  loadCompletedTopics,
  updateCompletedTopicsCategories
} = progressSlice.actions;

export default progressSlice.reducer; 
