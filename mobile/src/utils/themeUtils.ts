import { StyleSheet } from 'react-native';
import { theme, fonts, spacing, layout } from '../theme';

/**
 * Theme utility functions for creating consistent styles
 * 
 * This module provides a comprehensive set of utility functions for creating
 * consistent, theme-aware styles across the application. These utilities work
 * with the Material Design 3 theme system to generate StyleSheet objects that
 * maintain visual consistency and follow the design system.
 * 
 * Key features:
 * - Component-specific style generators (cards, buttons, inputs, text)
 * - Theme-aware color and spacing management
 * - Consistent shadow and elevation system
 * - Layout utility functions for common patterns
 * - Type-safe style generation with proper TypeScript support
 * 
 * Usage patterns:
 * - Use createCardStyles() for consistent card components
 * - Use createButtonStyles() for theme-aware button styling
 * - Use createTextStyles() for consistent typography
 * - Use createLayoutStyles() for common layout patterns
 * - Use createColorStyles() for dynamic color management
 * 
 * @module utils/themeUtils
 */

/**
 * Creates common card styles using theme values
 * 
 * Generates consistent card styles with different variants for various use cases.
 * Each variant provides different visual emphasis and interaction states.
 * 
 * @param variant - Card variant ('default', 'selected', 'elevated')
 * @returns StyleSheet object with card styles
 * 
 * @example
 * ```tsx
 * const styles = createCardStyles('selected');
 * <View style={styles.card}>
 *   // Card content
 * </View>
 * ```
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
          borderColor: theme.colors.primary,
          borderWidth: 2,
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
      color,
      fontFamily: fonts.weights[weight],
      fontSize: fonts.sizes[size],
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
      backgroundColor: buttonVariant.backgroundColor,
      borderColor: buttonVariant.borderColor,
      borderRadius: theme.buttons.borderRadius,
      borderWidth: 1,
      marginVertical: theme.buttons.marginVertical,
      paddingVertical: theme.buttons.paddingVertical,
    },
    buttonText: {
      color: buttonVariant.textColor,
      fontFamily: fonts.weights.semiBold,
      fontSize: theme.buttons.fontSize,
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
      backgroundColor: inputVariant.backgroundColor,
      borderColor: inputVariant.borderColor,
      borderRadius: theme.inputs.borderRadius,
      borderWidth: 1,
      color: inputVariant.textColor,
      fontSize: theme.inputs.fontSize,
      paddingHorizontal: theme.inputs.paddingHorizontal,
    },
    label: {
      color: inputVariant.textColor,
      fontFamily: fonts.weights.semiBold,
      fontSize: fonts.sizes.medium,
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
    centered: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    spaceBetween: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};

/**
 * Creates common shadow styles using theme values
 * 
 * @param variant - Shadow variant ('small', 'medium', 'large')
 * @returns StyleSheet object with shadow styles
 */
export const createShadowStyles = (variant: keyof typeof layout.shadow = 'medium') => {
  return StyleSheet.create({
    shadow: layout.shadow[variant],
  });
};

/**
 * Creates common color styles using theme colors
 * 
 * @param colorType - Type of color to create ('surface', 'text', 'primary', 'error')
 * @param opacity - Optional opacity (0-1, defaults to 1)
 * @returns StyleSheet object with color styles
 */
export const createColorStyles = (
  colorType: 'surface' | 'text' | 'primary' | 'error' | 'onSurface' | 'onSecondaryContainer' = 'surface',
  opacity: number = 1
) => {
  const colorMap = {
    surface: theme.colors.surface,
    text: theme.colors.text,
    primary: theme.colors.primary,
    error: theme.colors.error,
    onSurface: theme.colors.onSurface,
    onSecondaryContainer: theme.colors.onSecondaryContainer,
  };

  const baseColor = colorMap[colorType];
  const colorWithOpacity = opacity < 1 ? baseColor + Math.round(opacity * 255).toString(16).padStart(2, '0') : baseColor;

  return StyleSheet.create({
    backgroundColor: {
      backgroundColor: colorWithOpacity,
    },
    textColor: {
      color: colorWithOpacity,
    },
    borderColor: {
      borderColor: colorWithOpacity,
    },
  });
}; 
