// Tests for the deterministic fallback coach. Because it is pure, we can
// assert its context-driven decisions precisely without any mocking.
import { describe, it, expect } from 'vitest';
import { generateRuleInsights } from './rulesEngine';

const REQUIRED_KEYS = ['title', 'detail', 'impact', 'category'];

describe('generateRuleInsights', () => {
  it('returns exactly 3 well-formed recommendations', () => {
    const out = generateRuleInsights({}, { entries: [] });
    expect(out).toHaveLength(3);
    for (const rec of out) {
      for (const key of REQUIRED_KEYS) expect(rec[key]).toBeTruthy();
    }
  });

  it('is deterministic for the same input', () => {
    const profile = { transport: 'car', diet: 'meat_heavy', energy: 'grid' };
    const a = generateRuleInsights(profile, { entries: [] });
    const b = generateRuleInsights(profile, { entries: [] });
    expect(a).toEqual(b);
  });

  it('prioritises the user\'s most carbon-intensive baseline', () => {
    // A car-driving, meat-heavy, grid-powered user: transport/food/energy
    // should outrank waste/water, and the high-impact variants should fire.
    const out = generateRuleInsights(
      { transport: 'car', diet: 'meat_heavy', energy: 'grid' },
      { entries: [] }
    );
    const categories = out.map((r) => r.category);
    expect(categories).toContain('transport');
    expect(categories).toContain('food');

    const transport = out.find((r) => r.category === 'transport');
    expect(transport.title).toMatch(/swap one car trip/i);
  });

  it('acknowledges an already-green profile differently', () => {
    const out = generateRuleInsights(
      { transport: 'bike', diet: 'plant_based', energy: 'renewable' },
      { entries: [] }
    );
    const food = out.find((r) => r.category === 'food');
    // Low-intensity diet should still be coachable but with the gentle variant.
    if (food) expect(food.title).toMatch(/lean further/i);
  });

  it('localises advice when a city is provided', () => {
    const out = generateRuleInsights(
      { transport: 'car', city: 'Chennai' },
      { entries: [] }
    );
    const transport = out.find((r) => r.category === 'transport');
    expect(transport.detail).toContain('Chennai');
  });

  it('de-prioritises a category the user has already worked on', () => {
    // Heavy savings logged under transport should lower its opportunity so a
    // neglected category surfaces instead.
    const profile = { transport: 'transit', diet: 'balanced', energy: 'mixed' };
    const busy = generateRuleInsights(profile, {
      entries: Array.from({ length: 20 }, () => ({ category: 'transport', co2SavedKg: 3 })),
    });
    // With transport heavily saturated, it should not dominate all 3 slots.
    const transportCount = busy.filter((r) => r.category === 'transport').length;
    expect(transportCount).toBeLessThanOrEqual(1);
  });
});
