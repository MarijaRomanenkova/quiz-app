/**
 * @fileoverview Metro bundler configuration for React Native
 * 
 * This module configures the Metro bundler, which is the JavaScript bundler
 * used by React Native and Expo. The configuration extends the default Expo
 * Metro config to support SVG imports and custom asset handling.
 * 
 * Key configurations:
 * - SVG transformer for importing SVG files as React components
 * - Asset extensions filtering to prevent SVG conflicts
 * - Source extensions to include SVG files
 * 
 * @module metro.config
 */

const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro bundler configuration
 * 
 * Creates and returns a Metro configuration object that extends the default
 * Expo Metro config. The configuration enables SVG support by configuring
 * the transformer and resolver to handle SVG files as React components.
 * 
 * The configuration:
 * - Uses react-native-svg-transformer for SVG processing
 * - Filters out SVG from asset extensions to prevent conflicts
 * - Adds SVG to source extensions for proper importing
 * 
 * @returns {Object} Metro configuration object
 * 
 * @example
 * ```js
 * // Metro automatically uses this configuration
 * // No manual import needed
 * ```
 */
module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})(); 
