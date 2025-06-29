import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { QuizAttempt, DailyQuizTime, StatisticsState } from '../types';
import { RootState } from '../store';

/**
 * Statistics state interface
 * @interface StatisticsState
 * @property {QuizAttempt[]} attempts - Array of quiz attempts
 * @property {number} totalAttempts - Total number of attempts made
 * @property {DailyQuizTime[]} dailyQuizTimes - Array of daily quiz time entries
 * @property {number} totalQuizMinutes - Total minutes spent on quizzes
 * @property {string | null} currentSessionStart - ISO timestamp when current quiz session started
 */
// interfaces moved to types/index.ts

/**
 * Initial state for the statistics slice
 */
const initialState: StatisticsState = {
  attempts: [],
  totalAttempts: 0,
  dailyQuizTimes: [],
  totalQuizMinutes: 0,
  currentSessionStart: null,
};

/**
 * Redux slice for managing quiz statistics and learning analytics
 * 
 * This slice handles quiz attempts, daily quiz time tracking, session management,
 * and provides selectors for processed statistics data used in progress screens.
 */
export const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    /**
     * Adds a new quiz attempt to the statistics
     * @param state - Current statistics state
     * @param action - Quiz attempt data to add
     */
    addAttempt: (state, action: PayloadAction<QuizAttempt>) => {
      state.attempts.push(action.payload);
      state.totalAttempts += 1;
    },

    /**
     * Starts a new quiz session timer
     * Records the current timestamp to track session duration
     * @param state - Current statistics state
     */
    startQuizSession: (state) => {
      state.currentSessionStart = new Date().toISOString();
    },

    /**
     * Ends the current quiz session and saves the time to daily statistics
     * Calculates session duration and updates daily quiz time tracking
     * @param state - Current statistics state
     */
    endQuizSession: (state) => {
      if (state.currentSessionStart) {
        const sessionEnd = new Date();
        const sessionStart = new Date(state.currentSessionStart);
        const sessionMinutes = Math.round((sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60));
        
        // Save to daily times
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const existingEntry = state.dailyQuizTimes.find(entry => entry.date === today);
        
        if (existingEntry) {
          existingEntry.minutes += sessionMinutes;
          existingEntry.lastUpdated = sessionEnd.toISOString();
        } else {
          state.dailyQuizTimes.push({
            date: today,
            minutes: sessionMinutes,
            lastUpdated: sessionEnd.toISOString(),
          });
        }
        
        // Update total minutes
        state.totalQuizMinutes += sessionMinutes;
        
        // Reset session
        state.currentSessionStart = null;
      }
    },

    /**
     * Adds minutes to today's quiz time (for manual time tracking)
     * @param state - Current statistics state
     * @param action - Number of minutes to add
     */
    addQuizMinutes: (state, action: PayloadAction<number>) => {
      const minutes = action.payload;
      
      // Add to daily times
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = state.dailyQuizTimes.find(entry => entry.date === today);
      
      if (existingEntry) {
        existingEntry.minutes += minutes;
        existingEntry.lastUpdated = new Date().toISOString();
      } else {
        state.dailyQuizTimes.push({
          date: today,
          minutes: minutes,
          lastUpdated: new Date().toISOString(),
        });
      }
      
      state.totalQuizMinutes += minutes;
    },

    /**
     * Sets quiz time for a specific date (for data import/sync)
     * @param state - Current statistics state
     * @param action - Object containing date and minutes
     */
    setDailyQuizTime: (state, action: PayloadAction<{ date: string; minutes: number }>) => {
      const { date, minutes } = action.payload;
      const existingEntry = state.dailyQuizTimes.find(entry => entry.date === date);
      
      if (existingEntry) {
        // Update existing entry
        const oldMinutes = existingEntry.minutes;
        existingEntry.minutes = minutes;
        existingEntry.lastUpdated = new Date().toISOString();
        state.totalQuizMinutes = state.totalQuizMinutes - oldMinutes + minutes;
      } else {
        // Add new entry
        state.dailyQuizTimes.push({
          date,
          minutes,
          lastUpdated: new Date().toISOString(),
        });
        state.totalQuizMinutes += minutes;
      }
    },

    /**
     * Resets all quiz time data
     * @param state - Current statistics state
     */
    resetQuizTime: (state) => {
      state.dailyQuizTimes = [];
      state.totalQuizMinutes = 0;
      state.currentSessionStart = null;
    },

    /**
     * Loads quiz time data from backend (on login)
     * @param state - Current statistics state
     * @param action - Object containing daily quiz times and total minutes
     */
    loadQuizTimeData: (state, action: PayloadAction<{ dailyQuizTimes: DailyQuizTime[]; totalQuizMinutes: number }>) => {
      state.dailyQuizTimes = action.payload.dailyQuizTimes;
      state.totalQuizMinutes = action.payload.totalQuizMinutes;
    },
  },
});

