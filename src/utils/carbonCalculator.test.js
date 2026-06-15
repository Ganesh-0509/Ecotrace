// Unit tests for the pure carbon-calculation logic. These functions are the
// numeric heart of the platform, so they are covered directly and in
// isolation (no React, no Firebase) — fast, deterministic, side-effect-free.
import { describe, it, expect } from 'vitest';
import {
  estimateSaving,
  sumSavings,
  savingsByCategory,
  toEquivalents,
  ecoScore,
} from './carbonCalculator';

describe('estimateSaving', () => {
  it('returns 0 for an unknown action', () => {
    expect(estimateSaving('does_not_exist', {})).toBe(0);
  });

  it('returns the base saving when no relevant baseline is set', () => {
    // plant_meal baseSaving = 1.8, diet multiplier defaults to 1
    expect(estimateSaving('plant_meal', {})).toBe(1.8);
  });

  it('scales transport savings up for a car-heavy baseline', () => {
    // transit_commute baseSaving 2.6 × car multiplier 1.15 = 2.99
    expect(estimateSaving('transit_commute', { transport: 'car' })).toBe(2.99);
  });

  it('scales food savings down for a plant-based baseline', () => {
    // vegetarian_meal 1.1 × plant_based 0.85 = 0.935 -> 0.94 (2dp)
    expect(estimateSaving('vegetarian_meal', { diet: 'plant_based' })).toBe(0.94);
  });

  it('rounds to two decimal places', () => {
    const value = estimateSaving('transit_commute', { transport: 'car' });
    expect(Number.isInteger(value * 100)).toBe(true);
  });
});

describe('sumSavings', () => {
  it('returns 0 for an empty list', () => {
    expect(sumSavings([])).toBe(0);
  });

  it('totals co2SavedKg across entries', () => {
    expect(sumSavings([{ co2SavedKg: 1.2 }, { co2SavedKg: 2.6 }])).toBe(3.8);
  });

  it('treats missing values as 0', () => {
    expect(sumSavings([{ co2SavedKg: 1.5 }, {}])).toBe(1.5);
  });
});

describe('savingsByCategory', () => {
  it('aggregates per category and buckets unknowns as "other"', () => {
    const result = savingsByCategory([
      { category: 'transport', co2SavedKg: 2.6 },
      { category: 'transport', co2SavedKg: 1.4 },
      { co2SavedKg: 0.5 },
    ]);
    expect(result).toEqual({ transport: 4, other: 0.5 });
  });
});

describe('toEquivalents', () => {
  it('produces relatable equivalents from kg CO2', () => {
    const eq = toEquivalents(21.77);
    expect(eq.treeDays).toBeCloseTo(365, 0);
    expect(eq.carKm).toBeCloseTo(120.9, 1);
  });
});

describe('ecoScore', () => {
  it('is 0 with no savings and 100 at the saturation point', () => {
    expect(ecoScore(0)).toBe(0);
    expect(ecoScore(60)).toBe(100);
  });

  it('saturates at 100 beyond the cap', () => {
    expect(ecoScore(120)).toBe(100);
  });

  it('scales linearly in between', () => {
    expect(ecoScore(30)).toBe(50);
  });
});
