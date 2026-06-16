// Global test setup, loaded once before every test file (see vite.config.js).
// Adds two families of custom matchers:
//   • @testing-library/jest-dom — DOM assertions (toBeInTheDocument, etc.)
//   • vitest-axe                — automated accessibility assertions
//                                 (expect(await axe(node)).toHaveNoViolations())
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(axeMatchers);
