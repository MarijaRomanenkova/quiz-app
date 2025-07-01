/**
 * @fileoverview Animation utility functions for the mobile application
 * 
 * This module provides utility functions for creating and managing animations
 * used across the app for consistent user experience.
 * 
 * @module utils/animationUtils
 */

import { Animated } from 'react-native';

/**
 * Creates a loading dots animation sequence
 * 
 * Creates an animated sequence for loading dots that pulse in sequence.
 * Each dot animates with a delay to create a wave effect.
 * 
 * @param {Animated.Value[]} dotAnimations - Array of animated values for each dot
 * @param {number} [delay=200] - Delay between each dot animation in milliseconds
 * @param {number} [duration=600] - Duration of each animation cycle in milliseconds
 * @returns {Animated.CompositeAnimation} The animation sequence
 * 
 * @example
 * ```tsx
 * const dotAnimations = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];
 * const animation = createLoadingDotsAnimation(dotAnimations);
 * animation.start();
 * ```
 */
export const createLoadingDotsAnimation = (
  dotAnimations: Animated.Value[],
  delay = 200,
  duration = 600
): Animated.CompositeAnimation => {
  const animations = dotAnimations.map((anim, index) => {
    return Animated.sequence([
      Animated.delay(index * delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ),
    ]);
  });

  return Animated.parallel(animations);
};

/**
 * Creates a fade-in animation
 * 
 * Creates a simple fade-in animation that can be used for components
 * appearing on screen.
 * 
 * @param {Animated.Value} opacity - The animated opacity value
 * @param {number} [duration=300] - Duration of the animation in milliseconds
 * @returns {Animated.CompositeAnimation} The fade-in animation
 * 
 * @example
 * ```tsx
 * const opacity = new Animated.Value(0);
 * const fadeIn = createFadeInAnimation(opacity);
 * fadeIn.start();
 * ```
 */
export const createFadeInAnimation = (
  opacity: Animated.Value,
  duration = 300
): Animated.CompositeAnimation => {
  return Animated.timing(opacity, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Creates a scale animation
 * 
 * Creates a scale animation that can be used for buttons or interactive elements.
 * 
 * @param {Animated.Value} scale - The animated scale value
 * @param {number} toValue - The target scale value
 * @param {number} [duration=200] - Duration of the animation in milliseconds
 * @returns {Animated.CompositeAnimation} The scale animation
 * 
 * @example
 * ```tsx
 * const scale = new Animated.Value(1);
 * const scaleUp = createScaleAnimation(scale, 1.1);
 * scaleUp.start();
 * ```
 */
export const createScaleAnimation = (
  scale: Animated.Value,
  toValue: number,
  duration = 200
): Animated.CompositeAnimation => {
  return Animated.timing(scale, {
    toValue,
    duration,
    useNativeDriver: true,
  });
}; 
