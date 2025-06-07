import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: any;
}

const getButtonColors = (variant: ButtonVariant) => {
  return theme.buttons.variants[variant];
};

export const Button = ({
  mode = 'contained',
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) => {
  const colors = getButtonColors(variant);

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
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.buttons.borderRadius,
    marginVertical: theme.buttons.marginVertical,
  },
  content: {
    paddingVertical: theme.buttons.paddingVertical,
  },
  label: {
    fontSize: theme.buttons.fontSize,
    fontFamily: theme.fonts.titleLarge.fontFamily,
  },
}); 
