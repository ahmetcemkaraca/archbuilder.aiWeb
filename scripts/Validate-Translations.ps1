# ArchBuilder.AI Çeviri Doğrulama PowerShell Script'i
# 
# Bu script tüm dil çevirilerinin eksiksiz olduğunu kontrol eder.
# 
# Kullanım:
#   .\scripts\Validate-Translations.ps1
#   .\scripts\Validate-Translations.ps1 -Locale "es"
#   .\scripts\Validate-Translations.ps1 -Detailed
#   .\scripts\Validate-Translations.ps1 -GenerateTemplate -Locale "it"

param(
    [string]$Locale = "",
    [switch]$Detailed = $false,
    [switch]$GenerateTemplate = $false,
    [switch]$Help = $false
)

# Yardım metni
if ($Help) {
    Write-Host "🌐 ArchBuilder.AI Çeviri Doğrulama Sistemi" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Kullanım:" -ForegroundColor Yellow
    Write-Host "  .\scripts\Validate-Translations.ps1                    # Genel rapor"
    Write-Host "  .\scripts\Validate-Translations.ps1 -Locale es        # Belirli dil için rapor"
    Write-Host "  .\scripts\Validate-Translations.ps1 -Detailed         # Detaylı genel rapor"
    Write-Host "  .\scripts\Validate-Translations.ps1 -GenerateTemplate -Locale it  # Template oluştur"
    Write-Host ""
    Write-Host "Parametreler:" -ForegroundColor Yellow
    Write-Host "  -Locale       : Kontrol edilecek dil kodu (tr, en, ru, de, fr, es, it)"
    Write-Host "  -Detailed     : Detaylı istatistikler göster"
    Write-Host "  -GenerateTemplate : Eksik anahtarlar için template oluştur"
    Write-Host "  -Help         : Bu yardım metnini göster"
    Write-Host ""
    Write-Host "Desteklenen Diller:" -ForegroundColor Yellow
    Write-Host "  tr (Türkçe), en (English), ru (Русский), de (Deutsch),"
    Write-Host "  fr (Français), es (Español), it (Italiano)"
    exit 0
}

# Ana function
function Invoke-TranslationValidation {
    Write-Host "🌐 ArchBuilder.AI Çeviri Doğrulama Sistemi" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    
    # Desteklenen dilleri kontrol et
    $supportedLocales = @("tr", "en", "ru", "de", "fr", "es", "it")
    
    if ($Locale -and $Locale -notin $supportedLocales) {
        Write-Host "❌ Geçersiz dil kodu: $Locale" -ForegroundColor Red
        Write-Host "Desteklenen diller: $($supportedLocales -join ', ')" -ForegroundColor Yellow
        exit 1
    }
    
    # Node.js komutu hazırla
    $nodeArgs = @()
    
    if ($Locale) {
        $nodeArgs += "--locale=$Locale"
    }
    
    if ($Detailed) {
        $nodeArgs += "--detailed"
    }
    
    if ($GenerateTemplate) {
        $nodeArgs += "--generate-template"
    }
    
    # Node.js script'ini çalıştır
    try {
        $nodeCommand = "node"
        $scriptPath = "scripts/validate-translations.js"
        
        # Script dosyasının varlığını kontrol et
        if (-not (Test-Path $scriptPath)) {
            Write-Host "❌ Script dosyası bulunamadı: $scriptPath" -ForegroundColor Red
            Write-Host "Lütfen proje kök dizininde olduğunuzdan emin olun." -ForegroundColor Yellow
            exit 1
        }
        
        # Node.js'in yüklü olup olmadığını kontrol et
        $nodeVersion = & node --version 2>$null
        if (-not $nodeVersion) {
            Write-Host "❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin." -ForegroundColor Red
            exit 1
        }
        
        Write-Host "📝 Node.js version: $nodeVersion" -ForegroundColor Green
        Write-Host "🔄 Çeviri doğrulaması başlatılıyor..." -ForegroundColor Blue
        Write-Host ""
        
        # Komutu çalıştır
        if ($nodeArgs.Count -gt 0) {
            & $nodeCommand $scriptPath $nodeArgs
        } else {
            & $nodeCommand $scriptPath
        }
        
        $exitCode = $LASTEXITCODE
        
        if ($exitCode -eq 0) {
            Write-Host ""
            Write-Host "✅ Çeviri doğrulaması başarıyla tamamlandı!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️  Çeviri doğrulaması tamamlandı ancak bazı sorunlar tespit edildi." -ForegroundColor Yellow
        }
        
        exit $exitCode
        
    } catch {
        Write-Host "❌ Script çalışırken hata oluştu:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

# Build check
function Test-BuildStatus {
    Write-Host "🔧 Build durumu kontrol ediliyor..." -ForegroundColor Blue
    
    try {
        $buildResult = & npm run build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build başarılı" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Build başarısız" -ForegroundColor Red
            Write-Host $buildResult -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ Build kontrol edilirken hata: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Package.json kontrol
function Test-PackageJson {
    if (-not (Test-Path "package.json")) {
        Write-Host "❌ package.json bulunamadı. Proje kök dizininde olduğunuzdan emin olun." -ForegroundColor Red
        return $false
    }
    
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "📦 Proje: $($packageJson.name) v$($packageJson.version)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ package.json okunamadı: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Pre-validation checks
Write-Host "🔍 Ön kontroller yapılıyor..." -ForegroundColor Blue

if (-not (Test-PackageJson)) {
    exit 1
}

# Ana validation'ı çalıştır
try {
    Invoke-TranslationValidation
} catch {
    Write-Host "❌ Script çalışırken kritik hata: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}