/**
 * @fileoverview Babel configuration for React Native
 * 
 * This module configures Babel, the JavaScript compiler used by React Native
 * and Expo. The configuration sets up the necessary presets and plugins for
 * transpiling modern JavaScript/TypeScript code to be compatible with React Native.
 * 
 * Key configurations:
 * - Expo preset for React Native compatibility
 * - Module resolver for simplified imports
 * - Source directory configuration
 * - File extension support
 * 
 * @module babel.config
 */

/**
 * Babel configuration
 * 
 * Creates and returns a Babel configuration object that enables modern
 * JavaScript features and provides convenient module resolution for the
 * React Native application.
 * 
 * The configuration includes:
 * - babel-preset-expo for React Native and Expo compatibility
 * - module-resolver plugin for simplified import paths
 * - Root directory configuration for absolute imports
 * - Support for JavaScript and TypeScript file extensions
 * 
 * @param {Object} api - Babel API object
 * @returns {Object} Babel configuration object
 * 
 * @example
 * ```js
 * // Babel automatically uses this configuration
 * // No manual import needed
 * ```
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
    ],
  };
};
