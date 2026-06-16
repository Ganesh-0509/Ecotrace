// Tests for the domain entity factories — they guarantee Firestore documents
// are consistently shaped regardless of which feature creates them.
import { describe, it, expect } from 'vitest';
import {
  createUserProfile,
  createLogEntry,
  createInsight,
  TRANSPORT_MODES,
  DIET_TYPES,
  ENERGY_SOURCES,
} from './models';

describe('createUserProfile', () => {
  it('applies sensible defaults and starts incomplete', () => {
    const p = createUserProfile();
    expect(p.transport).toBe(TRANSPORT_MODES.CAR);
    expect(p.diet).toBe(DIET_TYPES.BALANCED);
    expect(p.energy).toBe(ENERGY_SOURCES.GRID);
    expect(p.profileCompleted).toBe(false);
    expect(typeof p.createdAt).toBe('string');
  });

  it('trims free-text fields', () => {
    const p = createUserProfile({ city: '  Pune  ', displayName: '  Sam  ' });
    expect(p.city).toBe('Pune');
    expect(p.displayName).toBe('Sam');
  });
});

describe('createLogEntry', () => {
  it('rounds the saving to two decimals and trims the note', () => {
    const e = createLogEntry({
      actionId: 'plant_meal',
      label: 'Ate a plant-based meal',
      category: 'food',
      co2SavedKg: 1.8049,
      note: '  tasty  ',
    });
    expect(e.co2SavedKg).toBe(1.8);
    expect(e.note).toBe('tasty');
    expect(typeof e.loggedAt).toBe('string');
  });

  it('defaults the note to an empty string', () => {
    const e = createLogEntry({
      actionId: 'recycled',
      label: 'Recycled',
      category: 'waste',
      co2SavedKg: 0.8,
    });
    expect(e.note).toBe('');
  });
});

describe('createInsight', () => {
  it('keeps only the recognised fields', () => {
    const i = createInsight({
      title: 'T',
      detail: 'D',
      impact: 'I',
      category: 'energy',
      extra: 'dropped',
    });
    expect(i).toEqual({ title: 'T', detail: 'D', impact: 'I', category: 'energy' });
  });
});
