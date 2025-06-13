import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { theme } from '../../theme';
import Svg, { Circle as SvgCircle } from 'react-native-svg';

interface AudioPlayerProps {
  audioUrl: string;
}

export interface AudioPlayerRef {
  stop: () => void;
}

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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 
