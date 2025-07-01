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
import { theme, spacing } from '../../theme';
import { getButtonColors, type ButtonVariant } from '../../utils/buttonUtils';

/**
 * Props interface for the Button component
 * 
 * @interface ButtonProps
 * @property {'text' | 'outlined' | 'contained'} [mode='contained'] - Button display mode
 * @property {() => void} onPress - Function called when button is pressed
 * @property {React.ReactNode} children - Button content (usually text)
 * @property {ButtonVariant} [variant='success'] - Button color variant
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {any} [style] - Additional styles to apply to the button
 * @property {string} [testID] - Test ID for the button
 */
interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: any;
  testID?: string;
}

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
 * @param {any} [props.style] - Additional styles to apply
 * @param {string} [props.testID] - Test ID for the button
 * @returns {JSX.Element} A styled button component
 * 
 * @example
 * ```tsx
 * <Button onPress={() => console.log('Pressed!')} variant="primary">
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
    paddingVertical: theme.buttons.paddingVertical,
    marginVertical: theme.buttons.marginVertical,
    height: 56,
  },
  content: {
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.buttons.fontSize,
    fontFamily: 'Baloo2-SemiBold',
    lineHeight: 24,
    textAlignVertical: 'center',
  },
}); 
