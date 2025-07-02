/**
 * Category slice for managing quiz categories and category selection
 * 
 * This slice handles category data management and user interaction including:
 * - Category data fetching and storage from backend
 * - Category selection state management
 * - Category progress tracking and updates
 * - Integration with topic and progress slices
 * 
 * Key features:
 * - Automatic category data fetching with authentication support
 * - Category selection persistence and state management
 * - Category progress updates based on topic completion
 * - Last updated tracking for data freshness
 * - Error handling and loading states for category operations
 * 
 * State management:
 * - categories: Array of available categories with metadata
 * - selectedCategoryId: Currently selected category for navigation
 * - lastUpdated: Timestamp of last successful data fetch
 * - isLoading: Loading state for category operations
 * - error: Error state for failed operations
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { fetchCategories } from '../services/api';
import { RootState } from './index';
import { Category } from '../types';

/**
 * Async thunk to fetch categories from the backend
 * 
 * @returns Promise resolving to array of categories
 * 
 * @example
 * ```typescript
 * dispatch(fetchCategoriesThunk());
 * ```
 */
export const fetchCategoriesThunk = createAsyncThunk(
  'category/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || undefined;
    const categories = await fetchCategories(token);
    return categories;
  }
);

/**
 * Interface representing the category slice state
 */
interface CategoryState {
  /** ID of the currently selected category */
  selectedCategoryId: string | null;
  /** Array of available categories */
  categories: Category[];
  /** ISO timestamp of when categories were last updated */
  lastUpdated: string | null;
  /** Loading state for category operations */
  isLoading: boolean;
  /** Error message from category operations */
  error: string | null;
}

/**
 * Initial state for the category slice
 */
const initialState: CategoryState = {
  selectedCategoryId: null,
  categories: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
};

/**
 * Redux slice for managing categories and category selection
 * 
 * This slice handles category data fetching, category selection state,
 * and category progress tracking.
 */
export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    /**
     * Sets the currently selected category
     * @param state - Current category state
     * @param action - Category ID to select
     */
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
    },
    
    /**
     * Clears the current category selection
     * @param state - Current category state
     */
    clearCategorySelection: (state) => {
      state.selectedCategoryId = null;
    },
    
    /**
     * Updates the progress for a specific category
     * @param state - Current category state
     * @param action - Object containing category ID and progress value
     */
    updateCategoryProgress: (state, action: PayloadAction<{ categoryId: string; progress: number }>) => {
      const category = state.categories.find(cat => cat.categoryId === action.payload.categoryId);
      if (category) {
        category.progress = action.payload.progress;
      }
    },
    
    /**
     * Clears all category data
     * @param state - Current category state
     */
    clearCategoryData: (state) => {
      state.categories = [];
      state.lastUpdated = null;
      state.selectedCategoryId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { 
  setSelectedCategory,
  clearCategorySelection,
  updateCategoryProgress,
  clearCategoryData
} = categorySlice.actions;

export default categorySlice.reducer; 