export const {
  addAttempt,
  startQuizSession,
  endQuizSession,
  addQuizMinutes,
  setDailyQuizTime,
  resetQuizTime,
  loadQuizTimeData,
} = statisticsSlice.actions;

/**
 * Selector to get quiz time for a specific date
 * @param state - Root state containing statistics
 * @param date - Date string in YYYY-MM-DD format
 * @returns Number of minutes spent on quizzes for the given date
 */
export const selectDailyQuizTime = (state: { statistics: StatisticsState }, date: string) => {
  if (!state.statistics || !state.statistics.dailyQuizTimes) {
    return 0;
  }
  const entry = state.statistics.dailyQuizTimes.find(entry => entry.date === date);
  return entry ? entry.minutes : 0;
};

/**
 * Selector to get quiz time for a date range
 * @param state - Root state containing statistics
 * @param startDate - Start date string in YYYY-MM-DD format
 * @param endDate - End date string in YYYY-MM-DD format
 * @returns Array of daily quiz time entries within the date range
 */
export const selectWeeklyQuizTime = (state: { statistics: StatisticsState }, startDate: string, endDate: string) => {
  if (!state.statistics || !state.statistics.dailyQuizTimes) {
    return [];
  }
  return state.statistics.dailyQuizTimes.filter(entry => 
    entry.date >= startDate && entry.date <= endDate
  );
};

/**
 * Selector to get total quiz minutes across all time
 * @param state - Root state containing statistics
 * @returns Total number of minutes spent on quizzes
 */
export const selectTotalQuizMinutes = (state: { statistics: StatisticsState }) => {
  return state.statistics?.totalQuizMinutes || 0;
};

/**
 * Selector to check if a quiz session is currently active
 * @param state - Root state containing statistics
 * @returns Boolean indicating if a quiz session is in progress
 */
export const selectIsQuizSessionActive = (state: { statistics: StatisticsState }) => {
  return state.statistics?.currentSessionStart !== null;
};

/**
 * Utility function to get current week's quiz data
 * @param dailyQuizTimes - Array of daily quiz time entries
 * @returns Array of quiz time data for the current week (Monday to Sunday)
 */
const getCurrentWeekData = (dailyQuizTimes: DailyQuizTime[]) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  
  const weekData = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Get quiz time for this day from Redux
    const minutes = dailyQuizTimes?.find(entry => entry.date === dateString)?.minutes || 0;
    
    weekData.push({
      minutes: minutes,
      date: dateString
    });
  }
  
  return weekData;
};

/**
 * Utility function to get last 5 weeks' quiz data
 * @param dailyQuizTimes - Array of daily quiz time entries
 * @returns Array of weekly quiz time data for the last 5 weeks
 */
