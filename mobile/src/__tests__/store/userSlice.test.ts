import userSlice, { 
  setUser,
  updateUserProfile,
  updateUserPreferences,
  clearUser,
  setLoading,
  setError
} from '../../store/userSlice';
import { createTestStore } from './testHelpers';
import { User } from '../../types/user.types';

describe('userSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore('user', userSlice);
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().user;
      expect(state).toEqual({
        user: null,
        loading: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    describe('setUser', () => {
      it('should set the complete user data', () => {
        const mockUser: User = {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          levelId: 'beginner',
          studyPaceId: 1,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: true,
          emailVerified: true
        };

        store.dispatch(setUser(mockUser));
        
        const state = store.getState().user;
        expect(state.user).toEqual(mockUser);
        expect(state.error).toBeNull();
      });

      it('should clear error when setting user', () => {
        // First set an error
        store.dispatch(setError('Some error'));
        expect(store.getState().user.error).toBe('Some error');
        
        // Then set user
        const mockUser: User = {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          levelId: 'beginner',
          studyPaceId: 1,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: true,
          emailVerified: true
        };
        
        store.dispatch(setUser(mockUser));
        expect(store.getState().user.error).toBeNull();
      });
    });

    describe('updateUserProfile', () => {
      it('should update specific user profile fields', () => {
        const initialUser: User = {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          levelId: 'beginner',
          studyPaceId: 1,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: true,
          emailVerified: true
        };

        store.dispatch(setUser(initialUser));
        
        // Update specific fields
        store.dispatch(updateUserProfile({ 
          username: 'updateduser',
          email: 'updated@example.com'
        }));
        
        const state = store.getState().user;
        expect(state.user?.username).toBe('updateduser');
        expect(state.user?.email).toBe('updated@example.com');
        expect(state.user?.studyPaceId).toBe(1); // Should remain unchanged
      });

      it('should not update user if no user exists', () => {
        store.dispatch(updateUserProfile({ username: 'newuser' }));
        
        const state = store.getState().user;
        expect(state.user).toBeNull();
      });
    });

    describe('updateUserPreferences', () => {
      it('should update user preferences', () => {
        const initialUser: User = {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          levelId: 'beginner',
          studyPaceId: 1,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: true,
          emailVerified: true
        };

        store.dispatch(setUser(initialUser));
        
        // Update preferences
        store.dispatch(updateUserPreferences({
          studyPaceId: 2,
          marketingEmails: true,
          shareDevices: false
        }));
        
        const state = store.getState().user;
        expect(state.user?.studyPaceId).toBe(2);
        expect(state.user?.marketingEmails).toBe(true);
        expect(state.user?.shareDevices).toBe(false);
        expect(state.user?.username).toBe('testuser'); // Should remain unchanged
      });

      it('should not update preferences if no user exists', () => {
        store.dispatch(updateUserPreferences({ studyPaceId: 2 }));
        
        const state = store.getState().user;
        expect(state.user).toBeNull();
      });
    });

    describe('clearUser', () => {
      it('should clear all user data', () => {
        const mockUser: User = {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          levelId: 'beginner',
          studyPaceId: 1,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: true,
          emailVerified: true
        };

        store.dispatch(setUser(mockUser));
        store.dispatch(setError('Some error'));
        
        // Clear user data
        store.dispatch(clearUser());
        
        const state = store.getState().user;
        expect(state.user).toBeNull();
        expect(state.error).toBeNull();
      });
    });

    describe('setLoading', () => {
      it('should set the loading state', () => {
        store.dispatch(setLoading(true));
        expect(store.getState().user.loading).toBe(true);
        
        store.dispatch(setLoading(false));
        expect(store.getState().user.loading).toBe(false);
      });
    });

    describe('setError', () => {
      it('should set the error message', () => {
        const errorMessage = 'Something went wrong';
        store.dispatch(setError(errorMessage));
        
        const state = store.getState().user;
        expect(state.error).toBe(errorMessage);
      });
    });
  });

  describe('state management', () => {
    it('should handle multiple state updates correctly', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        levelId: 'beginner',
        studyPaceId: 1,
        agreedToTerms: true,
        marketingEmails: false,
        shareDevices: true,
        emailVerified: true
      };

      // Set user
      store.dispatch(setUser(mockUser));
      expect(store.getState().user.user).toEqual(mockUser);
      expect(store.getState().user.loading).toBe(false);
      expect(store.getState().user.error).toBeNull();

      // Set loading
      store.dispatch(setLoading(true));
      expect(store.getState().user.loading).toBe(true);
      expect(store.getState().user.user).toEqual(mockUser); // Should remain unchanged

      // Update profile
      store.dispatch(updateUserProfile({ username: 'updateduser' }));
      expect(store.getState().user.user?.username).toBe('updateduser');
      expect(store.getState().user.loading).toBe(true); // Should remain unchanged

      // Set error
      store.dispatch(setError('Error occurred'));
      expect(store.getState().user.error).toBe('Error occurred');
      expect(store.getState().user.user?.username).toBe('updateduser'); // Should remain unchanged

      // Clear user
      store.dispatch(clearUser());
      expect(store.getState().user.user).toBeNull();
      expect(store.getState().user.error).toBeNull();
      expect(store.getState().user.loading).toBe(true); // Should remain unchanged
    });
  });
}); 
