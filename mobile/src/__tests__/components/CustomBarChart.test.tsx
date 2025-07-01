import React from 'react';
import { render } from '@testing-library/react-native';
import { CustomBarChart } from '../../components/CustomBarChart/CustomBarChart';

describe('CustomBarChart', () => {
  it('renders without crashing', () => {
    const data = [
      { value: 30, label: 'Mon' },
      { value: 45, label: 'Tue' },
    ];
    const { getByTestId } = render(<CustomBarChart data={data} testID="custom-bar-chart" />);
    expect(getByTestId('custom-bar-chart')).toBeTruthy();
  });
}); 
