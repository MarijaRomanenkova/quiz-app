/**
 * @fileoverview Component-related type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for component props and
 * interfaces that are used across multiple UI components. These types ensure
 * type safety when working with component props throughout the application.
 * 
 * The module includes:
 * - Button component types
 * - Input component types
 * - Modal component types
 * - Quiz component types
 * - Results component types
 * - Audio player types
 * - Chart component types
 * 
 * @module types/components
 */

import { ViewStyle } from 'react-native';
import { ButtonVariant } from '../utils/buttonUtils';

/**
 * Props interface for the Button component
 * 
 * @interface ButtonProps
 * @property {'text' | 'outlined' | 'contained'} [mode='contained'] - Button display mode
 * @property {() => void} onPress - Function called when button is pressed
 * @property {React.ReactNode} children - Button content (usually text)
 * @property {ButtonVariant} [variant='success'] - Button color variant
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {ViewStyle} [style] - Additional styles to apply to the button
 * @property {string} [testID] - Test ID for the button
 */
export interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Props interface for the Input component
 * 
 * @interface InputProps
 * @property {string} label - The label text displayed above the input
 * @property {string} value - The current value of the input field
 * @property {(text: string) => void} onChangeText - Function called when input text changes
 * @property {string} [placeholder] - Placeholder text shown when input is empty
 * @property {string} [error] - Error message to display below the input
 * @property {boolean} [secureTextEntry] - Whether to hide the input text (for passwords)
 * @property {'default' | 'email-address' | 'numeric' | 'phone-pad'} [keyboardType='default'] - Type of keyboard to show
 * @property {React.ReactNode} [right] - Content to display on the right side of the input
 */
export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  right?: React.ReactNode;
}

/**
 * Props interface for the CustomModal component
 * 
 * @interface CustomModalProps
 * @property {boolean} visible - Whether the modal is currently visible
 * @property {() => void} onDismiss - Function called when modal is dismissed (backdrop tap)
 * @property {string} title - The title text displayed at the top of the modal
 * @property {string} message - The main message text displayed in the modal body
 * @property {string} primaryButtonText - Text for the primary action button
 * @property {() => void} onPrimaryButtonPress - Function called when primary button is pressed
 * @property {string} [secondaryButtonText] - Text for the secondary action button (optional)
 * @property {() => void} [onSecondaryButtonPress] - Function called when secondary button is pressed (optional)
 */
export interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  primaryButtonText: string;
  onPrimaryButtonPress: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
}

/**
 * Props interface for the QuizRadioGroup component
 * 
 * @interface QuizRadioGroupProps
 * @property {string[]} options - Array of answer options
 * @property {number | null} selectedAnswer - Index of the selected answer, null if none selected
 * @property {string} correctAnswerId - ID of the correct answer
 * @property {(index: number) => void} onAnswer - Function called when an answer is selected
 */
export interface QuizRadioGroupProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswerId: string;
  onAnswer: (index: number) => void;
}

/**
 * Props interface for the QuizTopBar component
 * 
 * @interface QuizTopBarProps
 * @property {number} currentQuestion - Index of the current question (0-based)
 * @property {number} totalQuestions - Total number of questions in the quiz
 * @property {boolean} showReadingText - Whether reading text is currently shown
 */
export interface QuizTopBarProps {
  currentQuestion: number;
  totalQuestions: number;
  showReadingText: boolean;
}

/**
 * Props interface for the ReadingText component
 * 
 * @interface ReadingTextProps
 * @property {Object} text - The reading text content
 * @property {string} text.title - The title of the reading text
 * @property {string} text.text - The main text content
 */
export interface ReadingTextProps {
  text: {
    title: string;
    text: string;
  };
}

/**
 * Props interface for the LevelProgress component
 * 
 * @interface LevelProgressProps
 * @property {string} level - The current level name (e.g., "Beginner", "Intermediate")
 * @property {number} completedTopics - Number of topics completed in the current level
 * @property {number} totalTopics - Total number of topics in the current level
 * @property {number} percentage - Completion percentage (0-100)
 */
export interface LevelProgressProps {
  level: string;
  completedTopics: number;
  totalTopics: number;
  percentage: number;
}

/**
 * Props interface for the ScoreCircle component
 * 
 * @interface ScoreCircleProps
 * @property {number} score - The number of correct answers
 * @property {number} total - The total number of questions
 */
export interface ScoreCircleProps {
  score: number;
  total: number;
}

/**
 * Props interface for the AudioPlayer component
 * 
 * @interface AudioPlayerProps
 * @property {string} audioUrl - The URL of the audio file to play
 */
export interface AudioPlayerProps {
  audioUrl: string;
}

/**
 * Ref interface for external control of the AudioPlayer
 * 
 * @interface AudioPlayerRef
 * @property {() => void} stop - Function to stop the current audio playback
 */
export interface AudioPlayerRef {
  stop: () => void;
}

/**
 * Data structure for individual bar items in CustomBarChart
 * 
 * @interface BarData
 * @property {string} [label] - Optional label for the bar (e.g., day of week)
 * @property {number} value - The numeric value to display (typically minutes)
 * @property {string} [color] - Optional custom color for the bar
 */
export interface BarData {
  label?: string;
  value: number;
  color?: string;
}

/**
 * Props interface for the CustomBarChart component
 * 
 * @interface CustomBarChartProps
 * @property {BarData[]} data - Array of data points to display as bars
 * @property {number} [height] - Custom height for the chart container
 * @property {number} [width=screenWidth - 64] - Custom width for the chart container
 * @property {number} [maxValue] - Maximum value for scaling
 * @property {boolean} [showValues=false] - Whether to show value labels
 * @property {number} [barSpacing=2] - Spacing between bars in pixels
 * @property {number} [barWidth] - Custom width for bars (auto-calculated if not provided)
 * @property {string} [testID] - Optional testID for testing
 */
export interface CustomBarChartProps {
  data: BarData[];
  height?: number;
  width?: number;
  maxValue?: number;
  showValues?: boolean;
  barSpacing?: number;
  barWidth?: number;
  testID?: string;
} 
