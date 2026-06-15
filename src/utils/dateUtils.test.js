// Unit tests for the month-key helpers that underpin the monthly-aggregation
// Firestore schema. A fixed date is injected so the tests stay deterministic.
import { describe, it, expect } from 'vitest';
import {
  currentMonthKey,
  todayKey,
  formatMonthLabel,
  isToday,
} from './dateUtils';

const FIXED = new Date('2026-06-15T09:30:00.000Z');

describe('currentMonthKey', () => {
  it('formats as YYYY-MM with a zero-padded month', () => {
    expect(currentMonthKey(new Date('2026-03-02T00:00:00Z'))).toBe('2026-03');
    expect(currentMonthKey(FIXED)).toBe('2026-06');
  });
});

describe('todayKey', () => {
  it('returns the ISO date portion', () => {
    expect(todayKey(FIXED)).toBe('2026-06-15');
  });
});

describe('formatMonthLabel', () => {
  it('turns a month key into a human label', () => {
    expect(formatMonthLabel('2026-06')).toBe('June 2026');
  });
});

describe('isToday', () => {
  it('matches an ISO timestamp on the current day', () => {
    expect(isToday(`${todayKey()}T12:00:00.000Z`)).toBe(true);
  });

  it('rejects a timestamp from another day', () => {
    expect(isToday('2000-01-01T00:00:00.000Z')).toBe(false);
  });
});
