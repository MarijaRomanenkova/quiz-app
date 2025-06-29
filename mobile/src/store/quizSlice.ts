import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Question } from '../types';

/**
 * Interface representing daily quiz statistics
 */
interface DailyStats {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Time spent on quizzes in minutes */
  timeSpent: number;
  /** Number of questions answered */
  questionsAnswered: number;
}

/**
 * Interface representing the best attempt for a topic
 */
interface BestAttempt {
  /** Topic ID */
  topicId: string;
  /** Score achieved (0-100) */
  score: number;
  /** Date of the attempt in ISO format */
  date: string;
  /** Time spent on the attempt in minutes */
  timeSpent: number;
}

/**
 * Interface representing the active quiz state
 */
interface ActiveQuiz {
  /** Current question index (0-based) */
  currentQuestion: number;
  /** Current score */
  score: number;
  /** Currently selected answer index or null if none selected */
  selectedAnswer: number | null;
  /** Current reading text ID or null if none */
  currentTextId: string | null;
  /** Whether reading text is currently shown */
  showReadingText: boolean;
}

/**
 * Interface representing the complete quiz state
 */
interface QuizState {
  /** ID of the currently selected topic */
  currentTopicId: string | null;
  /** Array of question IDs that were answered incorrectly */
  wrongQuestionIds: string[];
  /** Array of daily statistics */
  dailyStats: DailyStats[];
  /** Array of best attempts for each topic */
  bestAttempts: BestAttempt[];
  /** Current active quiz state or null if no quiz is active */
  activeQuiz: ActiveQuiz | null;
}

/**
 * Initial state for the quiz slice
 */
const initialState: QuizState = {
  currentTopicId: null,
  wrongQuestionIds: [],
  dailyStats: [],
  bestAttempts: [],
  activeQuiz: null,
};

/**
 * Redux slice for managing quiz state and progress
 * 
 * This slice handles active quiz sessions, wrong question tracking,
 * daily statistics, best attempts, and quiz navigation state.
 */
