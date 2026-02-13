import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Countdown from '@/components/Countdown';
import { UIProvider } from '@/context/UIContext';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render time units with zero-padded values', () => {
    vi.setSystemTime(new Date('2025-12-24T21:58:55'));

    render(
      <UIProvider>
        <Countdown />
      </UIProvider>
    );

    expect(screen.getByText('Días')).toBeInTheDocument();
    expect(screen.getByText('Horas')).toBeInTheDocument();
    expect(screen.getByText('Minutos')).toBeInTheDocument();
    expect(screen.getByText('Segundos')).toBeInTheDocument();
  });

  it('should display padded values', () => {
    vi.setSystemTime(new Date('2025-12-24T21:58:55'));

    render(
      <UIProvider>
        <Countdown />
      </UIProvider>
    );

    // Should show "00" for days (less than 1 day remaining)
    expect(screen.getByText('00')).toBeInTheDocument();
  });
});
