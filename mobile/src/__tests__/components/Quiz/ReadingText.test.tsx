import React from 'react';
import { render } from '@testing-library/react-native';
import { ReadingText } from '../../../components/Quiz/ReadingText';

describe('ReadingText', () => {
  const mockText = {
    title: 'Sample Reading Title',
    text: 'This is a sample reading text content that should be displayed in the component.',
  };

  it('renders correctly with title and text', () => {
    const { getByText } = render(<ReadingText text={mockText} />);

    expect(getByText('Sample Reading Title')).toBeTruthy();
    expect(getByText('This is a sample reading text content that should be displayed in the component.')).toBeTruthy();
  });

  it('renders with different text content', () => {
    const differentText = {
      title: 'Another Title',
      text: 'Different content for testing purposes.',
    };

    const { getByText } = render(<ReadingText text={differentText} />);

    expect(getByText('Another Title')).toBeTruthy();
    expect(getByText('Different content for testing purposes.')).toBeTruthy();
  });
}); 
