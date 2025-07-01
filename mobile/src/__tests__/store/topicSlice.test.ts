import { configureStore } from '@reduxjs/toolkit';
import topicSlice, { 
  fetchTopicsThunk,
  setSelectedTopic,
  clearTopicSelection,
  selectSortedTopics
} from '../../store/topicSlice';
import { fetchTopics } from '../../services/api';
import { Topic } from '../../types';
import { createTestStore } from './testHelpers';

// Mock the API service
jest.mock('../../services/api');
const mockFetchTopics = fetchTopics as jest.MockedFunction<typeof fetchTopics>;

describe('topicSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore('topic', topicSlice);
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().topic;
      expect(state).toEqual({
        topics: [],
        selectedTopicId: null,
        isLoading: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    describe('setSelectedTopic', () => {
      it('should set the selected topic ID', () => {
        const topicId = 'test-topic';
        store.dispatch(setSelectedTopic(topicId));
        
        const state = store.getState().topic;
        expect(state.selectedTopicId).toBe(topicId);
      });
    });

    describe('clearTopicSelection', () => {
      it('should clear the selected topic ID', () => {
        // First set a topic
        store.dispatch(setSelectedTopic('test-topic'));
        expect(store.getState().topic.selectedTopicId).toBe('test-topic');
        
        // Then clear it
        store.dispatch(clearTopicSelection());
        expect(store.getState().topic.selectedTopicId).toBeNull();
      });
    });
  });

  describe('async thunks', () => {
    describe('fetchTopicsThunk', () => {
      it('should handle pending state', () => {
        store.dispatch(fetchTopicsThunk.pending('', undefined));
        
        const state = store.getState().topic;
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fulfilled state', () => {
        const mockTopics: Topic[] = [
          { topicId: 'topic1', categoryId: 'category1', levelId: 'level1', topicOrder: 1 },
          { topicId: 'topic2', categoryId: 'category1', levelId: 'level1', topicOrder: 2 }
        ];
        
        store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
        
        const state = store.getState().topic;
        expect(state.isLoading).toBe(false);
        expect(state.topics).toEqual(mockTopics);
        expect(state.error).toBeNull();
      });

      it('should handle rejected state', () => {
        const errorMessage = 'Failed to fetch topics';
        store.dispatch(fetchTopicsThunk.rejected(new Error(errorMessage), '', undefined, errorMessage));
        
        const state = store.getState().topic;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('should call fetchTopics with token', async () => {
        const mockTopics: Topic[] = [
          { topicId: 'test', categoryId: 'category1', levelId: 'level1', topicOrder: 1 }
        ];
        mockFetchTopics.mockResolvedValue(mockTopics);
        
        await store.dispatch(fetchTopicsThunk());
        
        expect(mockFetchTopics).toHaveBeenCalledWith('test-token');
      });

      it('should handle API errors gracefully', async () => {
        const errorMessage = 'Network error';
        mockFetchTopics.mockRejectedValue(new Error(errorMessage));
        
        await store.dispatch(fetchTopicsThunk());
        
        const state = store.getState().topic;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });
  });

  describe('extra reducers', () => {
    it('should handle fetchTopicsThunk.pending', () => {
      store.dispatch(fetchTopicsThunk.pending('', undefined));
      
      const state = store.getState().topic;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchTopicsThunk.fulfilled', () => {
      const mockTopics: Topic[] = [
        { topicId: 'test', categoryId: 'category1', levelId: 'level1', topicOrder: 1 }
      ];
      store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
      
      const state = store.getState().topic;
      expect(state.isLoading).toBe(false);
      expect(state.topics).toEqual(mockTopics);
    });

    it('should handle fetchTopicsThunk.rejected', () => {
      const errorMessage = 'Failed to fetch';
      store.dispatch(fetchTopicsThunk.rejected(new Error(errorMessage), '', undefined, errorMessage));
      
      const state = store.getState().topic;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should use default error message when no error message provided', () => {
      store.dispatch(fetchTopicsThunk.rejected(new Error(), '', undefined));
      
      const state = store.getState().topic;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch topics');
    });
  });

  describe('selectors', () => {
    describe('selectSortedTopics', () => {
      it('should return topics sorted by topicOrder, categoryId, and topicId', () => {
        const mockTopics: Topic[] = [
          { topicId: 'topic3', categoryId: 'category2', levelId: 'level1', topicOrder: 1 },
          { topicId: 'topic1', categoryId: 'category1', levelId: 'level1', topicOrder: 2 },
          { topicId: 'topic2', categoryId: 'category1', levelId: 'level1', topicOrder: 1 },
          { topicId: 'topic4', categoryId: 'category2', levelId: 'level1', topicOrder: 2 }
        ];
        
        // Set up state with topics
        store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
        
        const sortedTopics = selectSortedTopics(store.getState() as any);
        
        // Sorting logic: topicOrder first, then categoryId alphabetically, then topicId alphabetically
        // topic2 (order:1, category:category1, id:topic2)
        // topic3 (order:1, category:category2, id:topic3) 
        // topic1 (order:2, category:category1, id:topic1)
        // topic4 (order:2, category:category2, id:topic4)
        expect(sortedTopics[0].topicId).toBe('topic2');
        expect(sortedTopics[1].topicId).toBe('topic3');
        expect(sortedTopics[2].topicId).toBe('topic1');
        expect(sortedTopics[3].topicId).toBe('topic4');
      });

      it('should handle empty topics array', () => {
        store.dispatch(fetchTopicsThunk.fulfilled([], '', undefined));
        
        const sortedTopics = selectSortedTopics(store.getState() as any);
        expect(sortedTopics).toEqual([]);
      });

      it('should handle single topic', () => {
        const mockTopics: Topic[] = [
          { topicId: 'topic1', categoryId: 'category1', levelId: 'level1', topicOrder: 1 }
        ];
        
        store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
        
        const sortedTopics = selectSortedTopics(store.getState() as any);
        expect(sortedTopics).toEqual(mockTopics);
      });

      it('should sort by topicOrder first', () => {
        const mockTopics: Topic[] = [
          { topicId: 'topic2', categoryId: 'category1', levelId: 'level1', topicOrder: 2 },
          { topicId: 'topic1', categoryId: 'category1', levelId: 'level1', topicOrder: 1 }
        ];
        
        store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
        
        const sortedTopics = selectSortedTopics(store.getState() as any);
        expect(sortedTopics[0].topicOrder).toBe(1);
        expect(sortedTopics[1].topicOrder).toBe(2);
      });

      it('should sort by categoryId when topicOrder is equal', () => {
        const mockTopics: Topic[] = [
          { topicId: 'topic2', categoryId: 'category2', levelId: 'level1', topicOrder: 1 },
          { topicId: 'topic1', categoryId: 'category1', levelId: 'level1', topicOrder: 1 }
        ];
        
        store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
        
        const sortedTopics = selectSortedTopics(store.getState() as any);
        expect(sortedTopics[0].categoryId).toBe('category1');
        expect(sortedTopics[1].categoryId).toBe('category2');
      });

      it('should sort by topicId when topicOrder and categoryId are equal', () => {
        const mockTopics: Topic[] = [
          { topicId: 'topic2', categoryId: 'category1', levelId: 'level1', topicOrder: 1 },
          { topicId: 'topic1', categoryId: 'category1', levelId: 'level1', topicOrder: 1 }
        ];
        
        store.dispatch(fetchTopicsThunk.fulfilled(mockTopics, '', undefined));
        
        const sortedTopics = selectSortedTopics(store.getState() as any);
        expect(sortedTopics[0].topicId).toBe('topic1');
        expect(sortedTopics[1].topicId).toBe('topic2');
      });
    });
  });
}); 