export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    /**
     * Sets the currently selected topic for quiz
     * @param state - Current quiz state
     * @param action - Topic ID to set as current
     */
    setCurrentTopic: (state, action: PayloadAction<string>) => {
      state.currentTopicId = action.payload;
    },
    
    /**
     * Adds a question ID to the list of wrong questions
     * @param state - Current quiz state
     * @param action - Question ID to add
     */
    addWrongQuestion: (state, action: PayloadAction<string>) => {
      state.wrongQuestionIds.push(action.payload);
    },
    
    /**
     * Clears all wrong question IDs
     * @param state - Current quiz state
     */
    clearWrongQuestions: (state) => {
      state.wrongQuestionIds = [];
    },
    
    /**
     * Updates daily statistics with new quiz activity
     * @param state - Current quiz state
     * @param action - Object containing time spent and questions answered
     */
    updateDailyStats: (state, action: PayloadAction<{ timeSpent: number; questionsAnswered: number }>) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Ensure dailyStats is an array
      if (!Array.isArray(state.dailyStats)) {
        state.dailyStats = [];
      }
      
      const existingDayIndex = state.dailyStats.findIndex(stat => stat.date === today);
      
      if (existingDayIndex >= 0) {
        state.dailyStats[existingDayIndex].timeSpent += action.payload.timeSpent;
        state.dailyStats[existingDayIndex].questionsAnswered += action.payload.questionsAnswered;
      } else {
        state.dailyStats.push({
          date: today,
          ...action.payload
        });
      }
    },
    
    /**
     * Updates the best attempt for a topic if the new score is higher
     * @param state - Current quiz state
     * @param action - Object containing topic ID, score, and time spent
     */
    updateBestAttempt: (state, action: PayloadAction<{
      topicId: string;
      score: number;
      timeSpent: number;
    }>) => {
      const { topicId, score, timeSpent } = action.payload;
      const existingIndex = state.bestAttempts.findIndex(attempt => attempt.topicId === topicId);
      
      if (existingIndex >= 0) {
        if (state.bestAttempts[existingIndex].score < score) {
          state.bestAttempts[existingIndex] = {
            topicId,
            score,
            timeSpent,
            date: new Date().toISOString()
          };
        }
      } else {
        state.bestAttempts.push({
          topicId,
          score,
          timeSpent,
          date: new Date().toISOString()
        });
      }
    },
    
    /**
     * Starts a new quiz session
     * @param state - Current quiz state
     */
    startQuiz: (state) => {
      state.activeQuiz = {
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        currentTextId: null,
        showReadingText: false,
      };
    },
    
    /**
     * Sets the selected answer for the current question
     * @param state - Current quiz state
     * @param action - Selected answer index or null to clear selection
     */
    selectAnswer: (state, action: PayloadAction<number | null>) => {
      if (state.activeQuiz) {
        state.activeQuiz.selectedAnswer = action.payload;
      }
    },
    
    /**
     * Moves to the next question in the quiz
     * @param state - Current quiz state
     */
    nextQuestion: (state) => {
      if (state.activeQuiz) {
        state.activeQuiz.currentQuestion += 1;
        state.activeQuiz.selectedAnswer = null;
      }
    },
    
    /**
     * Updates the current quiz score
     * @param state - Current quiz state
     * @param action - New score value
     */
    updateScore: (state, action: PayloadAction<number>) => {
      if (state.activeQuiz) {
        state.activeQuiz.score = action.payload;
      }
    },
    
    /**
     * Sets the reading text for the current question
     * @param state - Current quiz state
     * @param action - Object containing text ID and show flag
     */
    setReadingText: (state, action: PayloadAction<{ textId: string; show: boolean }>) => {
      if (state.activeQuiz) {
        state.activeQuiz.currentTextId = action.payload.textId;
        state.activeQuiz.showReadingText = action.payload.show;
      }
    },
    
    /**
     * Ends the current quiz session
     * @param state - Current quiz state
     */
    endQuiz: (state) => {
      state.activeQuiz = null;
    },
  },
});

export const { 
  setCurrentTopic, 
  addWrongQuestion, 
  clearWrongQuestions,
  updateDailyStats,
  updateBestAttempt,
  startQuiz,
  selectAnswer,
  nextQuestion,
  updateScore,
  setReadingText,
  endQuiz,
} = quizSlice.actions;

// Selectors
const selectQuizState = (state: RootState) => state.quiz;

/**
 * Selector to get the currently selected topic ID
 * @returns Topic ID or null if none selected
 */
export const selectCurrentTopicId = createSelector(
  [selectQuizState],
  (quizState) => quizState.currentTopicId
);

/**
 * Selector to get all wrong question IDs
 * @returns Array of question IDs that were answered incorrectly
 */
export const selectWrongQuestionIds = createSelector(
  [selectQuizState],
  (quizState) => quizState.wrongQuestionIds
);

/**
 * Selector to get daily statistics
 * @returns Array of daily quiz statistics
 */
export const selectDailyStats = createSelector(
  [selectQuizState],
  (quizState) => quizState.dailyStats
);

/**
 * Selector to get all best attempts
 * @returns Array of best attempts for each topic
 */
export const selectBestAttempts = createSelector(
  [selectQuizState],
  (quizState) => quizState.bestAttempts
);

/**
 * Selector to get the best attempt for a specific topic
 * @returns Best attempt for the specified topic or undefined if not found
 */
export const selectBestAttemptByTopic = createSelector(
  [selectBestAttempts, (_state: RootState, topicId: string) => topicId],
  (bestAttempts, topicId) => bestAttempts.find(attempt => attempt.topicId === topicId)
);

/**
 * Selector to get the current active quiz state
 * @returns Active quiz state or null if no quiz is active
 */
export const selectActiveQuiz = createSelector(
  [selectQuizState],
  (quizState) => quizState.activeQuiz
); 
