/**
 * @fileoverview Jest testing configuration for the mobile application
 * 
 * This module configures Jest, the JavaScript testing framework used for
 * unit and integration testing in the React Native application. The configuration
 * is optimized for React Native and Expo environments with proper module
 * resolution and coverage reporting.
 * 
 * Key configurations:
 * - React Native preset for compatibility
 * - Coverage thresholds and reporting
 * - Module name mapping for absolute imports
 * - File mocking for assets and fonts
 * - Transform patterns for React Native modules
 * - Test environment setup
 * 
 * @module jest.config
 */

/**
 * Jest configuration object
 * 
 * Configures Jest for testing React Native applications with proper
 * module resolution, coverage reporting, and asset handling. The
 * configuration ensures compatibility with Expo and React Native
 * ecosystem while providing comprehensive test coverage.
 * 
 * Configuration includes:
 * - React Native preset for proper testing environment
 * - Coverage thresholds (80% for all metrics)
 * - Module name mapping for absolute imports
 * - Asset file mocking (fonts, images, SVGs)
 * - Transform ignore patterns for React Native modules
 * - JSDOM test environment for web compatibility
 * 
 * @type {Object}
 * @property {string} preset - Jest preset for React Native
 * @property {string[]} setupFilesAfterEnv - Setup files to run before tests
 * @property {string[]} testMatch - File patterns to match for tests
 * @property {string[]} collectCoverageFrom - Files to include in coverage
 * @property {Object} coverageThreshold - Minimum coverage requirements
 * @property {Object} moduleNameMapper - Module path mapping
 * @property {string[]} transformIgnorePatterns - Patterns to ignore in transforms
 * @property {string} testEnvironment - Test environment (jsdom)
 * @property {string[]} moduleFileExtensions - Supported file extensions
 * 
 * @example
 * ```js
 * // Jest automatically uses this configuration
 * // Run tests with: npm test or jest
 * ```
 * 
 * @example
 * ```js
 * // Coverage report generation
 * // Run with: npm run test:coverage
 * ```
 */
module.exports = {
  // Use React Native preset for proper testing environment
  preset: 'react-native',
  
  // Setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // File patterns to match for test discovery
  testMatch: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx'],
  
  // Files to include in coverage reporting
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.ts',
    '!src/types/**',
    '!src/theme/**',
    '!src/constants/**',
  ],
  
  // Coverage thresholds - fail if coverage drops below these levels
  coverageThreshold: {
    global: {
      branches: 80,    // Branch coverage (if/else statements)
      functions: 80,   // Function coverage
      lines: 80,       // Line coverage
      statements: 80,  // Statement coverage
    },
  },
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock asset files (fonts, images, SVGs) to prevent import errors
    '\\.(ttf|otf|eot|svg|woff|woff2)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  
  // Patterns to ignore during transformation
  // Prevents Jest from trying to transform React Native and Expo modules
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  
  // Use JSDOM environment for web compatibility
  testEnvironment: 'jsdom',
  
  // Supported file extensions for module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}; 
