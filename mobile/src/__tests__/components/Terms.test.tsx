import React from 'react';
import { render } from '@testing-library/react-native';
import { Terms } from '../../components/Terms/Terms';

describe('Terms', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Terms />);
    expect(getByTestId('terms')).toBeTruthy();
  });
}); 
