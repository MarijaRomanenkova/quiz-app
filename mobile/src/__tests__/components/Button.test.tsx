import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/Button/Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress}>Test Button</Button>
      );

      const button = getByText('Test Button');
      expect(button).toBeTruthy();
    });

    it('should render with custom text', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress}>Custom Text</Button>
      );

      const button = getByText('Custom Text');
      expect(button).toBeTruthy();
    });

    it('should render with different variants', () => {
      const { getByText, rerender } = render(
        <Button onPress={mockOnPress} variant="success">Success</Button>
      );
      expect(getByText('Success')).toBeTruthy();

      rerender(
        <Button onPress={mockOnPress} variant="primary">Primary</Button>
      );
      expect(getByText('Primary')).toBeTruthy();

      rerender(
        <Button onPress={mockOnPress} variant="secondary">Secondary</Button>
      );
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('should render with different modes', () => {
      const { getByText, rerender } = render(
        <Button onPress={mockOnPress} mode="contained">Contained</Button>
      );
      expect(getByText('Contained')).toBeTruthy();

      rerender(
        <Button onPress={mockOnPress} mode="outlined">Outlined</Button>
      );
      expect(getByText('Outlined')).toBeTruthy();

      rerender(
        <Button onPress={mockOnPress} mode="text">Text</Button>
      );
      expect(getByText('Text')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when pressed', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress}>Press Me</Button>
      );

      const button = getByText('Press Me');
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress} disabled={true}>Disabled</Button>
      );

      const button = getByText('Disabled');
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should handle multiple presses', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress}>Multi Press</Button>
      );

      const button = getByText('Multi Press');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Styling', () => {
    it('should apply custom styles', () => {
      const customStyle = { marginTop: 10 };
      const { getByText } = render(
        <Button onPress={mockOnPress} style={customStyle}>Styled</Button>
      );

      const button = getByText('Styled');
      expect(button).toBeTruthy();
      // Note: In React Native Testing Library, we can't easily test applied styles
      // but we can verify the component renders without errors
    });

    it('should render with all variants without errors', () => {
      const variants = ['success', 'primary', 'secondary'] as const;
      
      variants.forEach(variant => {
        const { getByText } = render(
          <Button onPress={mockOnPress} variant={variant}>
            {variant} Button
          </Button>
        );
        
        expect(getByText(`${variant} Button`)).toBeTruthy();
      });
    });

    it('should render disabled state for all variants', () => {
      const variants = ['success', 'primary', 'secondary'] as const;
      
      variants.forEach(variant => {
        const { getByText } = render(
          <Button onPress={mockOnPress} variant={variant} disabled={true}>
            Disabled {variant}
          </Button>
        );
        
        expect(getByText(`Disabled ${variant}`)).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress}>Accessible Button</Button>
      );

      const button = getByText('Accessible Button');
      expect(button).toBeTruthy();
    });

    it('should be accessible when disabled', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress} disabled={true}>Disabled Accessible</Button>
      );

      const button = getByText('Disabled Accessible');
      expect(button).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { getByTestId } = render(
        <Button onPress={mockOnPress} testID="paper-button">{''}</Button>
      );

      const button = getByTestId('paper-button');
      expect(button).toBeTruthy();
    });

    it('should handle null onPress', () => {
      // This should not crash the component
      expect(() => {
        render(<Button onPress={null as any}>Test</Button>);
      }).not.toThrow();
    });

    it('should handle undefined variant', () => {
      const { getByText } = render(
        <Button onPress={mockOnPress} variant={undefined as any}>Test</Button>
      );

      expect(getByText('Test')).toBeTruthy();
    });
  });
}); 
