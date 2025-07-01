import { configureStore } from '@reduxjs/toolkit';
import categorySlice, { 
  fetchCategoriesThunk,
  setSelectedCategory,
  clearCategorySelection,
  updateCategoryProgress,
  clearCategoryData
} from '../../store/categorySlice';
import { fetchCategories } from '../../services/api';
import { createTestStore } from './testHelpers';

// Mock the API service
jest.mock('../../services/api');
const mockFetchCategories = fetchCategories as jest.MockedFunction<typeof fetchCategories>;

// Define Category interface to match the API service
interface Category {
  categoryId: string;
  title: string;
  description: string;
  progress: number;
}

describe('categorySlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore('category', categorySlice);
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().category;
      expect(state).toEqual({
        selectedCategoryId: null,
        categories: [],
        lastUpdated: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    describe('setSelectedCategory', () => {
      it('should set the selected category ID', () => {
        const categoryId = 'test-category';
        store.dispatch(setSelectedCategory(categoryId));
        
        const state = store.getState().category;
        expect(state.selectedCategoryId).toBe(categoryId);
      });
    });

    describe('clearCategorySelection', () => {
      it('should clear the selected category ID', () => {
        // First set a category
        store.dispatch(setSelectedCategory('test-category'));
        expect(store.getState().category.selectedCategoryId).toBe('test-category');
        
        // Then clear it
        store.dispatch(clearCategorySelection());
        expect(store.getState().category.selectedCategoryId).toBeNull();
      });
    });

    describe('updateCategoryProgress', () => {
      it('should update progress for an existing category', () => {
        const mockCategories: Category[] = [
          { categoryId: 'test-category', progress: 0, title: 'Test Category', description: 'Test Category' }
        ];
        
        // Set up initial state with categories
        store.dispatch({
          type: 'category/fetchCategories/fulfilled',
          payload: mockCategories
        });
        
        // Update progress
        store.dispatch(updateCategoryProgress({ categoryId: 'test-category', progress: 75 }));
        
        const state = store.getState().category;
        const category = state.categories.find((cat: Category) => cat.categoryId === 'test-category');
        expect(category?.progress).toBe(75);
      });

      it('should not update progress for non-existent category', () => {
        const mockCategories: Category[] = [
          { categoryId: 'test-category', progress: 0, title: 'Test Category', description: 'Test Category' }
        ];
        
        // Set up initial state with categories
        store.dispatch({
          type: 'category/fetchCategories/fulfilled',
          payload: mockCategories
        });
        
        // Try to update progress for non-existent category
        store.dispatch(updateCategoryProgress({ categoryId: 'non-existent', progress: 75 }));
        
        const state = store.getState().category;
        expect(state.categories).toEqual(mockCategories); // Should remain unchanged
      });
    });

    describe('clearCategoryData', () => {
      it('should clear all category data', () => {
        // Set up some data first
        store.dispatch(setSelectedCategory('test-category'));
        store.dispatch({
          type: 'category/fetchCategories/fulfilled',
          payload: [{ categoryId: 'test', progress: 50, title: 'Test', description: 'Test' }]
        });
        
        // Clear the data
        store.dispatch(clearCategoryData());
        
        const state = store.getState().category;
        expect(state.selectedCategoryId).toBeNull();
        expect(state.categories).toEqual([]);
        expect(state.lastUpdated).toBeNull();
        expect(state.error).toBeNull();
      });
    });
  });

  describe('async thunks', () => {
    describe('fetchCategoriesThunk', () => {
      it('should handle pending state', () => {
        store.dispatch(fetchCategoriesThunk.pending('', undefined));
        
        const state = store.getState().category;
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const mockCategories: Category[] = [
          { categoryId: 'category1', progress: 0, title: 'Category 1', description: 'Category 1' },
          { categoryId: 'category2', progress: 50, title: 'Category 2', description: 'Category 2' }
        ];
        
        store.dispatch(fetchCategoriesThunk.fulfilled(mockCategories, '', undefined));
        
        const state = store.getState().category;
        expect(state.isLoading).toBe(false);
        expect(state.categories).toEqual(mockCategories);
        expect(state.lastUpdated).toBeDefined();
        expect(state.error).toBeNull();
      });

      it('should handle rejected state', () => {
        const errorMessage = 'Failed to fetch categories';
        store.dispatch(fetchCategoriesThunk.rejected(new Error(errorMessage), '', undefined, errorMessage));
        
        const state = store.getState().category;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('should call fetchCategories with token', async () => {
        const mockCategories: Category[] = [{ categoryId: 'test', progress: 0, title: 'Test', description: 'Test' }];
        mockFetchCategories.mockResolvedValue(mockCategories);
        
        await store.dispatch(fetchCategoriesThunk());
        
        expect(mockFetchCategories).toHaveBeenCalledWith('test-token');
      });

      it('should handle API errors gracefully', async () => {
        const errorMessage = 'Network error';
        mockFetchCategories.mockRejectedValue(new Error(errorMessage));
        
        await store.dispatch(fetchCategoriesThunk());
        
        const state = store.getState().category;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });
  });

  describe('extra reducers', () => {
    it('should handle fetchCategoriesThunk.pending', () => {
      store.dispatch(fetchCategoriesThunk.pending('', undefined));
      
      const state = store.getState().category;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchCategoriesThunk.fulfilled', () => {
      const mockCategories: Category[] = [{ categoryId: 'test', progress: 0, title: 'Test', description: 'Test' }];
      store.dispatch(fetchCategoriesThunk.fulfilled(mockCategories, '', undefined));
      
      const state = store.getState().category;
      expect(state.isLoading).toBe(false);
      expect(state.categories).toEqual(mockCategories);
      expect(state.lastUpdated).toBeDefined();
    });

    it('should handle fetchCategoriesThunk.rejected', () => {
      const errorMessage = 'Failed to fetch';
      store.dispatch(fetchCategoriesThunk.rejected(new Error(errorMessage), '', undefined, errorMessage));
      
      const state = store.getState().category;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should use default error message when no error message provided', () => {
      store.dispatch(fetchCategoriesThunk.rejected(new Error(), '', undefined));
      
      const state = store.getState().category;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch categories');
    });
  });
}); 
