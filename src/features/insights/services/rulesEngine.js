// ─────────────────────────────────────────────────────────────────────
// Rule-Based Insights Engine — the deterministic fallback for the coach.
// ─────────────────────────────────────────────────────────────────────
// Gemini produces the richest, most personal advice, but it is not always
// available (no API key, quota exhausted, network error). Rather than show
// the user nothing, this engine ALWAYS produces useful, quantified guidance
// from the same context Gemini sees — the baseline profile plus the month's
// logged activity.
//
// The "logical decision making based on user context" happens here in pure
// code: we score each emission category by how much OPPORTUNITY it still
// holds for this specific user (their baseline intensity minus what they've
// already done this month) and coach the biggest opportunities first.
//
// Pure and deterministic → trivially unit-testable, no I/O, no React.
// ─────────────────────────────────────────────────────────────────────
import { ACTION_CATEGORIES, BASELINE_MULTIPLIERS } from '../../../utils/emissionFactors';
import { savingsByCategory } from '../../../utils/carbonCalculator';

// How carbon-intensive each baseline choice is. A higher number means the
// user has MORE to gain by acting in that category, so we coach it sooner.
const CATEGORY_INTENSITY = {
  [ACTION_CATEGORIES.TRANSPORT]: (p) => BASELINE_MULTIPLIERS.transport[p?.transport] ?? 1,
  [ACTION_CATEGORIES.FOOD]: (p) => BASELINE_MULTIPLIERS.diet[p?.diet] ?? 1,
  [ACTION_CATEGORIES.ENERGY]: (p) => BASELINE_MULTIPLIERS.energy[p?.energy] ?? 1,
  [ACTION_CATEGORIES.WASTE]: () => 1,
  [ACTION_CATEGORIES.WATER]: () => 1,
};

// Context-aware advice templates. Each builder receives the profile so the
// copy and the estimated impact adapt to who the user actually is.
const RECOMMENDATIONS = {
  [ACTION_CATEGORIES.TRANSPORT]: (p) => {
    const heavy = p?.transport === 'car';
    return {
      title: heavy ? 'Swap one car trip for transit' : 'Keep low-carbon travel going',
      detail: heavy
        ? `Driving is your most carbon-intensive baseline. Replacing two short car trips a week with public transit${city(p)} is one of the fastest wins available to you.`
        : `You already travel light. Combining errands into a single trip${city(p)} trims the little that's left.`,
      impact: heavy ? '~10 kg CO₂/month' : '~3 kg CO₂/month',
    };
  },
  [ACTION_CATEGORIES.FOOD]: (p) => {
    const heavy = p?.diet === 'meat_heavy';
    return {
      title: heavy ? 'Add two plant-based meals a week' : 'Lean further into plant meals',
      detail: heavy
        ? 'Your meat-heavy baseline means each plant-based meal saves more than average. Start with two swaps a week — the impact compounds quickly.'
        : 'Your diet is already efficient. Choosing local, seasonal produce shaves the remaining transport emissions from your plate.',
      impact: heavy ? '~14 kg CO₂/month' : '~4 kg CO₂/month',
    };
  },
  [ACTION_CATEGORIES.ENERGY]: (p) => {
    const grid = p?.energy === 'grid';
    return {
      title: grid ? 'Shift heavy appliances off-peak' : 'Trim standby energy use',
      detail: grid
        ? 'Running on grid power, timing your laundry and dishwasher for off-peak hours and washing in cold water cuts real emissions with zero lifestyle cost.'
        : 'With cleaner energy you start ahead — line-drying clothes and unplugging idle devices captures the rest.',
      impact: grid ? '~8 kg CO₂/month' : '~3 kg CO₂/month',
    };
  },
  [ACTION_CATEGORIES.WASTE]: () => ({
    title: 'Close the loop on waste',
    detail:
      'Composting food scraps and recycling consistently keeps methane-producing organics out of landfill. A small daily habit with a steady monthly return.',
    impact: '~5 kg CO₂/month',
  }),
  [ACTION_CATEGORIES.WATER]: () => ({
    title: 'Cut hot-water energy',
    detail:
      'Shorter showers and cold rinses reduce the energy spent heating water — an easy, comfortable saving you can start today.',
    impact: '~2 kg CO₂/month',
  }),
};

/** Appends a localized clause when the user gave a city, else nothing. */
function city(profile) {
  const c = profile?.city?.trim();
  return c ? ` in ${c}` : '';
}

/**
 * Generates up to 3 deterministic, context-aware recommendations.
 * Same return shape as the Gemini path: { title, detail, impact, category }.
 *
 * @param {object} profile   the user's baseline profile
 * @param {object} monthLog  the current month's aggregate log
 * @returns {Array<{title:string, detail:string, impact:string, category:string}>}
 */
export function generateRuleInsights(profile = {}, monthLog = {}) {
  const saved = savingsByCategory(monthLog?.entries ?? []);

  // Opportunity score: how intense the baseline is, discounted by progress
  // already made this month. Higher = coach this category sooner.
  const ranked = Object.values(ACTION_CATEGORIES)
    .map((category) => {
      const intensity = CATEGORY_INTENSITY[category](profile);
      const progress = saved[category] ?? 0;
      // Diminishing returns: every kg already saved this month lowers the
      // remaining opportunity, so we nudge the user toward neglected areas.
      const opportunity = intensity - progress * 0.1;
      return { category, opportunity };
    })
    // Stable, deterministic ordering: opportunity desc, then category name.
    .sort((a, b) => b.opportunity - a.opportunity || a.category.localeCompare(b.category));

  return ranked.slice(0, 3).map(({ category }) => ({
    category,
    ...RECOMMENDATIONS[category](profile),
  }));
}
