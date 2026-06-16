// ─────────────────────────────────────────────────────────────────────
// Domain Layer (Entities) — pure data shapes, zero React / Firebase deps.
// ─────────────────────────────────────────────────────────────────────
// These factory + constant definitions describe WHAT the core concepts of
// the platform are. Every other layer depends on these; this layer depends
// on nothing. Using factories keeps Firestore documents consistently shaped.
// ─────────────────────────────────────────────────────────────────────

/** Allowed values for the onboarding baseline questionnaire. */
export const TRANSPORT_MODES = Object.freeze({
  CAR: 'car',
  TRANSIT: 'transit',
  BIKE: 'bike',
  EV: 'ev',
});

export const DIET_TYPES = Object.freeze({
  MEAT_HEAVY: 'meat_heavy',
  BALANCED: 'balanced',
  PLANT_BASED: 'plant_based',
});

export const ENERGY_SOURCES = Object.freeze({
  GRID: 'grid',
  MIXED: 'mixed',
  RENEWABLE: 'renewable',
});

/**
 * A user's baseline profile, captured once during onboarding and used as
 * context for every AI insight request.
 * @returns {object} a normalized profile document
 */
export function createUserProfile({
  city = '',
  transport = TRANSPORT_MODES.CAR,
  diet = DIET_TYPES.BALANCED,
  energy = ENERGY_SOURCES.GRID,
  displayName = '',
} = {}) {
  return {
    city: city.trim(),
    transport,
    diet,
    energy,
    displayName: displayName.trim(),
    profileCompleted: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * A single logged micro-action. `co2SavedKg` is the estimated saving vs the
 * user's baseline, computed by the carbon calculator at log time.
 */
export function createLogEntry({ actionId, label, category, co2SavedKg, note = '' }) {
  return {
    actionId,
    label,
    category,
    co2SavedKg: Number(co2SavedKg.toFixed(2)),
    note: note.trim(),
    loggedAt: new Date().toISOString(),
  };
}

/** Shape returned by the Gemini insight engine after parsing. */
export function createInsight({ title, detail, impact, category }) {
  return { title, detail, impact, category };
}
