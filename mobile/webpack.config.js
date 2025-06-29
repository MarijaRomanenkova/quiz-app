/**
 * @fileoverview Webpack configuration for web platform
 * 
 * This module configures Webpack for building the web version of the React Native
 * application using Expo. The configuration extends the default Expo webpack config
 * to add polyfills and handle specific dependencies for web compatibility.
 * 
 * Key configurations:
 * - Expo webpack configuration integration
 * - Node.js polyfills for web environment
 * - Babel transpilation settings
 * - Module resolution and fallbacks
 * 
 * @module webpack.config
 */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');

/**
 * Webpack configuration for Expo web
 * 
 * Creates and returns a Webpack configuration object that extends the default
 * Expo webpack config. The configuration adds necessary polyfills and settings
 * for running React Native applications on the web platform.
 * 
 * The configuration includes:
 * - Expo webpack configuration with custom babel settings
 * - Node.js polyfills for crypto, stream, buffer, and other modules
 * - Module resolution fallbacks for web compatibility
 * - Transpilation settings for @expo/vector-icons
 * 
 * @param {Object} env - Environment configuration
 * @param {Object} argv - Command line arguments
 * @returns {Promise<Object>} Webpack configuration object
 * 
 * @example
 * ```js
 * // Webpack automatically uses this configuration
 * // No manual import needed
 * ```
 */
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@expo/vector-icons']
    }
  }, argv);

  // Add polyfills
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    vm: false,  // Disable vm module
    assert: require.resolve('assert/'),
    util: require.resolve('util/'),
    process: require.resolve('process/browser')
  };

  return config;
}; 
