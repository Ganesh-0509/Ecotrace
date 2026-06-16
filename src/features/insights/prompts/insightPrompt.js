// ─────────────────────────────────────────────────────────────────────
// Prompt Engineering for token efficiency (Insights domain).
// ─────────────────────────────────────────────────────────────────────
// A tight system instruction forces Gemini to act as a sustainability
// coach and return ONLY a compact JSON array — no conversational filler.
// This minimises output tokens (protecting the free-tier TPM budget) and
// removes brittle string-parsing on the client.
// ─────────────────────────────────────────────────────────────────────

export const SYSTEM_INSTRUCTION = `You are EcoTrace, an expert personal sustainability coach.
You receive a user's baseline profile and their recent low-carbon micro-actions.
Analyse the patterns and produce exactly 3 specific, hyper-localized, actionable
recommendations that build on what they already do well and target their biggest
remaining opportunity.

Rules:
- Tailor advice to the user's city, transport mode, diet, and energy source.
- Be concrete and quantified where possible (e.g. estimated kg CO2 saved).
- Reference local context (climate, infrastructure, civic initiatives) when relevant.
- Encourage; never shame. Acknowledge their existing effort.
- Respond with STRICT minified JSON only — no markdown, no prose outside JSON.`;

/**
 * Builds the user-turn payload describing the data Gemini should analyse.
 * @param {object} profile  baseline profile
 * @param {object} summary  { totalSaved, count, byCategory, topActions }
 */
export function buildInsightPrompt(profile, summary) {
  const payload = {
    profile: {
      city: profile?.city || 'unspecified',
      transport: profile?.transport,
      diet: profile?.diet,
      energy: profile?.energy,
    },
    activity: {
      actionsLogged: summary.count,
      totalCo2SavedKg: summary.totalSaved,
      savingsByCategory: summary.byCategory,
      topActions: summary.topActions,
    },
  };

  return `Analyse this user's data and return your coaching recommendations.\n\nDATA:\n${JSON.stringify(
    payload
  )}`;
}

// JSON schema constraining the model's structured output. Keeping the
// response shape fixed lets us render cards without defensive parsing.
export const RESPONSE_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Short headline for the recommendation' },
      detail: { type: 'string', description: 'One or two actionable sentences' },
      impact: { type: 'string', description: 'Estimated benefit, e.g. "~12 kg CO2/month"' },
      category: {
        type: 'string',
        enum: ['transport', 'food', 'energy', 'waste', 'water'],
      },
    },
    required: ['title', 'detail', 'impact', 'category'],
  },
};
