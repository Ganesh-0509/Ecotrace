// ─────────────────────────────────────────────────────────────────────
// Carbon Calculator — pure functions (Shared Domain Logic, zero deps).
// ─────────────────────────────────────────────────────────────────────
// Translates micro-actions into estimated CO2e savings, personalised by
// the user's baseline profile. Pure and deterministic, so it is trivially
// unit-testable and can run anywhere (UI, future tests, etc.).
// ─────────────────────────────────────────────────────────────────────
import {
  ACTION_INDEX,
  ACTION_CATEGORIES,
  BASELINE_MULTIPLIERS,
} from './emissionFactors';

/**
 * Returns the personalised CO2e saving (kg) for a single micro-action,
 * scaled by how carbon-intensive the user's relevant baseline is.
 * @param {string} actionId  one of MICRO_ACTIONS[].id
 * @param {object} profile   the user's baseline profile
 * @returns {number} kg CO2e saved, rounded to 2 dp
 */
export function estimateSaving(actionId, profile = {}) {
  const action = ACTION_INDEX[actionId];
  if (!action) return 0;

  let multiplier = 1;
  if (action.category === ACTION_CATEGORIES.TRANSPORT) {
    multiplier = BASELINE_MULTIPLIERS.transport[profile.transport] ?? 1;
  } else if (action.category === ACTION_CATEGORIES.FOOD) {
    multiplier = BASELINE_MULTIPLIERS.diet[profile.diet] ?? 1;
  } else if (action.category === ACTION_CATEGORIES.ENERGY) {
    multiplier = BASELINE_MULTIPLIERS.energy[profile.energy] ?? 1;
  }

  return Number((action.baseSaving * multiplier).toFixed(2));
}

/**
 * Sums total CO2e saved across a list of log entries.
 * @param {Array<{co2SavedKg:number}>} entries
 * @returns {number} total kg, rounded to 2 dp
 */
export function sumSavings(entries = []) {
  if (entries.length === 0) return 0;
  let total = 0;
  for (const entry of entries) total += entry.co2SavedKg || 0;
  return Number(total.toFixed(2));
}

/**
 * Aggregates savings per category for charting / summaries.
 * @param {Array} entries
 * @returns {Object<string, number>} category -> kg saved
 */
export function savingsByCategory(entries = []) {
  const totals = {};
  for (const entry of entries) {
    const key = entry.category || 'other';
    totals[key] = Number(((totals[key] || 0) + (entry.co2SavedKg || 0)).toFixed(2));
  }
  return totals;
}

/**
 * Converts kg of CO2e into relatable equivalents for motivating copy.
 * @param {number} kg
 */
export function toEquivalents(kg) {
  return {
    // ~21.77 kg CO2 absorbed per mature tree per year.
    treeDays: Number(((kg / 21.77) * 365).toFixed(1)),
    // ~0.18 kg CO2 per km in an average petrol car.
    carKm: Number((kg / 0.18).toFixed(1)),
    // ~0.45 kg CO2 per smartphone charge-year is misleading; use km only.
    smartphoneCharges: Number((kg / 0.005).toFixed(0)),
  };
}

/**
 * A lightweight "eco score" (0-100) derived from monthly savings, giving
 * the gamified dashboard a single headline number. Saturates at 60 kg/mo.
 * @param {number} monthlyKg
 */
export function ecoScore(monthlyKg) {
  const capped = Math.min(monthlyKg, 60);
  return Math.round((capped / 60) * 100);
}
