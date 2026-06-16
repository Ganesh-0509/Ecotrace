# Contributing to EcoTrace

Thanks for your interest in improving EcoTrace. This guide covers the local
workflow and the quality gates every change must pass.

## Prerequisites

- **Node.js 20+** and npm
- A Firebase project and a Gemini API key are only needed to run the *full* app.
  The unit suite and the rule-based coach run with **no credentials**, so most
  development needs no cloud setup.

## Getting started

```bash
npm install
cp .env.example .env     # fill in Firebase + Gemini keys (optional for tests)
npm run dev              # http://localhost:5173
```

The app degrades to a "setup required" state when env vars are absent, so it
boots cleanly even before you configure cloud services.

## Project layout

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the layering rules. In
short: keep the dependency direction `domain → utils → features → pages`, put
pure math in `src/utils/` / `src/domain/` (no React, no I/O), and depend on the
repository **interface** rather than a concrete backend.

## Quality gates

All of these run in CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))
on every push and pull request to `main`. Run them locally before pushing:

| Gate | Command | Enforces |
| --- | --- | --- |
| Format | `npm run format:check` | Consistent Prettier formatting |
| Lint | `npm run lint` | ESLint style + `jsx-a11y` accessibility rules |
| Types | `npm run typecheck` | Strict TypeScript verified by `tsc --noEmit` |
| Tests | `npm test` | Vitest unit + component (+ axe a11y) suites |
| Coverage | `npm run coverage` | Thresholds on the pure logic layers |
| Build | `npm run build` | Production bundle compiles |

`npm run format` auto-fixes formatting.

## Pre-commit hooks (optional but recommended)

This repo ships a [`.pre-commit-config.yaml`](.pre-commit-config.yaml) that runs
format, lint, and typecheck before each commit. Enable it once with:

```bash
pip install pre-commit   # or: pipx install pre-commit
pre-commit install
```

## Coding conventions

- **Type everything (strict TypeScript).** Annotate exported functions and
  component props; `tsc` runs with `strict` enabled — avoid `any`.
- **No magic numbers.** Emission factors and thresholds are named constants that
  cite their source (see `src/utils/emissionFactors.ts`).
- **Accessibility by construction.** Use semantic HTML and the shared `Field`
  component; new interactive UI must pass the `jsx-a11y` rules and its axe test.
- **Tests co-locate** with the unit they cover (`Foo.tsx` → `Foo.test.tsx`).

## Commit messages

Use clear, imperative subject lines (e.g. `Add insight caching`). Group related
changes; keep unrelated changes in separate commits.
