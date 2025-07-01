import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../components/Input/Input';

describe('Input Component', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });

    it('should render with label', () => {
      const { getByText } = render(
        <Input
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={mockOnChangeText}
        />
      );

      const label = getByText('Email');
      expect(label).toBeTruthy();
    });

    it('should render with error message', () => {
      const { getByText } = render(
        <Input
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={mockOnChangeText}
          error="Invalid email format"
        />
      );

      const errorMessage = getByText('Invalid email format');
      expect(errorMessage).toBeTruthy();
    });

    it('should render with secure text entry', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Password"
          placeholder="Enter password"
          value=""
          onChangeText={mockOnChangeText}
          secureTextEntry={true}
        />
      );

      const input = getByPlaceholderText('Enter password');
      expect(input).toBeTruthy();
    });

    it('should render with different keyboard types', () => {
      const { getByPlaceholderText, rerender } = render(
        <Input
          label="Email"
          placeholder="Email input"
          value=""
          onChangeText={mockOnChangeText}
          keyboardType="email-address"
        />
      );
      expect(getByPlaceholderText('Email input')).toBeTruthy();

      rerender(
        <Input
          label="Number"
          placeholder="Number input"
          value=""
          onChangeText={mockOnChangeText}
          keyboardType="numeric"
        />
      );
      expect(getByPlaceholderText('Number input')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onChangeText when text changes', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent.changeText(input, 'new text');

      expect(mockOnChangeText).toHaveBeenCalledWith('new text');
    });

    it('should handle multiple text changes', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent.changeText(input, 'first');
      fireEvent.changeText(input, 'second');
      fireEvent.changeText(input, 'third');

      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenLastCalledWith('third');
    });
  });

  describe('Value Handling', () => {
    it('should display the provided value', () => {
      const { getByTestId } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value="initial value"
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByTestId('text-input');
      expect(input).toBeTruthy();
      expect(input.props.value).toBe('initial value');
    });

    it('should handle empty value', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });

    it('should handle null value', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value={null as any}
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value=""
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined onChangeText', () => {
      const { getByPlaceholderText } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value=""
          onChangeText={undefined as any}
        />
      );

      const input = getByPlaceholderText('Enter text');
      expect(input).toBeTruthy();
    });

    it('should handle undefined placeholder', () => {
      const { getByTestId } = render(
        <Input
          label="Test Input"
          value="test value"
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByTestId('text-input');
      expect(input).toBeTruthy();
      expect(input.props.value).toBe('test value');
    });

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000);
      const { getByTestId } = render(
        <Input
          label="Test Input"
          placeholder="Enter text"
          value={longText}
          onChangeText={mockOnChangeText}
        />
      );

      const input = getByTestId('text-input');
      expect(input).toBeTruthy();
      expect(input.props.value).toBe(longText);
    });
  });
}); 
