import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

function ThrowingComponent(): React.ReactNode {
  throw new Error('Test crash');
}

function StableComponent() {
  return <div data-testid="stable">Working fine</div>;
}

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <StableComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('stable')).toBeInTheDocument();
  });

  it('should render fallback when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Something went wrong</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();

    spy.mockRestore();
  });
});
