// Shared accessibility-check helper for component tests.
// jsdom has no layout engine or canvas, so axe's `color-contrast` rule can't
// run there (it tries to read pixels) and only emits noise. We disable that
// one rule and keep every other WCAG check active. Contrast is verified
// against the real design tokens in the browser, not in unit tests.
import { axe } from 'vitest-axe';

export const checkA11y = (node) => axe(node, { rules: { 'color-contrast': { enabled: false } } });