const getLastFiveWeeksData = (dailyQuizTimes: DailyQuizTime[]) => {
  const today = new Date();
  const weekData = [];
  
  for (let i = 4; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const startDateString = weekStart.toISOString().split('T')[0];
    const endDateString = weekEnd.toISOString().split('T')[0];
    
    // Get weekly quiz time from Redux
    const weekEntries = dailyQuizTimes?.filter(entry => 
      entry.date >= startDateString && entry.date <= endDateString
    ) || [];
    const totalMinutes = weekEntries.reduce((sum, entry) => sum + entry.minutes, 0);
    
    const weekLabel = `Week ${5 - i}`;
    weekData.push({
      week: weekLabel,
      minutes: totalMinutes
    });
  }
  
  return weekData;
};

/**
 * Utility function to get current month's total quiz time
 * @param dailyQuizTimes - Array of daily quiz time entries
 * @returns Total minutes spent on quizzes in the current month
 */
const getCurrentMonthTotal = (dailyQuizTimes: DailyQuizTime[]) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayString = firstDayOfMonth.toISOString().split('T')[0];
  const todayString = today.toISOString().split('T')[0];
  
  const monthEntries = dailyQuizTimes?.filter(entry => 
    entry.date >= firstDayString && entry.date <= todayString
  ) || [];
  
  return monthEntries.reduce((sum, entry) => sum + entry.minutes, 0);
};

/**
 * Selector for current week's quiz data
 * @returns Array of quiz time data for the current week (Monday to Sunday)
 */
export const selectCurrentWeekData = createSelector(
  [(state: RootState) => state.statistics?.dailyQuizTimes],
  (dailyQuizTimes) => getCurrentWeekData(dailyQuizTimes || [])
);

/**
 * Selector for last 5 weeks' quiz data
 * @returns Array of weekly quiz time data for the last 5 weeks
 */
export const selectLastFiveWeeksData = createSelector(
  [(state: RootState) => state.statistics?.dailyQuizTimes],
  (dailyQuizTimes) => getLastFiveWeeksData(dailyQuizTimes || [])
);

/**
 * Selector for current month's total quiz time
 * @returns Total minutes spent on quizzes in the current month
 */
export const selectCurrentMonthTotal = createSelector(
  [(state: RootState) => state.statistics?.dailyQuizTimes],
  (dailyQuizTimes) => getCurrentMonthTotal(dailyQuizTimes || [])
);

/**
 * Selector for current week's total quiz time
 * @returns Total minutes spent on quizzes in the current week
 */
export const selectCurrentWeekTotal = createSelector(
  [selectCurrentWeekData],
  (weekData) => weekData.reduce((sum, item) => sum + item.minutes, 0)
);

/**
 * Utility function to calculate level progress
 * @param state - Root state
 * @returns Object containing level progress information
 */
const getLevelProgress = (state: RootState) => {
  const topics = state.topic.topics;
  const topicProgress = state.progress.topicProgress;
  const user = state.auth.user;
  
  if (!user?.levelId) {
    return {
      level: user?.levelId || '',
      completedTopics: 0,
      totalTopics: 0,
      percentage: 0
    };
  }
  
  // All topics in the slice are already for the user's level (backend filtered)
  const totalTopics = topics.length;
  
  // Count completed topics for this level
  const completedTopics = topics.filter(topic => 
    topicProgress[topic.topicId]?.completed
  ).length;
  
  const percentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  
  return {
    level: user.levelId, // Use levelId directly as it already contains the level name
    completedTopics,
    totalTopics,
    percentage: Math.round(percentage)
  };
};

/**
 * Utility function to calculate study pace goal
 * @param studyPaceId - User's study pace ID (1=Relaxed, 2=Moderate, 3=Intensive)
 * @returns Weekly goal in minutes based on study pace
 */
const getStudyPaceGoal = (studyPaceId: number): number => {
  // Total level completion time: 40 hours = 2400 minutes
  const TOTAL_LEVEL_MINUTES = 2400;
  
  // Study pace weeks mapping
  const studyPaceWeeks: Record<number, number> = {
    1: 12, // Relaxed: 12 weeks
    2: 6,  // Moderate: 6 weeks  
    3: 3   // Intensive: 3 weeks
  };
  
  const weeks = studyPaceWeeks[studyPaceId] || 6; // Default to moderate
  return Math.round(TOTAL_LEVEL_MINUTES / weeks);
};

