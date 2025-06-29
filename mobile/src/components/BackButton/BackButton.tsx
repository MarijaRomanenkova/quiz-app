/**
 * @fileoverview Back Button component for the mobile application
 * 
 * This component provides a consistent back button interface across the app
 * with proper navigation handling and styling. It can be used in any screen
 * that needs navigation back functionality.
 * 
 * The component includes:
 * - Consistent styling with the app theme
 * - Navigation back functionality
 * - Optional custom onPress handler
 * - Proper accessibility support
 * 
 * @module components/BackButton
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

/**
 * Available button variants with their respective color schemes
 * 
 * @typedef {'dark' | 'light'} BackButtonVariant
 */
type BackButtonVariant = 'dark' | 'light';

/**
 * Props interface for the BackButton component
 * 
 * @interface BackButtonProps
 * @property {() => void} [onPress] - Optional custom onPress handler
 * @property {BackButtonVariant} [variant='dark'] - Button color variant for different backgrounds
 * @property {number} [size] - Optional size for the icon (default: 32)
 * @property {string} [text] - Optional text to display next to the icon
 * @property {any} [style] - Optional additional styles
 */
interface BackButtonProps {
  onPress?: () => void;
  variant?: BackButtonVariant;
  size?: number;
  text?: string;
  style?: any;
}

/**
 * Back Button component for navigation
 * 
 * Provides a consistent back button with proper navigation handling.
 * Uses the default navigation back behavior unless a custom onPress
 * handler is provided.
 * 
 * @param {BackButtonProps} props - The back button props
 * @param {() => void} [props.onPress] - Optional custom onPress handler
 * @param {BackButtonVariant} [props.variant] - Button color variant for different backgrounds
 * @param {number} [props.size] - Optional size for the icon (default: 32)
 * @param {string} [props.text] - Optional text to display next to the icon
 * @param {any} [props.style] - Optional additional styles
 * @returns {JSX.Element} A styled back button component
 * 
 * @example
 * ```tsx
 * // Basic usage with default navigation back
 * <BackButton />
 * 
 * // Custom onPress handler
 * <BackButton onPress={() => console.log('Custom back action')} />
 * 
 * // Custom styling
 * <BackButton variant="light" size={32} />
 * ```
 */
export const BackButton = ({ 
  onPress, 
  variant = 'dark', 
  size = 32, 
  text, 
  style 
}: BackButtonProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name="chevron-left" 
        size={size} 
        color={variant === 'dark' ? theme.colors.surface : theme.colors.outline} 
      />
      {text && (
        <Text 
          style={[
            styles.text, 
            { color: variant === 'dark' ? theme.colors.surface : theme.colors.outline }
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    minWidth: 44,
    minHeight: 44,
  },
  text: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: 'Baloo2-SemiBold',
  },
}); 
