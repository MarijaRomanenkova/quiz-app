import statisticsSlice, {
  addAttempt,
  startQuizSession,
  endQuizSession,
  addQuizMinutes,
  setDailyQuizTime,
  resetQuizTime,
  loadStatisticsData,
  selectDailyQuizTime,
  selectWeeklyQuizTime,
  selectTotalQuizMinutes,
  selectIsQuizSessionActive
} from '../../store/statisticsSlice';
import { createTestStore } from './testHelpers';

describe('statisticsSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore('statistics', statisticsSlice);
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().statistics;
      expect(state).toEqual({
        attempts: [],
        totalAttempts: 0,
        dailyQuizTimes: [],
        totalQuizMinutes: 0,
        currentSessionStart: null,
      });
    });
  });

  describe('reducers', () => {
    it('should add an attempt', () => {
      store.dispatch(addAttempt({ id: 'a1', score: 80, date: '2024-01-01' }));
      const state = store.getState().statistics;
      expect(state.attempts).toHaveLength(1);
      expect(state.totalAttempts).toBe(1);
    });

    it('should start and end a quiz session', () => {
      store.dispatch(startQuizSession());
      let state = store.getState().statistics;
      expect(state.currentSessionStart).not.toBeNull();
      store.dispatch(endQuizSession());
      state = store.getState().statistics;
      expect(state.currentSessionStart).toBeNull();
      expect(state.totalQuizMinutes).toBeGreaterThanOrEqual(1);
    });

    it('should add quiz minutes', () => {
      store.dispatch(addQuizMinutes(5));
      const state = store.getState().statistics;
      expect(state.totalQuizMinutes).toBe(5);
      expect(state.dailyQuizTimes[0].minutes).toBe(5);
    });

    it('should set daily quiz time for a specific date', () => {
      const date = '2024-01-01';
      store.dispatch(setDailyQuizTime({ date, minutes: 10 }));
      const state = store.getState().statistics;
      expect((state.dailyQuizTimes.find((e: { date: string; minutes: number; lastUpdated: string }) => e.date === date)?.minutes)).toBe(10);
      expect(state.totalQuizMinutes).toBe(10);
    });

    it('should reset quiz time', () => {
      store.dispatch(addQuizMinutes(5));
      store.dispatch(resetQuizTime());
      const state = store.getState().statistics;
      expect(state.totalQuizMinutes).toBe(0);
      expect(state.dailyQuizTimes).toEqual([]);
      expect(state.currentSessionStart).toBeNull();
    });

    it('should load statistics data', () => {
      const data = {
        dailyQuizTimes: [{ date: '2024-01-01', minutes: 10, lastUpdated: '2024-01-01T00:00:00Z' }],
        totalQuizMinutes: 10
      };
      store.dispatch(loadStatisticsData(data));
      const state = store.getState().statistics;
      expect(state.dailyQuizTimes).toEqual(data.dailyQuizTimes);
      expect(state.totalQuizMinutes).toBe(10);
    });
  });

  describe('selectors', () => {
    it('should select daily quiz time', () => {
      const date = '2024-01-01';
      store.dispatch(setDailyQuizTime({ date, minutes: 15 }));
      const minutes = selectDailyQuizTime({ statistics: store.getState().statistics }, date);
      expect(minutes).toBe(15);
    });

    it('should select weekly quiz time', () => {
      store.dispatch(setDailyQuizTime({ date: '2024-01-01', minutes: 10 }));
      store.dispatch(setDailyQuizTime({ date: '2024-01-02', minutes: 20 }));
      const week = selectWeeklyQuizTime({ statistics: store.getState().statistics }, '2024-01-01', '2024-01-07');
      expect(week).toHaveLength(2);
    });

    it('should select total quiz minutes', () => {
      store.dispatch(addQuizMinutes(5));
      store.dispatch(addQuizMinutes(10));
      const total = selectTotalQuizMinutes({ statistics: store.getState().statistics });
      expect(total).toBe(15);
    });

    it('should select if quiz session is active', () => {
      expect(selectIsQuizSessionActive({ statistics: store.getState().statistics })).toBe(false);
      store.dispatch(startQuizSession());
      expect(selectIsQuizSessionActive({ statistics: store.getState().statistics })).toBe(true);
      store.dispatch(endQuizSession());
      expect(selectIsQuizSessionActive({ statistics: store.getState().statistics })).toBe(false);
    });
  });
}); 
