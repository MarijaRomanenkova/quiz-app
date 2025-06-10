import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';

type AudioPlayerProps = {
  audioUrl: string;
  onPlaybackComplete?: () => void;
};

export type AudioPlayerRef = {
  stop: () => Promise<void>;
};

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ audioUrl, onPlaybackComplete }, ref) => {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [position, setPosition] = React.useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    stop: async () => {
      if (sound && isPlaying) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    }
  }));

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      
      // Update progress animation
      const progress = status.positionMillis / status.durationMillis;
      progressAnim.setValue(progress);

      if (status.didJustFinish) {
        setIsPlaying(false);
        onPlaybackComplete?.();
      }
    }
  };

  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <Svg width={100} height={100} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={50}
            cy={50}
            r={40}
            stroke="#E6E0F8"
            strokeWidth={12}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={50}
            cy={50}
            r={40}
            stroke="#583FB0"
            strokeWidth={12}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, 50, 50)`}
          />
        </Svg>
        <TouchableOpacity
          style={styles.playButton}
          onPress={playSound}
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
