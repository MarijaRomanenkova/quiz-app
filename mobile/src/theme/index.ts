import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#EDE7FF', // Pale violet
    secondary: '#8BF224', // Bright green
    tertiary: '#6B4EFF', // Lighter violet
    error: '#FF4B4B', // Bright red
    background: 'rgba(67, 19, 226, 0.7)', // Semi-transparent violet
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#FFFFFF80',
    outline: '#6750A4', // New outline color
    // Override any blue colors from MD3LightTheme
    primaryContainer: '#4313E2',
    secondaryContainer: '#EDE7FF',
    tertiaryContainer: 'rgba(67, 19, 226, 0.7)',
    onPrimaryContainer: '#FFFFFF',
    onSecondaryContainer: '#000000',
    onTertiaryContainer: '#FFFFFF',
  },
  buttons: {
    borderRadius: 20,
    paddingVertical: 8,
    marginVertical: 8,
    fontSize: 24,
    variants: {
      primary: {
        backgroundColor: '#8BF224', // bright green
        textColor: '#000000',
        borderColor: '#8BF224',
      },
      secondary: {
        backgroundColor: '#4313E2', // saturated violet
        textColor: '#FFFFFF',
        borderColor: '#4313E2',
      },
      tertiary: {
        backgroundColor: '#EDE7FF', // pale violet
        textColor: '#000000',
        borderColor: '#EDE7FF',
      },
    },
  },
  inputs: {
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    variants: {
      light: {
        backgroundColor: 'transparent',
        textColor: '#FFFFFF',
        placeholderColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        activeBorderColor: '#FFFFFF',
      },
      dark: {
        backgroundColor: 'transparent',
        textColor: '#000000',
        placeholderColor: '#000000',
        borderColor: '#000000',
        activeBorderColor: '#000000',
      },
    },
  },
};

export type AppTheme = typeof theme;

export const fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
    huge: 72
  },
  weights: {
    // Baloo 2 weights
    regular: 'Baloo2-Regular',
    medium: 'Baloo2-Medium',
    semiBold: 'Baloo2-SemiBold',
    bold: 'Baloo2-Bold',
    extraBold: 'Baloo2-ExtraBold',
    // Baloo 2 weights for body text (replacing OpenSans)
    bodyRegular: 'Baloo2-Regular',
    bodyMedium: 'Baloo2-Medium',
    bodyBold: 'Baloo2-Bold'
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  borderRadius: {
    small: 8,
    medium: 15,
    large: 20,
  },
  shadow: {
    small: {
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 20 },
      shadowRadius: 50,
      elevation: 8,
    },
  },
}; 
