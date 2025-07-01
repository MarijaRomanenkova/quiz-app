import { renderHook, act } from '@testing-library/react-native';
import { useToken } from '../../hooks/useToken';
import { logout } from '../../store/authSlice';

// Mock Redux
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => mockUseSelector(selector),
}));

describe('useToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock state - no token
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes('state.auth')) {
        return null; // No token
      }
      return {};
    });
  });

  describe('initial state', () => {
    it('should return initial token state when no token exists', () => {
      const { result } = renderHook(() => useToken());

      expect(result.current.token).toBeNull();
      expect(typeof result.current.getAuthHeader).toBe('function');
      expect(typeof result.current.handleTokenExpiration).toBe('function');
    });

    it('should return token when user is authenticated', () => {
      const testToken = 'test-token-123';
      
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return testToken;
        }
        return {};
      });

      const { result } = renderHook(() => useToken());

      expect(result.current.token).toBe(testToken);
    });
  });

  describe('getAuthHeader', () => {
    it('should return empty object when no token exists', () => {
      const { result } = renderHook(() => useToken());

      const headers = result.current.getAuthHeader();

      expect(headers).toEqual({});
    });

    it('should return authorization header when token exists', () => {
      const testToken = 'test-token-123';
      
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return testToken;
        }
        return {};
      });

      const { result } = renderHook(() => useToken());

      const headers = result.current.getAuthHeader();

      expect(headers).toEqual({
        Authorization: `Bearer ${testToken}`,
      });
    });

    it('should update authorization header when token changes', () => {
      // First render: no token
      let { result, rerender } = renderHook(() => useToken());

      expect(result.current.getAuthHeader()).toEqual({});

      // Second render: with token
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return 'new-token-456';
        }
        return {};
      });

      rerender(() => useToken());

      expect(result.current.getAuthHeader()).toEqual({
        Authorization: 'Bearer new-token-456',
      });
    });
  });

  describe('handleTokenExpiration', () => {
    it('should dispatch logout action when called', () => {
      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.handleTokenExpiration();
      });

      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    it('should dispatch logout action even when no token exists', () => {
      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.handleTokenExpiration();
      });

      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    it('should dispatch logout action when token exists', () => {
      const testToken = 'test-token-123';
      
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return testToken;
        }
        return {};
      });

      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.handleTokenExpiration();
      });

      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });
  });

  describe('token state changes', () => {
    it('should update token when Redux state changes', () => {
      // First render: no token
      let { result, rerender } = renderHook(() => useToken());

      expect(result.current.token).toBeNull();

      // Second render: with token
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return 'token-123';
        }
        return {};
      });

      rerender(() => useToken());

      expect(result.current.token).toBe('token-123');
    });

    it('should update authorization header when token changes', () => {
      // First render: no token
      let { result, rerender } = renderHook(() => useToken());

      expect(result.current.getAuthHeader()).toEqual({});

      // Second render: with token
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return 'token-123';
        }
        return {};
      });

      rerender(() => useToken());

      expect(result.current.getAuthHeader()).toEqual({
        Authorization: 'Bearer token-123',
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete authentication flow', () => {
      // Initial state: no token
      let { result, rerender } = renderHook(() => useToken());

      expect(result.current.token).toBeNull();
      expect(result.current.getAuthHeader()).toEqual({});

      // Login: token received
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return 'login-token-123';
        }
        return {};
      });

      rerender(() => useToken());

      expect(result.current.token).toBe('login-token-123');
      expect(result.current.getAuthHeader()).toEqual({
        Authorization: 'Bearer login-token-123',
      });

      // Token expiration: logout
      act(() => {
        result.current.handleTokenExpiration();
      });

      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    it('should handle token refresh scenario', () => {
      // Initial token
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return 'old-token-123';
        }
        return {};
      });

      let { result, rerender } = renderHook(() => useToken());

      expect(result.current.getAuthHeader()).toEqual({
        Authorization: 'Bearer old-token-123',
      });

      // Token refreshed
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return 'new-token-456';
        }
        return {};
      });

      rerender(() => useToken());

      expect(result.current.getAuthHeader()).toEqual({
        Authorization: 'Bearer new-token-456',
      });
    });
  });
}); 
