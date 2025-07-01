/**
 * @fileoverview Custom Button component for the mobile application
 * 
 * This component provides a consistent button interface across the app
 * with predefined variants, colors, and styling. It wraps react-native-paper's
 * Button component with custom theming and additional functionality.
 * 
 * The component supports three variants: success (green), primary (purple),
 * and secondary (pale violet), each with appropriate colors for enabled
 * and disabled states.
 * 
 * @module components/Button
 */

import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../../theme';
import { getButtonColors } from '../../utils/buttonUtils';
import { ButtonProps } from '../../types/components.types';

/**
 * Custom Button component with predefined variants and styling
 * 
 * Provides a consistent button interface with three color variants
 * and proper disabled state handling. The button has a fixed height
 * of 56px and rounded corners for a modern appearance.
 * 
 * @param {ButtonProps} props - The button props
 * @param {'text' | 'outlined' | 'contained'} [props.mode='contained'] - Button display mode
 * @param {() => void} props.onPress - Function called when button is pressed
 * @param {React.ReactNode} props.children - Button content
 * @param {ButtonVariant} [props.variant='success'] - Button color variant
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {ViewStyle} [props.style] - Additional styles to apply
 * @param {string} [props.testID] - Test ID for the button
 * @returns {JSX.Element} A styled button component
 * 
 * @example
 * ```tsx
 * <Button onPress={() => {}} variant="primary">
 *   Submit
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * <Button onPress={handleSave} variant="success" disabled={isLoading}>
 *   Save
 * </Button>
 * ```
 */
export const Button = ({ 
  mode = 'contained',
  onPress, 
  children,
  variant = 'success',
  disabled = false,
  style,
  testID,
}: ButtonProps) => {
  const colors = getButtonColors(variant, disabled);

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}
      textColor={colors.textColor}
      buttonColor={colors.backgroundColor}
      contentStyle={styles.content}
      labelStyle={styles.label}
      testID={testID}
    >
      {children}
    </PaperButton>
  );
};

// Styles
const styles = StyleSheet.create({
  button: {
    borderRadius: theme.buttons.borderRadius,
    height: 56,
    marginVertical: theme.buttons.marginVertical,
    paddingVertical: theme.buttons.paddingVertical,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  label: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: theme.buttons.fontSize,
    lineHeight: 24,
    textAlignVertical: 'center',
  },
}); 
