// Guards the integrity of the static emission-factor catalogue: every action
// must be well-formed and the O(1) lookup index must stay in sync with it.
import { describe, it, expect } from 'vitest';
import {
  MICRO_ACTIONS,
  ACTION_INDEX,
  ACTION_CATEGORIES,
  BASELINE_MULTIPLIERS,
} from './emissionFactors';

const VALID_CATEGORIES = new Set(Object.values(ACTION_CATEGORIES));

describe('MICRO_ACTIONS catalogue', () => {
  it('has no duplicate action ids', () => {
    const ids = MICRO_ACTIONS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every action is well-formed', () => {
    for (const action of MICRO_ACTIONS) {
      expect(action.id).toBeTruthy();
      expect(action.label).toBeTruthy();
      expect(VALID_CATEGORIES.has(action.category)).toBe(true);
      expect(typeof action.baseSaving).toBe('number');
      expect(action.baseSaving).toBeGreaterThan(0);
    }
  });

  it('is frozen (immutable reference data)', () => {
    expect(Object.isFrozen(MICRO_ACTIONS)).toBe(true);
  });
});

describe('ACTION_INDEX', () => {
  it('maps every action id back to its definition', () => {
    expect(Object.keys(ACTION_INDEX)).toHaveLength(MICRO_ACTIONS.length);
    for (const action of MICRO_ACTIONS) {
      expect(ACTION_INDEX[action.id]).toBe(action);
    }
  });
});

describe('BASELINE_MULTIPLIERS', () => {
  it('exposes a multiplier for each baseline dimension', () => {
    expect(Object.keys(BASELINE_MULTIPLIERS)).toEqual(
      expect.arrayContaining(['transport', 'diet', 'energy'])
    );
  });
});
