import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { UIProvider } from '@/context/UIContext';

describe('AudioPlayer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-01'));

    // Mock HTMLMediaElement.play
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  });

  it('should render mute and countdown toggle buttons', () => {
    render(
      <UIProvider>
        <AudioPlayer />
      </UIProvider>
    );

    expect(screen.getByLabelText('Reproducir música')).toBeInTheDocument();
    expect(screen.getByLabelText('Ocultar cuenta regresiva')).toBeInTheDocument();
  });

  it('should toggle aria-label on mute button click', () => {
    render(
      <UIProvider>
        <AudioPlayer />
      </UIProvider>
    );

    const muteBtn = screen.getByLabelText('Reproducir música');
    fireEvent.click(muteBtn);

    expect(screen.getByLabelText('Silenciar música')).toBeInTheDocument();
  });

  it('should toggle countdown visibility aria-label on click', () => {
    render(
      <UIProvider>
        <AudioPlayer />
      </UIProvider>
    );

    const toggleBtn = screen.getByLabelText('Ocultar cuenta regresiva');
    fireEvent.click(toggleBtn);

    expect(screen.getByLabelText('Mostrar cuenta regresiva')).toBeInTheDocument();
  });
});
