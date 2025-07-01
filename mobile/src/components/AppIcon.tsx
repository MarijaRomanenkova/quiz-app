/**
 * @fileoverview App Icon component for the mobile application
 * 
 * This component renders the application's icon as an SVG element.
 * The icon consists of a purple background (#4313E2) with a white "Q" 
 * character centered in the middle, representing the quiz application.
 * 
 * The icon is designed to be 1024x1024 pixels and uses a viewBox for
 * proper scaling across different screen densities.
 * 
 * @module components/AppIcon
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

/**
 * AppIcon component that renders the application's icon
 * 
 * Creates a square icon with the app's brand colors and logo.
 * The icon is designed to be used in app stores, splash screens,
 * and other places where the app identity needs to be displayed.
 * 
 * @returns {JSX.Element} A View containing the SVG app icon
 * 
 * @example
 * ```tsx
 * <AppIcon />
 * ```
 */
export const AppIcon = () => {
  return (
    <View testID="app-icon">
      <Svg width={1024} height={1024} viewBox="0 0 1024 1024">
        <Rect width={1024} height={1024} fill="#4313E2" />
        <Text
          x={512}
          y={512}
          fontFamily="Arial"
          fontSize={200}
          fill="white"
          textAnchor="middle"
        >
          Q
        </Text>
      </Svg>
    </View>
  );
}; 
