# Contributing Guide

This project follows an Issue-first, branch-based GitHub Flow with conventional commits and CI-enforced quality gates.

## Workflow
1. Create an Issue describing the change with acceptance criteria and labels.
2. Branch from `main` using `feature/<issue>-<kebab-title>` or `fix/<issue>-<kebab-title>`.
3. Implement changes with small, atomic commits using conventional commit messages.
4. Add/update tests, i18n keys (7 locales), and registry entries under `docs/registry/*.json`.
5. Open a PR (draft allowed). Title must be conventional: `feat(scope): summary`. Include `Closes #<issue>`.
6. Ensure CI is green (lint, typecheck, tests). After review, Squash & Merge and delete the branch.

## Commit Message Format
`<type>(<scope>): <imperative summary>`

Allowed types: feat, fix, docs, chore, refactor, test, perf, build, ci.

## Labels & Severity
Use severity labels: S1-critical, S2-high, S3-medium, S4-low. Add `security`, `performance`, `i18n`, `a11y` when relevant.

## Security
- No secrets in code. Use environment variables with `NEXT_PUBLIC_` prefix for client-side only (static site).
- Add STRIDE notes for security-sensitive changes in PR description.

## i18n
- All UI text must come from the custom i18n context under `src/lib/i18n`.
- Provide keys for all 7 locales.

## Registry
Update `docs/registry/identifiers.json`, `endpoints.json` (if any), and `schemas.json` when public contracts change.
