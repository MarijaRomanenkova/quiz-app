import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { fetchQuestions } from '../services/api';
import { Topic } from '../types';

/**
 * Interface representing progress data for a specific topic
 */
interface TopicProgress {
  /** Unique identifier for the topic */
  topicId: string;
  /** Category this topic belongs to */
  categoryId: string;
  /** Whether the topic has been completed */
  completed: boolean;
  /** Best score achieved on this topic (0-100) */
  score: number;
  /** Number of attempts made on this topic */
  attempts: number;
  /** ISO timestamp of the last attempt */
  lastAttemptDate?: string;
}

/**
 * Interface representing progress data for a category
 */
interface CategoryProgress {
  /** Unique identifier for the category */
  categoryId: string;
  /** Number of completed topics in this category */
  completedTopics: number;
  /** Total number of topics in this category */
  totalTopics: number;
  /** Number of topics currently unlocked for this category */
  unlockedTopics: number;
}

/**
 * Interface representing the complete progress state
 */
interface ProgressState {
  /** Progress data for individual topics, keyed by topicId */
  topicProgress: Record<string, TopicProgress>;
  /** Progress data for categories, keyed by categoryId */
  categoryProgress: Record<string, CategoryProgress>;
  /** Loading state for progress operations */
  isLoading: boolean;
  /** Error message from progress operations */
  error: string | null;
}

/**
 * Initial state for the progress slice
 */
const initialState: ProgressState = {
  topicProgress: {},
  categoryProgress: {},
  isLoading: false,
  error: null,
};

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
    console.log('Thunk started');
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const topics = state.topic.topics;
    const categoryProgress = state.progress.categoryProgress[categoryId];
    
    console.log('loadMoreQuestionsThunk - categoryId:', categoryId);
    console.log('loadMoreQuestionsThunk - categoryProgress:', categoryProgress);
    console.log('loadMoreQuestionsThunk - topics:', topics);
    
    if (!categoryProgress) {
      throw new Error(`No progress found for category ${categoryId}`);
    }

    // Get topics for this category, sorted by topicOrder
    const categoryTopics = topics
      .filter(topic => topic.categoryId === categoryId)
      .sort((a, b) => a.topicOrder - b.topicOrder);

    console.log('loadMoreQuestionsThunk - categoryTopics:', categoryTopics);

    // Calculate how many more topics to unlock
    const currentUnlocked = categoryProgress.unlockedTopics;
    const nextUnlockThreshold = categoryId === 'listening' || categoryId === 'words' ? 2 : 3;
    
    console.log('loadMoreQuestionsThunk - currentUnlocked:', currentUnlocked);
    console.log('loadMoreQuestionsThunk - nextUnlockThreshold:', nextUnlockThreshold);
    console.log('loadMoreQuestionsThunk - completedTopics:', categoryProgress.completedTopics);
    console.log('loadMoreQuestionsThunk - categoryTopics.length:', categoryTopics.length);
    const unlockCondition = categoryProgress.completedTopics >= nextUnlockThreshold && currentUnlocked < categoryTopics.length;
    console.log('loadMoreQuestionsThunk - unlockCondition:', unlockCondition);
    
    // If we've completed enough topics, unlock more
    if (unlockCondition) {
      
      console.log('loadMoreQuestionsThunk - Unlock condition met!');
      
      const newUnlockedCount = Math.min(currentUnlocked + 2, categoryTopics.length);
      const topicsToUnlock = categoryTopics.slice(currentUnlocked, newUnlockedCount);
      
      console.log('loadMoreQuestionsThunk - topicsToUnlock:', topicsToUnlock);
      
      // Fetch questions for newly unlocked topics
      const questionsByTopic: Record<string, any[]> = {};
      
      for (const topic of topicsToUnlock) {
        try {
          console.log('loadMoreQuestionsThunk - Fetching questions for topic:', topic.topicId);
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
      console.log('loadMoreQuestionsThunk - Unlock condition NOT met');
      console.log('loadMoreQuestionsThunk - completedTopics >= threshold:', categoryProgress.completedTopics >= nextUnlockThreshold);
      console.log('loadMoreQuestionsThunk - currentUnlocked < length:', currentUnlocked < categoryTopics.length);
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
  initialState,
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
        unlockedTopics: existingProgress ? existingProgress.unlockedTopics : initialUnlocked
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
 * Selector to get progress data for a specific category
 * @param state - Root state
 * @param categoryId - Category ID to get progress for
 * @returns Category progress data or undefined if not found
 */
export const selectCategoryProgress = (state: RootState, categoryId: string) => 
  state.progress.categoryProgress[categoryId];

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
