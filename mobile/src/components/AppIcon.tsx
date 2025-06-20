import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

export const AppIcon = () => {
  return (
    <View>
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
