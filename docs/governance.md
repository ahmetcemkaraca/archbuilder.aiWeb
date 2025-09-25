# Yönetişim ve Operasyon Kuralları

Bu belge; dil politikası, kayıt defteri (registry), kalıcı bağlam (persistent context), oturum yönetimi, sürümleme kadransı, CI/kalite kapıları ve geliştirici akışını tanımlar.

## Dil Politikası
- Kod ve tanımlayıcılar (identifiers): English
- Kod içi yorumlar ve log mesajları: Türkçe
- UI metinleri: i18n ile; varsayılan EN, TR çeviri sağlanır. Bileşenlerde string hardcode edilmez.
- Kullanıcıya sohbet yanıtları: Türkçe, kısa ve uygulanabilir.

## Registry (Kayıt Defteri)
- Konum: `docs/registry/`
  - `identifiers.json`: modüller, export edilen fonksiyonlar/sınıflar, değişkenler, config anahtarları
  - `endpoints.json`: HTTP/gRPC/GraphQL sözleşmeleri (method, path, input/output şemaları, auth, version)
  - `schemas.json`: veri modelleri, DB tabloları, migration kimlikleri
- Kural: Public sözleşme/kimlik değiştiğinde aynı branch içinde registry güncellenir, test eklenir.

## Kalıcı Bağlam (Persistent Context)
- Konum: `.mds/context/`
  - `current-context.md`: aktif sözleşmelerin ve kritik değişkenlerin kısa özeti
  - `history/NNNN.md`: her oturum için eklenen kısa özet; özetleme/temizleme öncesi yazılır
- Rehydrate: Yeni oturumda önce registry + `current-context.md` okunur.

## Oturum Yönetimi
- Özetleme ve bağlam sıfırlama öncesi: `history/NNNN.md` yarat ve `current-context.md`yi güncelle.
- Ardından bir sonraki oturumda rehydrate et ve işe başla.

## Sürümleme ve Kadans
- SemVer kullanılır (MAJOR.MINOR.PATCH). Conventional Commits ile eşle.
- Yerel kadans: Her 2 prompt sonunda `version.md` güncellenir. Zaman damgası PowerShell ile yazılır: `Get-Date -Format 'yyyy-MM-dd HH:mm:ss'`.

## CI ve Kalite Kapıları
- Windows CI workflow: `scripts/validate-registry.ps1` ve `scripts/rehydrate-context.ps1` çalıştırır.
- Registry kodla uyumsuzsa merge engellenir.

## Geliştirici Akışı
- Issue-first: Her değişiklik bir Issue ile başlar (özet, motivasyon, acceptance criteria, etiketler).
- Branching: `main`'den dal al. İsimler: `feature/<issue>-<kebab-title>`, `fix/<issue>-<kebab-title>`, `hotfix/<kebab-title>`, `docs/<kebab-title>`.
- Commits: Küçük ve atomik; Conventional Commits formatı zorunlu: `feat|fix|docs|chore|refactor|test|perf(scope): mesaj`.
- Before coding: `.mds/context/current-context.md` + `docs/registry/*.json` oku; i18n planla.
- After coding: Registry güncelle; `current-context.md`yi tazele; `history/NNNN.md`ye özet yaz; test ekle; scriptleri çalıştır.
- Pull Request: Başlık conventional, açıklamada `Closes #<issue>` olmalı; checklist (lint, test, i18n, registry) yeşil; Squash & Merge, branch sil.

## Otomasyon
- PR Governance workflow: PR başlığı, issue bağlantısı ve branch ismini doğrular.
- Lint workflow: PR ve main üzerinde ESLint çalıştırır.
- CODEOWNERS: çekirdek yollar için otomatik reviewer ataması yapar.

## Replit Agent ve Copilot
- Promptlar registry/context adımlarını açıkça talep eder.
- Çakışma durumlarında `conflict-resolution-governance.prompt.md` kullan ve kararı `history/` içine yaz.
