import { store } from '../store';
import { setCredentials } from '../store/authSlice';

// Mock user data for development
const mockUser = {
  id: 'dev-user-1',
  email: 'dev@example.com',
  username: 'devuser',
  emailVerified: true,
  levelId: 'A1.1'
};

// Mock token for development
const mockToken = 'dev-token-123';

// Function to set development authentication
export const setDevAuth = () => {
  store.dispatch(setCredentials({
    token: mockToken,
    user: mockUser,
  }));
};

// Function to check if we're in development mode
export const isDevMode = () => {
  return __DEV__;
};

// Auto-set dev auth if in development mode
if (isDevMode()) {
  setDevAuth();
} 
