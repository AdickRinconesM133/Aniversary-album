import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { UIProvider, useUI } from '@/context/UIContext';

function TestConsumer() {
  const { isLocked, showCountdown } = useUI();
  return (
    <div>
      <span data-testid="locked">{isLocked.toString()}</span>
      <span data-testid="countdown">{showCountdown.toString()}</span>
    </div>
  );
}

describe('UIContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be locked when current date is before anniversary', () => {
    vi.setSystemTime(new Date('2025-06-01T12:00:00'));

    render(
      <UIProvider>
        <TestConsumer />
      </UIProvider>
    );

    expect(screen.getByTestId('locked').textContent).toBe('true');
  });

  it('should be unlocked when current date is after anniversary', () => {
    vi.setSystemTime(new Date('2025-12-26T00:00:00'));

    render(
      <UIProvider>
        <TestConsumer />
      </UIProvider>
    );

    expect(screen.getByTestId('locked').textContent).toBe('false');
  });

  it('should show countdown by default', () => {
    vi.setSystemTime(new Date('2025-06-01T12:00:00'));

    render(
      <UIProvider>
        <TestConsumer />
      </UIProvider>
    );

    expect(screen.getByTestId('countdown').textContent).toBe('true');
  });

  it('should throw when useUI is used outside UIProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useUI must be used within a UIProvider'
    );

    spy.mockRestore();
  });
});
