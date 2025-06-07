import React from 'react';
import { Image, StyleSheet, Platform, ViewStyle, ImageStyle } from 'react-native';
import QuizLogoSvg from '../../../assets/images/quiz_logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle | ImageStyle;
}

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
