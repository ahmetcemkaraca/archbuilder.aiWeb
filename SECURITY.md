# Security Policy

## Supported Versions
This is a static-exported Next.js website. No server-side runtime is exposed by default.

## Reporting a Vulnerability
- Create a private security advisory on GitHub or email the maintainer.
- Provide reproduction steps and impact assessment.
- Do not open public issues for undisclosed vulnerabilities.

## Secrets
- No secrets in code. Client-side env vars must be prefixed with `NEXT_PUBLIC_`.
- Rotate credentials via your hosting provider; never commit them.

## Data Protection
- Form data is stored in Firebase (Firestore/Auth). Review Firebase Security Rules.
- Follow STRIDE notes in PRs for security-sensitive changes.

## Dependencies
- Automated Dependabot is enabled (`.github/dependabot.yml`).
- Fix high severity vulnerabilities within S1 timelines; otherwise block release.
