import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '../types';
import { fetchCategories } from '../services/api';

// Async thunks
export const fetchCategoriesThunk = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const categories = await fetchCategories();
    return categories;
  }
);

interface CategoryState {
  selectedCategoryId: string | null;
  categories: Category[];
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  selectedCategoryId: null,
  categories: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
    },
    clearCategorySelection: (state) => {
      state.selectedCategoryId = null;
    },
    updateCategoryProgress: (state, action: PayloadAction<{ categoryId: string; progress: number }>) => {
      const category = state.categories.find(cat => cat.categoryId === action.payload.categoryId);
      if (category) {
        category.progress = action.payload.progress;
      }
    },
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
