import { StyleSheet } from 'react-native';
import { theme, fonts, spacing, layout } from '../theme';

/**
 * Theme utility functions for creating consistent styles
 * 
 * These utilities work with your existing theme system to help
 * create consistent styles without duplication across components.
 * 
 * @module utils/themeUtils
 */

/**
 * Creates common card styles using theme values
 * 
 * @param variant - Card variant ('default', 'selected', 'elevated')
 * @returns StyleSheet object with card styles
 */
export const createCardStyles = (variant: 'default' | 'selected' | 'elevated' = 'default') => {
  const baseCard = {
    backgroundColor: theme.colors.surface,
    borderRadius: layout.borderRadius.large,
    padding: spacing.md,
    marginVertical: spacing.sm,
  };

  switch (variant) {
    case 'selected':
      return StyleSheet.create({
        card: {
          ...baseCard,
          ...layout.shadow.medium,
          borderWidth: 2,
          borderColor: theme.colors.primary,
        },
      });
    case 'elevated':
      return StyleSheet.create({
        card: {
          ...baseCard,
          ...layout.shadow.large,
        },
      });
    default:
      return StyleSheet.create({
        card: {
          ...baseCard,
          ...layout.shadow.small,
        },
      });
  }
};

/**
 * Creates common text styles using theme fonts
 * 
 * @param size - Font size from theme
 * @param weight - Font weight from theme
 * @param color - Text color (defaults to surface color)
 * @returns StyleSheet object with text styles
 */
export const createTextStyles = (
  size: keyof typeof fonts.sizes = 'medium',
  weight: keyof typeof fonts.weights = 'regular',
  color: string = theme.colors.surface
) => {
  return StyleSheet.create({
    text: {
      fontSize: fonts.sizes[size],
      fontFamily: fonts.weights[weight],
      color,
    },
  });
};

/**
 * Creates common button styles using theme values
 * 
 * @param variant - Button variant from theme
 * @returns StyleSheet object with button styles
 */
export const createButtonStyles = (variant: keyof typeof theme.buttons.variants = 'primary') => {
  const buttonVariant = theme.buttons.variants[variant];
  
  return StyleSheet.create({
    button: {
      borderRadius: theme.buttons.borderRadius,
      paddingVertical: theme.buttons.paddingVertical,
      marginVertical: theme.buttons.marginVertical,
      backgroundColor: buttonVariant.backgroundColor,
      borderColor: buttonVariant.borderColor,
      borderWidth: 1,
    },
    buttonText: {
      fontSize: theme.buttons.fontSize,
      fontFamily: fonts.weights.semiBold,
      color: buttonVariant.textColor,
      textAlign: 'center',
    },
  });
};

/**
 * Creates common input styles using theme values
 * 
 * @param variant - Input variant from theme
 * @returns StyleSheet object with input styles
 */
export const createInputStyles = (variant: keyof typeof theme.inputs.variants = 'light') => {
  const inputVariant = theme.inputs.variants[variant];
  
  return StyleSheet.create({
    input: {
      borderRadius: theme.inputs.borderRadius,
      paddingHorizontal: theme.inputs.paddingHorizontal,
      fontSize: theme.inputs.fontSize,
      backgroundColor: inputVariant.backgroundColor,
      color: inputVariant.textColor,
      borderColor: inputVariant.borderColor,
      borderWidth: 1,
    },
    label: {
      fontSize: fonts.sizes.medium,
      fontFamily: fonts.weights.semiBold,
      color: inputVariant.textColor,
      marginBottom: spacing.sm,
    },
  });
};

/**
 * Creates common layout styles using theme spacing
 * 
 * @returns StyleSheet object with common layout styles
 */
export const createLayoutStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
}; 
