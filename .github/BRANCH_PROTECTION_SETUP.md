# GitHub Branch Protection Rules Setup Guide

Bu rehber ArchBuilder.AI Web projesi için GitFlow branch protection kurallarının nasıl kurulacağını detaylandırır.

## Branch Protection Rules Kurulum Adımları

### 1. Repository Settings'e Giriş
1. GitHub'da repository sayfasına git: `https://github.com/ahmetcemkaraca/archbuilder.aiWeb`
2. **Settings** sekmesine tıkla
3. Sol menüden **Branches** seçeneğini seç

### 2. Main Branch Protection Rules

**Branch name pattern**: `main`

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1**
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (CODEOWNERS dosyası var)
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `lint` (lint workflow'dan)
    - `validate` (PR governance workflow'dan)
    
- ✅ **Require conversation resolution before merging**

- ✅ **Restrict pushes that create matching files**
  - ✅ Restrict pushes to admins and selected roles only
  - Admin users: Repository admins only

- ✅ **Allow force pushes**: ❌ (Kapalı)
- ✅ **Allow deletions**: ❌ (Kapalı)

#### Advanced Settings:
- ✅ **Do not allow bypassing the above settings**
- ✅ **Lock branch** (Optional - production için önerilen)

### 3. Develop Branch Protection Rules  

**Branch name pattern**: `develop`

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1**
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `lint` (lint workflow'dan)
    - `validate` (PR governance workflow'dan)
    
- ✅ **Require conversation resolution before merging**

- ✅ **Allow force pushes**: ❌ (Kapalı)
- ✅ **Allow deletions**: ❌ (Kapalı)

#### Merge Settings:
- ✅ **Allow squash merging**: ✅ (Açık)
- ✅ **Allow merge commits**: ❌ (Kapalı) 
- ✅ **Allow rebase merging**: ❌ (Kapalı)
- ✅ **Automatically delete head branches**: ✅ (Açık)

### 4. Wildcard Pattern Protection (Optional)

#### Feature Branches: `feature/**`
**Gerekli değil** - Feature branch'ler geçicidir ve protection'a ihtiyaç yoktur.

#### Release Branches: `release/**`
**Branch name pattern**: `release/**`

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **2** (Release için daha katı)
  - ✅ Require review from code owners
  
- ✅ **Require status checks to pass before merging**
  - Required status checks: `lint`, `validate`

## Repository Settings Optimizasyonu

### General Settings
1. **Settings > General** sekmesine git
2. **Pull Requests** bölümünde:
   - ✅ **Allow squash merging**: Açık
   - ✅ **Allow merge commits**: Kapalı
   - ✅ **Allow rebase merging**: Kapalı
   - ✅ **Always suggest updating pull request branches**: Açık
   - ✅ **Automatically delete head branches**: Açık

### Default Branch Ayarı
1. **Settings > General** sekmesinde
2. **Default branch** bölümünde `develop` olarak değiştir
3. Bu sayede yeni PR'lar otomatik olarak develop'a açılır

## CI/CD Workflow Status Checks

### Gerekli Workflow Checks
Aşağıdaki workflow'ların status check olarak eklenmesi gerekir:

```yaml
# .github/workflows/pr-governance.yml'den
- validate (PR Governance)

# .github/workflows/lint.yml'den  
- lint (Quick Lint Check)
```

### Status Check Ekleme
1. Branch protection rule'da **Require status checks** aktif et
2. **Search for status checks in the last week** kutusuna şunları yaz:
   - `validate`
   - `lint`
3. Her birini seç ve ekle

## Güvenlik Önerileri

### CODEOWNERS Dosyası
```
# Global code owners for all changes
* @ahmetcemkaraca

# Critical files require additional review
/.github/ @ahmetcemkaraca
/docs/governance.md @ahmetcemkaraca
/CONTRIBUTING.md @ahmetcemkaraca
/SECURITY.md @ahmetcemkaraca
```

### Environment Protection (GitHub Pro)
Eğer GitHub Pro aboneliği varsa:
- **Settings > Environments** sekmesinden
- `production` environment oluştur
- **Required reviewers**: Admin users
- **Deployment branches**: `main` branch only

## Kontrol Listesi

Branch protection rules kurulumu sonrası kontrol et:

- [ ] **main** branch protected (admin-only push)
- [ ] **develop** branch protected (PR required)
- [ ] Default branch **develop** olarak ayarlandı
- [ ] Status checks (`lint`, `validate`) eklendi
- [ ] CODEOWNERS dosyası aktif
- [ ] Auto-delete head branches aktif
- [ ] Only squash merge allowed
- [ ] Force push disabled on protected branches

## Test Senaryosu

Kurulum sonrası test et:
1. Yeni bir feature branch oluştur: `feature/test-protection`
2. Değişiklik yap ve commit et
3. PR açmaya çalış → develop'a açılmalı
4. Direct push yapmaya çalış → Engellenmeli
5. PR review'ı geçmeden merge etmeye çalış → Engellenmeli

## Sorun Giderme

### Status Check Gözükmüyor
- PR açılmış ve workflow çalışmış olmalı
- Son 1 hafta içinde workflow çalışmış olmalı
- Workflow name'leri doğru yazılmalı

### Admin Bypass
- **Do not allow bypassing** seçeneği aktif olmalı
- Repository admin'leri bile bu kurallara uymalı

### Default Branch Değişmiyor
- Settings > General > Default branch'i güncelle
- Existing PR'lar eski branch'e yönlendirilmiş olabilir

Bu ayarlar GitFlow workflow'unu tam olarak destekler ve kod kalitesini garanti eder.