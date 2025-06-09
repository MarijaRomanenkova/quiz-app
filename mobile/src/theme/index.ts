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
  fonts: {
    ...MD3LightTheme.fonts,
    // Display styles - Baloo Bhaina 2
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: 'BalooBhaina2-Bold',
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: 'BalooBhaina2-Bold',
    },
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: 'BalooBhaina2-SemiBold',
    },
    // Headline styles - Baloo Bhaina 2
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: 'BalooBhaina2-Bold',
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: 'BalooBhaina2-SemiBold',
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: 'BalooBhaina2-Regular',
    },
    // Title styles - Baloo Bhaina 2
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: 'BalooBhaina2-SemiBold',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: 'BalooBhaina2-Regular',
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: 'BalooBhaina2-Regular',
    },
    // Body styles - OpenSans for better readability
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: 'OpenSans-Regular',
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: 'OpenSans-Regular',
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: 'OpenSans-Regular',
    },
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
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32
  },
  weights: {
    // Baloo Bhaina 2 weights
    regular: 'BalooBhaina2-Regular',
    medium: 'BalooBhaina2-Medium',
    semiBold: 'BalooBhaina2-SemiBold',
    bold: 'BalooBhaina2-Bold',
    // OpenSans weights for body text
    bodyRegular: 'OpenSans-Regular',
    bodyMedium: 'OpenSans-Semibold',
    bodyBold: 'OpenSans-Bold'
  }
}; 
