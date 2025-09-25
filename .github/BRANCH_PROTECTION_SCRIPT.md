# GitHub Branch Protection Rules - Quick Setup Script

Bu PowerShell script'i GitHub CLI kullanarak branch protection rules'ları otomatik olarak kurar.

## Gereksinimler

1. GitHub CLI kurulu olmalı: `winget install GitHub.cli`
2. GitHub'da authenticate edilmiş olmalı: `gh auth login`
3. Repository admin yetkisi gerekli

## Branch Protection Setup Script

```powershell
# GitHub CLI ile branch protection rules kurulumu
# Repository: archbuilder.aiWeb
# Owner: ahmetcemkaraca

# Repository context
$REPO = "ahmetcemkaraca/archbuilder.aiWeb"

Write-Host "🚀 Setting up GitFlow branch protection rules for $REPO" -ForegroundColor Green

# 1. Main branch protection (Production)
Write-Host "📦 Configuring main branch protection..." -ForegroundColor Yellow

gh api repos/$REPO/branches/main/protection `
  --method PUT `
  --field required_status_checks='{"strict":true,"contexts":["lint","validate"]}' `
  --field enforce_admins=true `
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' `
  --field restrictions=null `
  --field allow_force_pushes=false `
  --field allow_deletions=false

# 2. Develop branch protection (Integration)  
Write-Host "🔧 Configuring develop branch protection..." -ForegroundColor Yellow

gh api repos/$REPO/branches/develop/protection `
  --method PUT `
  --field required_status_checks='{"strict":true,"contexts":["lint","validate"]}' `
  --field enforce_admins=false `
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' `
  --field restrictions=null `
  --field allow_force_pushes=false `
  --field allow_deletions=false

# 3. Set develop as default branch
Write-Host "🎯 Setting develop as default branch..." -ForegroundColor Yellow

gh api repos/$REPO `
  --method PATCH `
  --field default_branch="develop"

# 4. Configure repository settings for GitFlow
Write-Host "⚙️  Configuring repository merge settings..." -ForegroundColor Yellow

gh api repos/$REPO `
  --method PATCH `
  --field allow_squash_merge=true `
  --field allow_merge_commit=false `
  --field allow_rebase_merge=false `
  --field delete_branch_on_merge=true

Write-Host "✅ Branch protection rules successfully configured!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  • main branch: Protected, admin-only, requires PR + CI" -ForegroundColor White
Write-Host "  • develop branch: Protected, requires PR + CI, default branch" -ForegroundColor White  
Write-Host "  • Merge strategy: Squash only, auto-delete branches" -ForegroundColor White
Write-Host "  • Status checks: lint, validate (from workflows)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify settings at: https://github.com/$REPO/settings/branches" -ForegroundColor White
Write-Host "  2. Test by creating a feature branch and opening PR" -ForegroundColor White
Write-Host "  3. Ensure status checks appear after running workflows" -ForegroundColor White
```

## Manual Setup via GitHub Web Interface

Eğer CLI kullanmak istemiyorsan, web interface'den manuel kurulum için:

### 1. Repository Settings
- Go to: `https://github.com/ahmetcemkaraca/archbuilder.aiWeb/settings`
- Navigate to: **Branches** (left sidebar)

### 2. Main Branch Rules
**Add rule** → **Branch name pattern**: `main`

**Settings to Enable:**
- ✅ Require a pull request before merging
  - Require approvals: `1`
  - Dismiss stale PR approvals: `✅`
  - Require review from code owners: `✅`
- ✅ Require status checks to pass before merging
  - Require branches to be up to date: `✅`
  - Status checks: `lint`, `validate`
- ✅ Require conversation resolution before merging
- ✅ Restrict pushes that create matching files
- ✅ Do not allow bypassing the above settings

### 3. Develop Branch Rules  
**Add rule** → **Branch name pattern**: `develop`

**Settings to Enable:**
- ✅ Require a pull request before merging
  - Require approvals: `1`
  - Dismiss stale PR approvals: `✅`
  - Require review from code owners: `✅`
- ✅ Require status checks to pass before merging
  - Status checks: `lint`, `validate`
- ✅ Require conversation resolution before merging

### 4. General Repository Settings
**Settings** → **General** → **Pull Requests**:
- ✅ Allow squash merging: `On`
- ❌ Allow merge commits: `Off`
- ❌ Allow rebase merging: `Off`  
- ✅ Always suggest updating pull request branches: `On`
- ✅ Automatically delete head branches: `On`

**Default branch**: Change to `develop`

## Verification Steps

### Test Branch Protection
```powershell
# Test 1: Try direct push to main (should fail)
git checkout main
git commit --allow-empty -m "test: direct push to main"
git push origin main
# Expected: ❌ Error - protected branch

# Test 2: Create feature branch and PR (should work)
git checkout develop
git checkout -b feature/test-protection
git commit --allow-empty -m "test: feature branch commit"
git push origin feature/test-protection
# Create PR via GitHub UI → should work

# Test 3: Try to merge without approval (should fail)
# Expected: ❌ Error - requires review
```

### Status Checks Verification
1. Open a PR from feature branch to develop
2. Check that workflows run automatically
3. Verify `lint` and `validate` appear as required checks
4. Ensure PR cannot merge until checks pass

## Troubleshooting

### Status Checks Not Appearing
- PR must be opened first to trigger workflows
- Workflows must run successfully at least once
- Check workflow names match exactly: `lint`, `validate`

### Admin Can Still Push
- Ensure "Do not allow bypassing" is enabled
- Check admin permissions in repository settings

### Default Branch Issues
- Update via Settings → General → Default branch
- Existing PRs may still target old default branch
- Update local git config: `git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/develop`

## Security Notes

- Main branch should only accept release merges
- Develop branch accepts feature merges
- All changes require code review (CODEOWNERS)
- Status checks ensure CI passes before merge
- Force push disabled on protected branches
- Auto-delete prevents branch accumulation