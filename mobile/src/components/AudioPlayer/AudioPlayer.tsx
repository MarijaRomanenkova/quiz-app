/**
 * @fileoverview Audio Player component for the mobile application
 * 
 * This component provides a circular audio player interface with play/pause
 * functionality and visual progress indication. It uses Expo's Audio API
 * for sound playback and displays progress as a circular progress bar.
 * 
 * The component supports external control through a ref interface, allowing
 * parent components to stop playback programmatically. It automatically
 * handles audio loading, playback status updates, and cleanup.
 * 
 * @module components/AudioPlayer
 */

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { theme } from '../../theme';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { AudioPlayerProps, AudioPlayerRef } from '../../types/components.types';

/**
 * Audio Player component with circular progress indicator
 * 
 * Provides a visually appealing audio player with play/pause functionality
 * and a circular progress bar that shows playback progress. The component
 * uses Expo's Audio API for reliable cross-platform audio playback.
 * 
 * The player displays a circular progress indicator with a play/pause button
 * in the center. Progress is updated in real-time as the audio plays.
 * 
 * @param {AudioPlayerProps} props - The audio player props
 * @param {string} props.audioUrl - The URL of the audio file to play
 * @param {React.Ref<AudioPlayerRef>} ref - Ref for external control
 * @returns {JSX.Element} A circular audio player with progress indicator
 * 
 * @example
 * ```tsx
 * const audioPlayerRef = useRef<AudioPlayerRef>(null);
 * 
 * <AudioPlayer
 *   ref={audioPlayerRef}
 *   audioUrl="https://example.com/audio.mp3"
 * />
 * 
 * // Stop playback from parent component
 * audioPlayerRef.current?.stop();
 * ```
 * 
 * @example
 * ```tsx
 * <AudioPlayer audioUrl={question.audioUrl} />
 * ```
 */
export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ audioUrl }, ref) => {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = useState(0);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  useImperativeHandle(ref, () => ({
    stop: async () => {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }));

  /**
   * Plays the audio file from the provided URL
   * 
   * Loads the audio file, sets up playback status monitoring,
   * and starts playback. Handles errors gracefully.
   */
  const playSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status && 'didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
          setProgress(0);
        } else if (status && 'positionMillis' in status && 'durationMillis' in status && status.durationMillis) {
          setProgress(status.positionMillis / status.durationMillis);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  /**
   * Stops the current audio playback
   * 
   * Stops the sound and resets the playing state and progress.
   */
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container} testID="audio-player">
      <View style={styles.playerContainer}>
        <Svg width={radius * 2} height={radius * 2} style={styles.svg}>
          {/* Background circle */}
          <SvgCircle
            cx={radius}
            cy={radius}
            r={radius - 4}
            stroke="#E6E0F8"
            strokeWidth={8}
            fill="none"
          />
          {/* Progress circle */}
          <SvgCircle
            cx={radius}
            cy={radius}
            r={radius - 4}
            stroke="#583FB0"
            strokeWidth={8}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${radius}, ${radius})`}
          />
          {/* White center circle */}
          <SvgCircle
            cx={radius}
            cy={radius}
            r={radius - 8}
            fill="white"
          />
        </Svg>
        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? stopSound : playSound}
          testID="audio-play-button"
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={64}
            color="#583FB0"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  playerContainer: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  svg: {
    position: 'absolute',
  }
}); 
