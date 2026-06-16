// ─────────────────────────────────────────────────────────────────────
// Gemini Service (Application Layer) — the AI integration.
// ─────────────────────────────────────────────────────────────────────
// Calls Gemini 2.5 Flash directly from the browser (no paid backend). The
// key is protected by Google Cloud API key restrictions configured in the
// console (see DEPLOYMENT.md):
//   1. The API key is scoped to the Generative Language API only.
//   2. The key is restricted to the app's Firebase Hosting HTTP referrers.
//
// COST CONTROLS:
//   • Model: gemini-2.5-flash (generous free RPD + 1M token context).
//   • responseMimeType: application/json — no conversational filler tokens.
//   • Google Search grounding is NOT enabled (it would incur charges).
// ─────────────────────────────────────────────────────────────────────
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA, buildInsightPrompt } from '../prompts/insightPrompt';
import { ACTION_INDEX } from '../../../utils/emissionFactors';

const MODEL = 'gemini-2.5-flash';

let client = null;
function getClient() {
  if (client) return client;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_NOT_CONFIGURED');
  }
  client = new GoogleGenAI({ apiKey });
  return client;
}

export const isGeminiConfigured = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return !!key && key !== 'YOUR_GEMINI_API_KEY';
};

/** Builds a compact activity summary from a month's entries. */
function summarise(monthLog) {
  const entries = monthLog?.entries ?? [];
  const byCategory = {};
  const counts = {};
  for (const e of entries) {
    byCategory[e.category] = Number(((byCategory[e.category] || 0) + e.co2SavedKg).toFixed(2));
    counts[e.actionId] = (counts[e.actionId] || 0) + 1;
  }
  // Top 3 most-logged actions (drives the model toward what the user does).
  const topActions = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, times]) => ({ action: ACTION_INDEX[id]?.label ?? id, times }));

  return {
    count: entries.length,
    totalSaved: monthLog?.totalSaved ?? 0,
    byCategory,
    topActions,
  };
}

/**
 * Requests 3 personalised, localized recommendations.
 * @returns {Promise<Array<{title,detail,impact,category}>>}
 */
export async function generateInsights(profile, monthLog) {
  const ai = getClient();
  const summary = summarise(monthLog);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildInsightPrompt(profile, summary),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7,
      // NOTE: no `tools: [{ googleSearch: {} }]` — grounding stays OFF to
      // guarantee zero cost on the free tier.
    },
  });

  const text = response.text?.trim();
  if (!text) throw new Error('EMPTY_RESPONSE');

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('PARSE_ERROR');
  }
  // The SDK may wrap the array; normalise to an array of insights.
  const list = Array.isArray(parsed) ? parsed : parsed.recommendations || [];
  return list.slice(0, 3);
}
