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

// React and core libraries
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';

// Project utilities and services
import { createTextStyles } from '../../utils/themeUtils';

// Project components
import { Button } from '../Button/Button';

// Types and interfaces
import { CustomModalProps } from '../../types/components.types';

// Theme and styling
import { theme, spacing, layout } from '../../theme';

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
      testID="custom-modal"
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
            testID="modal-secondary-button"
          >
            {secondaryButtonText}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onPrimaryButtonPress}
          style={styles.modalButton}
          variant="success"
          testID="modal-primary-button"
        >
          {primaryButtonText}
        </Button>
      </View>
    </Modal>
  );
};

// Create utility styles
const titleStyles = createTextStyles('xlarge', 'semiBold', theme.colors.onSecondaryContainer);
const textStyles = createTextStyles('large', 'regular', theme.colors.onSecondaryContainer);

const styles = StyleSheet.create({
  modalButton: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  modalContainer: {
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: layout.borderRadius.large,
    margin: spacing.xl,
    padding: spacing.xl,
  },
  modalText: {
    ...textStyles.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  modalTitle: {
    ...titleStyles.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
}); 
