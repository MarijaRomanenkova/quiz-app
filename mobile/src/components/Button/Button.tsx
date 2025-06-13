import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../../theme';

type ButtonVariant = 'success' | 'primary' | 'secondary';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: any;
}

const getButtonColors = (variant: ButtonVariant) => {
  switch (variant) {
    case 'success':
      return {
        backgroundColor: '#8BF224', // bright green
        textColor: '#000000',
      };
    case 'primary':
      return {
        backgroundColor: theme.colors.background, // #4313E2 with opacity
        textColor: theme.colors.surface, // white
      };
    case 'secondary':
      return {
        backgroundColor: '#EDE7FF', // pale violet
        textColor: '#000000',
      };
  }
};

export const Button = ({ 
  mode = 'contained',
  onPress, 
  children,
  variant = 'success',
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
    borderRadius: 20,
    marginVertical: 8,
    height: 56, // Fixed height for all buttons
  },
  content: {
    paddingVertical: 8,
  },
  label: {
    fontSize: 24,
    fontFamily: theme.fonts.titleLarge.fontFamily,
    fontWeight: 'bold',
  },
}); 
