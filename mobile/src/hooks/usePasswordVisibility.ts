import { useState, useCallback } from 'react';

/**
 * Custom hook for managing password visibility state
 * 
 * This hook provides a reusable way to handle password visibility toggles
 * across different forms, eliminating code duplication.
 * 
 * @returns Object containing visibility state and toggle function
 * 
 * @example
 * ```tsx
 * const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
 * 
 * <TextInput
 *   secureTextEntry={!showPassword}
 *   right={
 *     <TextInput.Icon
 *       icon={showPassword ? "eye-off" : "eye"}
 *       onPress={togglePasswordVisibility}
 *     />
 *   }
 * />
 * ```
 */
export const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return {
    showPassword,
    togglePasswordVisibility,
  };
}; 
