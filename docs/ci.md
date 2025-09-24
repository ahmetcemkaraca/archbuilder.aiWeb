# CI (Windows) Rehberi

Workflow: `.github/workflows/ci.yml`

## İş Adımları
1. Checkout
2. Registry doğrulama: `pwsh -File scripts/validate-registry.ps1`
3. Context rehydrate: `pwsh -File scripts/rehydrate-context.ps1`

## Hata Kodları (Scripts)
- 2: Registry dosyaları eksik
- 3: JSON geçersiz
- 4: Olası API değişimi var ama `endpoints.json` boş

## Genişletme
- Dil/stack spesifik `lint/test/build` işleri eklenebilir.
