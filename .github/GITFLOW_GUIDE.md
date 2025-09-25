# GitFlow Branching Model Guide

## Branch Overview
- **main**: Production releases only (protected)
- **develop**: Integration branch (protected, default for PRs)
- **feature/***: New features (from develop → to develop)
- **release/***: Release preparation (from develop → to main + develop)
- **hotfix/***: Critical fixes (from main → to main + develop)

## Workflow Examples

### Feature Development
```bash
# Start feature from develop
git checkout develop
git pull origin develop
git checkout -b feature/123-add-user-profile

# Work on feature...
git add .
git commit -m "feat(profile): add user profile component"

# Create PR: feature/123-add-user-profile → develop
# After review and merge, delete feature branch
```

### Release Process  
```bash
# Start release from develop
git checkout develop
git pull origin develop
git checkout -b release/1.2.0

# Finalize release (version bumps, changelog)
git add .
git commit -m "chore(release): prepare version 1.2.0"

# Create PR: release/1.2.0 → main
# After merge to main, merge main → develop
git checkout develop
git merge main --no-ff
```

### Hotfix Process
```bash
# Start hotfix from main
git checkout main  
git pull origin main
git checkout -b hotfix/456-critical-bug-fix

# Fix the critical issue
git add .
git commit -m "fix(auth): resolve login security issue"

# Create PR: hotfix/456-critical-bug-fix → main
# After merge to main, merge main → develop  
git checkout develop
git merge main --no-ff
```

## Branch Protection Rules

### main branch
- Require PR reviews: 1 reviewer
- Require status checks (CI)
- Restrict pushes to admins only
- No direct commits allowed

### develop branch  
- Require PR reviews: 1 reviewer
- Require status checks (CI) 
- Allow squash merge only
- Auto-delete head branches

## CI/CD Integration
- **PR validation**: All feature/hotfix/release branches
- **CI runs on**: main, develop branches
- **Deployment**: main branch only (production)
- **Preview builds**: develop branch (staging)

## Migration Notes
- ✅ Created develop branch from main
- ✅ Updated workflow files for GitFlow
- ✅ Updated governance documentation  
- ✅ Modified PR validation rules
- 🔄 Recommend setting branch protection rules in GitHub