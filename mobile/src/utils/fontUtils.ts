/**
 * @fileoverview Font utility functions for the mobile application
 * 
 * This module provides utility functions for font loading and management
 * used across the app for consistent typography.
 * 
 * @module utils/fontUtils
 */

import * as Font from 'expo-font';

/**
 * Font configuration for the app
 * 
 * Defines all the fonts used in the application with their file paths.
 * This centralizes font management and makes it easy to update font files.
 */
export const FONT_CONFIG = {
  'Baloo2-Regular': require('../../assets/fonts/Baloo2-Regular.ttf'),
  'Baloo2-Medium': require('../../assets/fonts/Baloo2-Medium.ttf'),
  'Baloo2-SemiBold': require('../../assets/fonts/Baloo2-SemiBold.ttf'),
  'Baloo2-Bold': require('../../assets/fonts/Baloo2-Bold.ttf'),
  'Baloo2-ExtraBold': require('../../assets/fonts/Baloo2-ExtraBold.ttf'),
  'BalooBhaina2-Bold': require('../../assets/fonts/BalooBhaina2-Bold.ttf'),
} as const;

/**
 * Loads all application fonts
 * 
 * Loads the Baloo2 font family with different weights for consistent
 * typography across the app. Handles loading errors gracefully.
 * 
 * @returns {Promise<boolean>} Promise that resolves to true if fonts loaded successfully
 * 
 * @example
 * ```tsx
 * const fontsLoaded = await loadAppFonts();
 * if (fontsLoaded) {
 *   // Fonts are ready
 * }
 * ```
 */
export const loadAppFonts = async (): Promise<boolean> => {
  try {
    await Font.loadAsync(FONT_CONFIG);
    return true;
  } catch (error) {
    console.error('Error loading fonts:', error);
    return false;
  }
}; 
