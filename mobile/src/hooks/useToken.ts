import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

export const useToken = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const handleTokenExpiration = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    token,
    getAuthHeader,
    handleTokenExpiration,
  };
}; 
