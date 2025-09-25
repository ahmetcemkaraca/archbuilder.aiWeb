---
applyTo: "**/*"
description: Developer role — implement vertical slices with tests and docs.
---
As the Developer:
- For each task, implement code + tests, run locally, and document commands.
- Keep edits small and verifiable; maintain green tests.
- Respect interfaces and contracts from `docs/registry/*.json` and `project.md`.
- **Use agent tools for file operations** - When creating, editing, or managing files, prefer using appropriate agent tools (create_file, replace_string_in_file, etc.) over manual approaches
- Add observability hooks; handle errors cleanly; avoid leaky abstractions.
- Update `.mds/Todo.md` progress and `CHANGELOG.md` entries when applicable.

GitFlow (Issue → Branch → Commits → PR → Merge):
- Issue-first: Every change must have an Issue with summary, motivation, acceptance criteria, and labels (bug/feature/docs). Link PRs with `Closes #<id>`.
- Branch structure: `main` (production), `develop` (integration), plus supporting branches
- Branching strategy:
  - **Features**: Branch from `develop`, merge back to `develop`. Naming: `feature/<issue>-<kebab-title>`
  - **Releases**: Branch from `develop`, merge to both `main` and `develop`. Naming: `release/<version>`  
  - **Hotfixes**: Branch from `main`, merge to both `main` and `develop`. Naming: `hotfix/<issue>-<kebab-title>`
  - **Docs**: Branch from `develop`, merge to `develop`. Naming: `docs/<kebab-title>`
- Commits: Keep atomic; conventional commits required: `feat|fix|docs|chore|refactor|test|perf(scope): message`. Prefer imperative mood; include rationale in body if non-trivial.
- Pull Requests: Open early as draft if WIP. Checklist must pass (lint, tests, i18n, registry). Request reviews from CODEOWNERS. Ensure CI green before merge.
- Merge strategy: Squash and merge by default to keep a linear history. Delete merged branches after successful merge.

Severity & Milestones:
- Use labels: `S1-critical`, `S2-high`, `S3-medium`, `S4-low`, `security`, `performance`, `i18n`, `a11y`.
- Optionally assign milestones/releases; hotfixes target `main` directly via `hotfix/*`.

Before coding (checklist)
- Read `.mds/context/current-context.md` and `docs/registry/*.json` to rehydrate context.
- If adding/renaming/removing functions, variables, endpoints, or schemas, plan corresponding registry updates.
- For UI text, add/modify i18n resources (TR default). Do not hardcode strings.
- Ensure an Issue exists with acceptance criteria and labels; confirm scope and risks.
- Create a dedicated branch using GitFlow conventions:
  - **Features/Docs**: Branch from `develop` → merge to `develop`
  - **Hotfixes**: Branch from `main` → merge to both `main` and `develop`
  - **Releases**: Branch from `develop` → merge to both `main` and `develop`

After coding (checklist)
- Update `docs/registry/identifiers.json`, `endpoints.json`, `schemas.json` as applicable.
- Refresh `.mds/context/current-context.md`; append a short session summary under `.mds/context/history/NNNN.md`.
- Add at least one test covering the new/changed contract.
- Run validation scripts (Windows PowerShell):
  - `pwsh -File scripts/validate-registry.ps1`
  - `pwsh -File scripts/rehydrate-context.ps1`
 - Open a PR with: linked Issue (`Closes #id`), risk notes, screenshots for UI, and rollout/rollback plan.
 - Ensure ESLint/TypeScript/tests pass in CI; address reviewer feedback promptly.

Environment targets
- Cloud server: Python 3.12 (pin in CI and docs)
- Desktop: WPF on .NET (target Revit-supported runtime)