import { describe, it, expect } from 'vitest';
import { ANNIVERSARY_DATE, YEARS_CONFIG } from '@/lib/constants';

describe('ANNIVERSARY_DATE', () => {
  it('should be a valid Date object', () => {
    expect(ANNIVERSARY_DATE).toBeInstanceOf(Date);
    expect(ANNIVERSARY_DATE.getTime()).not.toBeNaN();
  });

  it('should be December 25, 2025', () => {
    expect(ANNIVERSARY_DATE.getFullYear()).toBe(2025);
    expect(ANNIVERSARY_DATE.getMonth()).toBe(11); // 0-indexed
    expect(ANNIVERSARY_DATE.getDate()).toBe(25);
  });
});

describe('YEARS_CONFIG', () => {
  it('should have at least one unlocked year', () => {
    const unlocked = YEARS_CONFIG.filter(y => !y.isLocked);
    expect(unlocked.length).toBeGreaterThan(0);
  });

  it('should have unique year values', () => {
    const years = YEARS_CONFIG.map(y => y.year);
    expect(new Set(years).size).toBe(years.length);
  });
});
