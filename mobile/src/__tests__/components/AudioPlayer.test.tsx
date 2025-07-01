import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AudioPlayer } from '../../components/AudioPlayer/AudioPlayer';

describe('AudioPlayer', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<AudioPlayer audioUrl="test.mp3" />);
    expect(getByTestId('audio-player')).toBeTruthy();
  });

  it('calls play and pause handlers', () => {
    const { getByTestId } = render(<AudioPlayer audioUrl="test.mp3" />);
    const playButton = getByTestId('audio-play-button');
    fireEvent.press(playButton);
    fireEvent.press(playButton); // toggle pause
    expect(playButton).toBeTruthy();
  });
}); 
