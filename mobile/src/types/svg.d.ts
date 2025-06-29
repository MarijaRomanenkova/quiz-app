/**
 * @fileoverview SVG module declaration for React Native
 * 
 * This module declaration file extends TypeScript's module resolution
 * to handle SVG imports in React Native applications. It provides type
 * safety when importing SVG files as React components.
 * 
 * The declaration enables:
 * - Type-safe SVG imports
 * - SVG components with proper React Native SVG props
 * - IntelliSense support for SVG components
 * 
 * @module types/svg
 */

/**
 * Module declaration for SVG files
 * 
 * Declares that any file with a `.svg` extension can be imported as
 * a React functional component that accepts standard React Native SVG props.
 * This enables TypeScript to understand SVG imports and provide proper
 * type checking and IntelliSense support.
 * 
 * @typedef {React.FC<SvgProps>} SVGComponent
 * 
 * @example
 * ```tsx
 * import Logo from '../assets/logo.svg';
 * 
 * const MyComponent = () => {
 *   return <Logo width={100} height={100} fill="#000000" />;
 * };
 * ```
 */
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
} 
