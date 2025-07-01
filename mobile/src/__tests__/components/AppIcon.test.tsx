import React from 'react';
import { render } from '@testing-library/react-native';
import { AppIcon } from '../../components/AppIcon';

describe('AppIcon', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<AppIcon />);
    expect(getByTestId('app-icon')).toBeTruthy();
  });
}); 
