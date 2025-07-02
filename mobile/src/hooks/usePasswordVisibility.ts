/**
 * @fileoverview Password Visibility Toggle Hook
 * 
 * This hook provides a reusable way to handle password visibility toggles
 * across different forms, eliminating code duplication and providing
 * consistent password field behavior throughout the application.
 * 
 * The hook manages the visibility state of password fields and provides
 * a toggle function that can be easily integrated with React Native Paper's
 * TextInput component and other input components.
 * 
 * Key Features:
 * - Simple visibility state management
 * - Toggle function for password visibility
 * - Integration with React Native Paper TextInput
 * - Consistent behavior across forms
 * 
 * @module hooks/usePasswordVisibility
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing password visibility state
 * 
 * This hook provides a reusable way to handle password visibility toggles
 * across different forms, eliminating code duplication and providing
 * consistent password field behavior throughout the application.
 * 
 * The hook manages a boolean state for password visibility and provides
 * a toggle function that can be easily integrated with input components.
 * It's designed to work seamlessly with React Native Paper's TextInput
 * component and other input libraries.
 * 
 * @returns {Object} Object containing visibility state and toggle function
 * @returns {boolean} returns.showPassword - Current password visibility state
 * @returns {() => void} returns.togglePasswordVisibility - Function to toggle password visibility
 * 
 * @example
 * ```tsx
 * // Basic usage with React Native Paper TextInput
 * const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
 * 
 * <TextInput
 *   label="Password"
 *   secureTextEntry={!showPassword}
 *   right={
 *     <TextInput.Icon
 *       icon={showPassword ? "eye-off" : "eye"}
 *       onPress={togglePasswordVisibility}
 *     />
 *   }
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with custom icon and styling
 * const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
 * 
 * <TextInput
 *   label="Confirm Password"
 *   secureTextEntry={!showPassword}
 *   right={
 *     <TouchableOpacity onPress={togglePasswordVisibility}>
 *       <MaterialCommunityIcons
 *         name={showPassword ? "eye-off" : "eye"}
 *         size={24}
 *         color={theme.colors.outline}
 *       />
 *     </TouchableOpacity>
 *   }
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Usage in a form with multiple password fields
 * const LoginForm = () => {
 *   const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
 *   const [password, setPassword] = useState('');
 * 
 *   return (
 *     <View>
 *       <TextInput
 *         label="Password"
 *         value={password}
 *         onChangeText={setPassword}
 *         secureTextEntry={!showPassword}
 *         right={
 *           <TextInput.Icon
 *             icon={showPassword ? "eye-off" : "eye"}
 *             onPress={togglePasswordVisibility}
 *           />
 *         }
 *       />
 *     </View>
 *   );
 * };
 * ```
 */
export const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return {
    /** Current password visibility state (true = visible, false = hidden) */
    showPassword,
    /** Function to toggle password visibility state */
    togglePasswordVisibility,
  };
}; 
