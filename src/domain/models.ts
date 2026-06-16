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
} as const);

export const DIET_TYPES = Object.freeze({
  MEAT_HEAVY: 'meat_heavy',
  BALANCED: 'balanced',
  PLANT_BASED: 'plant_based',
} as const);

export const ENERGY_SOURCES = Object.freeze({
  GRID: 'grid',
  MIXED: 'mixed',
  RENEWABLE: 'renewable',
} as const);

export type TransportMode = (typeof TRANSPORT_MODES)[keyof typeof TRANSPORT_MODES];
export type DietType = (typeof DIET_TYPES)[keyof typeof DIET_TYPES];
export type EnergySource = (typeof ENERGY_SOURCES)[keyof typeof ENERGY_SOURCES];

/** The five emission categories every micro-action and insight belongs to. */
export type ActionCategory = 'transport' | 'food' | 'energy' | 'waste' | 'water';

/** A user's baseline profile, captured during onboarding and used as AI context. */
export interface UserProfile {
  city: string;
  transport: TransportMode;
  diet: DietType;
  energy: EnergySource;
  displayName: string;
  profileCompleted?: boolean;
  createdAt?: string;
}

/** A single logged micro-action (its estimated saving vs the user's baseline). */
export interface LogEntry {
  actionId: string;
  label: string;
  category: ActionCategory;
  co2SavedKg: number;
  note: string;
  loggedAt: string;
}

/** One month's aggregate document (users/{uid}/monthly_logs/{YYYY-MM}). */
export interface MonthLog {
  month: string;
  entries: LogEntry[];
  totalSaved: number;
  count: number;
  createdAt?: string;
  updatedAt?: string;
}

/** A single coaching recommendation (same shape from Gemini or the rule engine). */
export interface Insight {
  title: string;
  detail: string;
  impact: string;
  category: string;
}

/**
 * A user's baseline profile, captured once during onboarding and used as
 * context for every AI insight request.
 */
export function createUserProfile({
  city = '',
  transport = TRANSPORT_MODES.CAR,
  diet = DIET_TYPES.BALANCED,
  energy = ENERGY_SOURCES.GRID,
  displayName = '',
}: Partial<UserProfile> = {}): UserProfile {
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
export function createLogEntry({
  actionId,
  label,
  category,
  co2SavedKg,
  note = '',
}: {
  actionId: string;
  label: string;
  category: ActionCategory;
  co2SavedKg: number;
  note?: string;
}): LogEntry {
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
export function createInsight({ title, detail, impact, category }: Insight): Insight {
  return { title, detail, impact, category };
}
