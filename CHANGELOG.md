# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Repository pattern** for the tracking domain: a documented interface with
  swappable Firestore (production) and in-memory (tests/local) implementations,
  decoupling the service layer from the database.
- **Static type checking** via JSDoc + `jsconfig.json` (`tsc --checkJs`), wired
  into a `typecheck` npm script and CI.
- **Accessibility linting** with `eslint-plugin-jsx-a11y`.
- **Content-Security-Policy and security headers** on Firebase Hosting.
- Engineering docs: `docs/ARCHITECTURE.md`, `CONTRIBUTING.md`, this changelog,
  and an MIT `LICENSE`.
- `.pre-commit-config.yaml` running format, lint, and typecheck locally.
- Prettier + EditorConfig, a Vitest component/unit suite (with axe accessibility
  assertions) and coverage thresholds, and a GitHub Actions CI pipeline.

### Fixed

- Users could get stranded on the onboarding screen: the registration seed wrote
  `profileCompleted: false`, which (via merge writes + auth-state re-reads) could
  land after the onboarding write and reset the flag. The seed no longer writes
  the flag, so onboarding's `true` is authoritative.

### Changed

- `trackingService` slimmed to thin use-cases that delegate to the repository,
  so the UI is fully unaware of Firestore.
- Dashboard now shows a monthly-goal progress bar and real-world context derived
  from the user's savings.
- Emission factors now cite their public data sources inline.

## [1.0.0]

### Added

- Initial EcoTrace platform: Firebase email/password auth, onboarding baseline,
  daily micro-action logger, pure-function carbon engine, gamified eco-score,
  and Gemini-powered insights with a deterministic rule-based fallback — all on
  the Google Spark free tier with no paid backend.
