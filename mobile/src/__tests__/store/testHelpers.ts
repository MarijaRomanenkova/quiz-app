import { configureStore } from '@reduxjs/toolkit';
import { Reducer } from 'redux';

/**
 * Creates a minimal test store with only the required slices
 * This avoids TypeScript issues with the full store type
 */
export const createTestStore = (sliceName: string, sliceReducer: Reducer) => {
  const mockReducers: Record<string, Reducer> = {
    [sliceName]: sliceReducer,
    // Add minimal auth state for slices that need it
    auth: (state = { token: 'test-token', user: null, isAuthenticated: false, loading: false, error: null }) => state,
  };

  return configureStore({
    reducer: mockReducers,
  });
};

/**
 * Creates a test store with multiple slices for integration testing
 */
export const createMultiSliceTestStore = (slices: Record<string, Reducer>) => {
  return configureStore({
    reducer: {
      ...slices,
      // Add minimal auth state
      auth: (state = { token: 'test-token', user: null, isAuthenticated: false, loading: false, error: null }) => state,
    },
  });
}; 
