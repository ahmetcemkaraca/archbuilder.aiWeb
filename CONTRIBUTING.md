# Contributing Guide

This project follows an Issue-first, GitFlow branching model with conventional commits and CI-enforced quality gates.

## Workflow (GitFlow)

### Branch Strategy
- **main**: Production branch with stable releases only
- **develop**: Integration branch for active development  
- **feature/***: Features branched from develop, merged back to develop
- **release/***: Release preparation from develop, merged to main + develop
- **hotfix/***: Critical fixes from main, merged to main + develop

### Branch Naming
- Features: `feature/<issue-number>-<kebab-title>` (from develop)
- Releases: `release/<version>` (from develop, merge to main + develop)
- Hotfixes: `hotfix/<issue-number>-<kebab-title>` (from main, merge to main + develop)
- Docs: `docs/<kebab-title>` (from develop)

### Development Process
1. Create an Issue describing the change with acceptance criteria and labels.
2. GitFlow branching:
   - **Features**: Branch from `develop` using `feature/<issue>-<kebab-title>`
   - **Hotfixes**: Branch from `main` using `hotfix/<issue>-<kebab-title>`
   - **Releases**: Branch from `develop` using `release/<version>`
   - **Docs**: Branch from `develop` using `docs/<kebab-title>`
3. Implement changes with small, atomic commits using conventional commit messages.
4. Add/update tests, i18n keys (7 locales), and registry entries under `docs/registry/*.json`.
5. Open a PR (draft allowed). Title must be conventional: `feat(scope): summary`. Include `Closes #<issue>`.
   - **Features/Docs**: PR to `develop`
   - **Releases/Hotfixes**: PR to `main`, then merge to `develop`
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
