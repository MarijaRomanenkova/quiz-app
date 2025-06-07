import { StyleSheet } from 'react-native';
import { theme } from '../theme';

// Common styles for web-specific properties
export const commonStyles = {
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  userSelect: 'none',
  pointerEvents: 'auto',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 6,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    paddingVertical: 6,
  },
  success: {
    backgroundColor: '#8BF224',
    borderRadius: 30,
    paddingVertical: 6,
  },
  outline: {
    borderColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 6,
  },
  fullWidth: {
    width: '100%',
  },
  withMargin: {
    marginTop: 16,
  },
});

export const inputStyles = StyleSheet.create({
  base: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderRadius: 25,
    height: 50,
  },
});

export const inputTheme = {
  colors: {
    onSurfaceVariant: '#FFFFFF80',
    background: 'transparent',
  },
  roundness: 25,
};

export const containerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 16,
    elevation: 2,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const textStyles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: theme.colors.primary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.secondary,
  },
  loading: {
    marginTop: 16,
    color: theme.colors.primary,
  },
}); 