/**
 * Selector for level progress information
 * @returns Object containing level progress details
 */
export const selectLevelProgress = createSelector(
  [(state: RootState) => state.topic.topics,
   (state: RootState) => state.progress.topicProgress,
   (state: RootState) => state.auth.user],
  (topics, topicProgress, user) => {
    // Get levelId from user or from first topic if user doesn't have it
    const levelId = user?.levelId || topics[0]?.levelId || '';
    
    if (!levelId) {
      return {
        level: '',
        completedTopics: 0,
        totalTopics: 0,
        percentage: 0
      };
    }
    
    // All topics in the slice are already for the user's level (backend filtered)
    const totalTopics = topics.length;
    
    // Count completed topics for this level
    const completedTopics = topics.filter(topic => 
      topicProgress[topic.topicId]?.completed
    ).length;
    
    const percentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    
    return {
      level: levelId, // Use levelId from user or topics
      completedTopics,
      totalTopics,
      percentage: Math.round(percentage)
    };
  }
);

/**
 * Selector for level completion percentage
 * @returns Percentage of level completion (0-100)
 */
export const selectLevelCompletionPercentage = createSelector(
  [selectLevelProgress],
  (levelProgress) => levelProgress.percentage
);

/**
 * Selector for level information
 * @returns Object containing level name and topic counts
 */
export const selectLevelInfo = createSelector(
  [selectLevelProgress],
  (progress) => ({
    level: progress.level,
    completedTopics: progress.completedTopics,
    totalTopics: progress.totalTopics
  })
);

/**
 * Selector for weekly goal progress
 * @returns Object containing weekly goal information and progress
 */
export const selectWeeklyGoalProgress = createSelector(
  [(state: RootState) => state.auth.user,
   (state: RootState) => state.statistics?.dailyQuizTimes],
  (user, dailyQuizTimes) => {
    const currentWeekTotal = getCurrentWeekData(dailyQuizTimes || []).reduce((sum, item) => sum + item.minutes, 0);
    
    if (!user?.studyPaceId) {
      return {
        weeklyGoal: 0,
        currentWeekTotal: 0,
        difference: 0,
        percentage: 0
      };
    }
    
    const weeklyGoal = getStudyPaceGoal(user.studyPaceId);
    const difference = currentWeekTotal - weeklyGoal;
    const percentage = weeklyGoal > 0 ? Math.round((currentWeekTotal / weeklyGoal) * 100) : 0;
    
    return {
      weeklyGoal,
      currentWeekTotal,
      difference,
      percentage
    };
  }
);

/**
 * Selector for monthly goal progress
 * @returns Object containing monthly goal information and progress
 */
export const selectMonthlyGoalProgress = createSelector(
  [(state: RootState) => state.auth.user,
   (state: RootState) => state.statistics?.dailyQuizTimes],
  (user, dailyQuizTimes) => {
    const currentMonthTotal = getCurrentMonthTotal(dailyQuizTimes || []);
    
    if (!user?.studyPaceId) {
      return {
        monthlyGoal: 0,
        currentMonthTotal: 0,
        difference: 0,
        percentage: 0
      };
    }
    
    const weeklyGoal = getStudyPaceGoal(user.studyPaceId);
    const monthlyGoal = weeklyGoal * 4; // 4 weeks per month
    const difference = currentMonthTotal - monthlyGoal;
    const percentage = monthlyGoal > 0 ? Math.round((currentMonthTotal / monthlyGoal) * 100) : 0;
    
    return {
      monthlyGoal,
      currentMonthTotal,
      difference,
      percentage
    };
  }
);

export default statisticsSlice.reducer;
