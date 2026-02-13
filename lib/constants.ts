export const ANNIVERSARY_DATE = new Date('2025-12-25T00:00:00');

export interface YearConfig {
  year: string;
  isLocked: boolean;
  lockedIcon?: 'plane';
}

export const YEARS_CONFIG: YearConfig[] = [
  { year: '2025', isLocked: false },
  { year: '2026', isLocked: true, lockedIcon: 'plane' },
  { year: '2027', isLocked: true },
];
