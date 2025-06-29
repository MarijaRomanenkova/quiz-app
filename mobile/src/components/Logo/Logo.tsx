/**
 * @fileoverview Logo component for the mobile application
 * 
 * This component renders the application's logo with platform-specific handling.
 * On web platforms, it uses a PNG image, while on mobile platforms it uses
 * an SVG component for better scalability and performance.
 * 
 * The component supports customizable dimensions and additional styling
 * through props, making it flexible for use across different screen sizes.
 * 
 * @module components/Logo
 */

import React from 'react';
import { Image, StyleSheet, Platform, ViewStyle, ImageStyle } from 'react-native';
import QuizLogoSvg from '../../../assets/images/quiz_logo.svg';

/**
 * Props interface for the Logo component
 * 
 * @interface LogoProps
 * @property {number} [width=200] - Width of the logo in pixels
 * @property {number} [height=200] - Height of the logo in pixels
 * @property {ViewStyle | ImageStyle} [style] - Additional styles to apply to the logo
 */
interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle | ImageStyle;
}

/**
 * Logo component with platform-specific rendering
 * 
 * Renders the application logo with different implementations based on the platform.
 * On web, uses a PNG image for better compatibility, while on mobile platforms
 * uses an SVG component for crisp rendering at any size.
 * 
 * @param {LogoProps} props - The logo props
 * @param {number} [props.width=200] - Width of the logo in pixels
 * @param {number} [props.height=200] - Height of the logo in pixels
 * @param {ViewStyle | ImageStyle} [props.style] - Additional styles to apply
 * @returns {JSX.Element} The logo component appropriate for the current platform
 * 
 * @example
 * ```tsx
 * <Logo width={150} height={150} />
 * ```
 * 
 * @example
 * ```tsx
 * <Logo style={{ marginTop: 20 }} />
 * ```
 */
export const Logo = ({ width = 200, height = 200, style }: LogoProps) => {
  if (Platform.OS === 'web') {
    return (
      <Image 
        source={require('../../../assets/images/quiz_logo.png')}
        style={[
          styles.logo,
          { width, height },
          style as ImageStyle
        ]}
        resizeMode="contain"
      />
    );
  }
  return <QuizLogoSvg width={width} height={height} style={[styles.logo, style]} />;
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: 24,
  },
}); 
