/**
 * @fileoverview Expo application configuration
 * 
 * This module defines the configuration for the Expo application, including
 * app metadata, platform-specific settings, plugins, and build configurations.
 * The configuration is used by Expo CLI, EAS Build, and other Expo tools
 * to build and deploy the application.
 * 
 * The configuration includes:
 * - App metadata (name, version, slug)
 * - Platform-specific settings (iOS, Android, Web)
 * - Custom fonts configuration
 * - Development client settings
 * - Build and deployment configurations
 * 
 * @module app.config
 */

import { ExpoConfig, ConfigContext } from '@expo/config';

/**
 * Expo application configuration
 * 
 * Defines the complete configuration for the mobile quiz application,
 * including app metadata, platform settings, plugins, and build options.
 * This configuration is used by Expo CLI and EAS Build for building
 * and deploying the application across different platforms.
 * 
 * Key configuration areas:
 * - App identification and metadata
 * - Platform-specific settings (iOS, Android, Web)
 * - Custom font loading and configuration
 * - Development and production build settings
 * - Plugin configurations for enhanced functionality
 * 
 * @param {ConfigContext} context - Expo configuration context
 * @param {any} context.config - Base configuration object
 * @returns {ExpoConfig} Complete Expo configuration object
 * 
 * @example
 * ```tsx
 * // Configuration is automatically used by Expo CLI
 * // No manual import needed - Expo reads this file automatically
 * ```
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mobile-quiz-app",
  slug: "mobile-quiz-app",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  splash: {
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.marijar.reactnativeboilerplate",
    adaptiveIcon: {
      backgroundColor: "#ffffff",
    },
  },
  developmentClient: {
    silentLaunch: true
  },
  plugins: [
    "expo-dev-client",
    [
      "expo-font",
      {
        fonts: [
          "assets/fonts/Baloo2-Regular.ttf",
          "assets/fonts/Baloo2-Medium.ttf",
          "assets/fonts/Baloo2-SemiBold.ttf",
          "assets/fonts/Baloo2-Bold.ttf",
          "assets/fonts/Baloo2-ExtraBold.ttf",
          "assets/fonts/BalooBhaina2-Regular.ttf",
          "assets/fonts/BalooBhaina2-Medium.ttf",
          "assets/fonts/BalooBhaina2-SemiBold.ttf",
          "assets/fonts/BalooBhaina2-Bold.ttf",
          "assets/fonts/BalooBhaina2-ExtraBold.ttf"
        ]
      }
    ]
  ],
  web: {
    bundler: 'webpack'
  },
});
