# Changelog

All notable changes to the ArchBuilder.AI Website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-25

### Added
- **GitFlow Branching Model**: Complete migration from GitHub Flow to GitFlow
  - Created `develop` branch as integration branch
  - Updated branch naming conventions: `feature/*`, `release/*`, `hotfix/*`
  - Implemented proper branch protection strategy

- **Governance & Documentation**:
  - Added comprehensive Issue templates (bug report, feature request, documentation)
  - Created detailed Pull Request template with checklists
  - Implemented CODEOWNERS file for code review governance
  - Added SECURITY.md for security policy documentation
  - Created CONTRIBUTING.md with detailed contribution guidelines

- **CI/CD Workflows**:
  - Added PR governance workflow with branch validation
  - Implemented lint workflow with Turbo support
  - Added conventional commit validation
  - Created status check requirements for protected branches

- **Branch Protection Documentation**:
  - Added `BRANCH_PROTECTION_SETUP.md` for manual setup guide
  - Created `BRANCH_PROTECTION_SCRIPT.md` with automated CLI setup
  - Included `GITFLOW_GUIDE.md` with comprehensive workflow examples
  - Added troubleshooting and verification steps

### Changed
- **Project Structure**: 
  - Updated from GitHub Flow to GitFlow branching model
  - Changed default branch from `main` to `develop`
  - Modified merge strategy to squash-only for cleaner history

- **Development Workflow**:
  - Enhanced developer instructions with GitFlow patterns
  - Updated copilot instructions for AI agent compliance
  - Modified registry system to track GitFlow governance modules

- **Quality Gates**:
  - Strengthened PR requirements with mandatory issue linking
  - Enhanced code review process with CODEOWNERS
  - Added comprehensive status check requirements

### Security
- **Branch Protection**: Implemented enterprise-grade protection rules
  - `main` branch: Admin-only access, production releases only
  - `develop` branch: PR required, code review mandatory
  - Force push disabled on protected branches
  - Status checks required for all merges

- **Code Review**: Enhanced review process
  - CODEOWNERS file ensures proper review assignments
  - Critical files require additional scrutiny
  - Global ownership pattern for comprehensive coverage

### Technical Improvements
- **CI/CD**: Optimized GitHub Actions workflows
  - Added Turbopack support for faster builds
  - Implemented parallel status checks
  - Enhanced dependency management with legacy-peer-deps

- **Documentation**: Comprehensive governance documentation
  - Issue-first development workflow
  - Release management procedures
  - Hotfix emergency procedures
  - Testing and validation strategies

### Migration Notes
- Successfully migrated from GitHub Flow to GitFlow
- All existing feature branches preserved
- Registry system updated for new governance structure
- Context management enhanced for better session tracking

## [1.0.0] - 2025-09-24

### Added
- Initial project setup with Next.js 15.5.3
- Custom i18n system with 7 language support
- Firebase integration for authentication and data collection
- Modern UI with Tailwind CSS 4 and dark/light theme support
- Static export capability for flexible deployment
- Performance monitoring and analytics integration
- Responsive design with mobile-first approach

### Features
- **Multilingual Support**: TR, EN, DE, FR, ES, IT, PT
- **Static Export**: CDN-ready deployment
- **Theme System**: Dark/light mode with system preference detection
- **Analytics**: Google Analytics 4 and Firebase Analytics integration
- **Performance**: Lighthouse score optimization (≥90 target)
- **Accessibility**: a11y-first design principles

### Infrastructure
- **Deployment**: Support for Netlify, Vercel, and static hosting
- **Monitoring**: Health checks, uptime monitoring, error tracking
- **Security**: Content Security Policy, input validation, XSS protection
- **Testing**: Jest setup with component testing capabilities

---

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions  
- **PATCH** version for backwards-compatible bug fixes

## Release Process

Following GitFlow methodology:

1. **Feature Development**: `feature/*` → `develop`
2. **Release Preparation**: `release/*` from `develop` → `main`
3. **Hotfixes**: `hotfix/*` from `main` → `main` + `develop`
4. **Version Tagging**: Create git tags for all releases on `main`