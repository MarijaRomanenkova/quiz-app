/**
 * @fileoverview Custom Modal component for the mobile application
 * 
 * This component provides a consistent modal dialog interface across the app
 * with customizable title, message, and action buttons. It wraps react-native-paper's
 * Modal component with custom styling and button layout.
 * 
 * The modal supports both single and dual button configurations, with primary
 * and optional secondary actions. It uses the app's theme colors and button
 * components for consistency.
 * 
 * @module components/Modal
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';
import { theme } from '../../theme';
import { Button } from '../Button/Button';

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
interface CustomModalProps {
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
 * Custom Modal component with consistent styling and button layout
 * 
 * Provides a themed modal dialog with title, message, and action buttons.
 * The modal can be configured with either one or two buttons, and uses
 * the app's custom Button component for consistent styling.
 * 
 * @param {CustomModalProps} props - The modal props
 * @param {boolean} props.visible - Whether the modal is currently visible
 * @param {() => void} props.onDismiss - Function called when modal is dismissed
 * @param {string} props.title - The title text displayed at the top of the modal
 * @param {string} props.message - The main message text displayed in the modal body
 * @param {string} props.primaryButtonText - Text for the primary action button
 * @param {() => void} props.onPrimaryButtonPress - Function called when primary button is pressed
 * @param {string} [props.secondaryButtonText] - Text for the secondary action button
 * @param {() => void} [props.onSecondaryButtonPress] - Function called when secondary button is pressed
 * @returns {JSX.Element} A styled modal component with title, message, and action buttons
 * 
 * @example
 * ```tsx
 * <CustomModal
 *   visible={showModal}
 *   onDismiss={() => setShowModal(false)}
 *   title="Confirm Action"
 *   message="Are you sure you want to proceed?"
 *   primaryButtonText="Confirm"
 *   onPrimaryButtonPress={handleConfirm}
 *   secondaryButtonText="Cancel"
 *   onSecondaryButtonPress={() => setShowModal(false)}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <CustomModal
 *   visible={showAlert}
 *   onDismiss={() => setShowAlert(false)}
 *   title="Success"
 *   message="Your changes have been saved successfully."
 *   primaryButtonText="OK"
 *   onPrimaryButtonPress={() => setShowAlert(false)}
 * />
 * ```
 */
export const CustomModal = ({
  visible,
  onDismiss,
  title,
  message,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}: CustomModalProps) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Text variant="headlineMedium" style={styles.modalTitle}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.modalText}>
        {message}
      </Text>
      <View style={styles.modalButtons}>
        {secondaryButtonText && onSecondaryButtonPress && (
          <Button
            mode="outlined"
            onPress={onSecondaryButtonPress}
            style={styles.modalButton}
            variant="secondary"
          >
            {secondaryButtonText}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onPrimaryButtonPress}
          style={styles.modalButton}
          variant="primary"
        >
          {primaryButtonText}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 24,
    margin: 24,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryContainer,
  },
  modalTitle: {
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalButton: {
    flex: 1,
  },
}); 
