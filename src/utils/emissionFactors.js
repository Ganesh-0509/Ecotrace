// ─────────────────────────────────────────────────────────────────────
// Emission Factors — static reference data (Shared Domain Logic).
// ─────────────────────────────────────────────────────────────────────
// Each micro-action carries an approximate CO2-equivalent SAVING in kg,
// representing the benefit of choosing the greener option over a typical
// baseline alternative. Figures are rounded, illustrative estimates drawn
// from common public sustainability datasets — intended for awareness and
// behavioural nudging, not regulatory-grade accounting.
//
// Kept as a frozen, flat catalogue so the calculator can do O(1) lookups
// (see js-set-map-lookups best practice) instead of scanning arrays.
// ─────────────────────────────────────────────────────────────────────

export const ACTION_CATEGORIES = Object.freeze({
  TRANSPORT: 'transport',
  FOOD: 'food',
  ENERGY: 'energy',
  WASTE: 'waste',
  WATER: 'water',
});

/**
 * Catalogue of loggable micro-actions.
 * `baseSaving` = kg CO2e saved per logged occurrence vs the baseline.
 * `unit` documents the assumption behind the figure for transparency.
 */
export const MICRO_ACTIONS = Object.freeze([
  // ── Transport ──
  { id: 'transit_commute', label: 'Took public transit instead of driving', category: ACTION_CATEGORIES.TRANSPORT, baseSaving: 2.6, unit: 'per ~10 km trip', icon: '🚌' },
  { id: 'cycled_trip', label: 'Cycled or walked a short trip', category: ACTION_CATEGORIES.TRANSPORT, baseSaving: 1.2, unit: 'per ~5 km trip', icon: '🚲' },
  { id: 'carpooled', label: 'Carpooled / shared a ride', category: ACTION_CATEGORIES.TRANSPORT, baseSaving: 1.5, unit: 'per shared trip', icon: '🚗' },
  { id: 'wfh_day', label: 'Worked from home (skipped commute)', category: ACTION_CATEGORIES.TRANSPORT, baseSaving: 3.2, unit: 'per day', icon: '🏠' },

  // ── Food ──
  { id: 'plant_meal', label: 'Ate a plant-based meal', category: ACTION_CATEGORIES.FOOD, baseSaving: 1.8, unit: 'per meal vs meat', icon: '🥗' },
  { id: 'vegetarian_meal', label: 'Ate a vegetarian meal', category: ACTION_CATEGORIES.FOOD, baseSaving: 1.1, unit: 'per meal vs meat', icon: '🍲' },
  { id: 'local_produce', label: 'Chose local / seasonal produce', category: ACTION_CATEGORIES.FOOD, baseSaving: 0.5, unit: 'per shop', icon: '🥕' },
  { id: 'no_food_waste', label: 'Finished leftovers (zero food waste)', category: ACTION_CATEGORIES.FOOD, baseSaving: 0.7, unit: 'per meal', icon: '🍱' },

  // ── Energy ──
  { id: 'line_dry', label: 'Air-dried clothes instead of a dryer', category: ACTION_CATEGORIES.ENERGY, baseSaving: 2.3, unit: 'per load', icon: '👕' },
  { id: 'cold_wash', label: 'Washed laundry in cold water', category: ACTION_CATEGORIES.ENERGY, baseSaving: 0.6, unit: 'per load', icon: '🧺' },
  { id: 'off_peak', label: 'Shifted heavy appliance use to off-peak', category: ACTION_CATEGORIES.ENERGY, baseSaving: 0.9, unit: 'per use', icon: '⚡' },
  { id: 'ac_setback', label: 'Raised AC setpoint / used a fan', category: ACTION_CATEGORIES.ENERGY, baseSaving: 1.4, unit: 'per day', icon: '❄️' },

  // ── Waste ──
  { id: 'recycled', label: 'Recycled paper / plastic / glass', category: ACTION_CATEGORIES.WASTE, baseSaving: 0.8, unit: 'per batch', icon: '♻️' },
  { id: 'composted', label: 'Composted organic waste', category: ACTION_CATEGORIES.WASTE, baseSaving: 0.6, unit: 'per day', icon: '🌱' },
  { id: 'reusable_bag', label: 'Used a reusable bag / bottle', category: ACTION_CATEGORIES.WASTE, baseSaving: 0.2, unit: 'per use', icon: '🛍️' },

  // ── Water ──
  { id: 'short_shower', label: 'Took a shorter shower', category: ACTION_CATEGORIES.WATER, baseSaving: 0.5, unit: 'per shower', icon: '🚿' },
  { id: 'rainwater', label: 'Used stored / rainwater for plants', category: ACTION_CATEGORIES.WATER, baseSaving: 0.3, unit: 'per use', icon: '💧' },
]);

// O(1) lookup index: actionId -> action definition.
export const ACTION_INDEX = Object.freeze(
  MICRO_ACTIONS.reduce((map, action) => {
    map[action.id] = action;
    return map;
  }, {})
);

/**
 * Baseline multipliers. A user whose baseline is more carbon-intensive
 * (e.g. a daily car driver, meat-heavy diet) saves slightly more by
 * switching, so we scale category savings to personalise the feedback.
 */
export const BASELINE_MULTIPLIERS = Object.freeze({
  transport: { car: 1.15, ev: 0.85, transit: 1.0, bike: 0.9 },
  diet: { meat_heavy: 1.2, balanced: 1.0, plant_based: 0.85 },
  energy: { grid: 1.1, mixed: 1.0, renewable: 0.8 },
});
