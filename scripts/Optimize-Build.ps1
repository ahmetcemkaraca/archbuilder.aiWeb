# ArchBuilder.AI Build Performance Optimization Script
# 
# Bu script build performansını optimize eder ve bundle analizini gerçekleştirir.
# 
# Kullanım:
#   .\scripts\Optimize-Build.ps1
#   .\scripts\Optimize-Build.ps1 -Analyze
#   .\scripts\Optimize-Build.ps1 -Production

param(
    [switch]$Analyze = $false,
    [switch]$Production = $false,
    [switch]$Verbose = $false,
    [switch]$Help = $false
)

# Yardım metni
if ($Help) {
    Write-Host "🚀 ArchBuilder.AI Build Performance Optimization" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Bu script build sürecini optimize eder ve performance analizini gerçekleştirir." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Kullanım:" -ForegroundColor Yellow
    Write-Host "  .\scripts\Optimize-Build.ps1                    # Temel optimizasyon"
    Write-Host "  .\scripts\Optimize-Build.ps1 -Analyze          # Bundle analizi ile"
    Write-Host "  .\scripts\Optimize-Build.ps1 -Production       # Production build"
    Write-Host "  .\scripts\Optimize-Build.ps1 -Verbose          # Detaylı çıktı"
    Write-Host ""
    Write-Host "Parametreler:" -ForegroundColor Yellow
    Write-Host "  -Analyze      : Webpack bundle analyzer ile detaylı analiz"
    Write-Host "  -Production   : Production environment build"
    Write-Host "  -Verbose      : Detaylı çıktı ve debug bilgileri"
    Write-Host "  -Help         : Bu yardım metnini göster"
    exit 0
}

# Başlık
Write-Host "🚀 ArchBuilder.AI Build Performance Optimization" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Pre-build checks
function Test-Prerequisites {
    Write-Host "🔍 Ön kontroller yapılıyor..." -ForegroundColor Blue
    
    # Node.js version check
    try {
        $nodeVersion = & node --version 2>$null
        if (-not $nodeVersion) {
            Write-Host "❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin." -ForegroundColor Red
            return $false
        }
        Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js kontrol edilemedi: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    # package.json check
    if (-not (Test-Path "package.json")) {
        Write-Host "❌ package.json bulunamadı. Proje kök dizininde olduğunuzdan emin olun." -ForegroundColor Red
        return $false
    }
    
    # Dependencies check
    if (-not (Test-Path "node_modules")) {
        Write-Host "⚠️  node_modules bulunamadı. Dependencies yükleniyor..." -ForegroundColor Yellow
        try {
            & npm install
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Dependencies yüklenirken hata oluştu." -ForegroundColor Red
                return $false
            }
        } catch {
            Write-Host "❌ npm install hatası: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    
    Write-Host "✅ Tüm ön kontroller başarılı" -ForegroundColor Green
    return $true
}

# Build optimizasyonu
function Invoke-OptimizedBuild {
    Write-Host "🔧 Optimize edilmiş build başlatılıyor..." -ForegroundColor Blue
    
    # Environment variables
    $env:NODE_ENV = if ($Production) { "production" } else { "development" }
    $env:ANALYZE = if ($Analyze) { "true" } else { "false" }
    
    if ($Verbose) {
        $env:NEXT_DEBUG = "true"
        $env:DEBUG = "*"
    }
    
    # Clear previous build
    if (Test-Path "out") {
        Write-Host "🧹 Önceki build dosyaları temizleniyor..." -ForegroundColor Yellow
        Remove-Item "out" -Recurse -Force
    }
    
    if (Test-Path ".next") {
        Write-Host "🧹 Next.js cache temizleniyor..." -ForegroundColor Yellow
        Remove-Item ".next" -Recurse -Force
    }
    
    # Build command
    $buildStart = Get-Date
    Write-Host "⏱️  Build başlangıç zamanı: $($buildStart.ToString('HH:mm:ss'))" -ForegroundColor Blue
    
    try {
        if ($Analyze) {
            Write-Host "📊 Bundle analyzer ile build ediliyor..." -ForegroundColor Blue
            & npm run build:analyze
        } else {
            Write-Host "🔨 Standard build ediliyor..." -ForegroundColor Blue
            & npm run build
        }
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build başarısız! Exit code: $LASTEXITCODE" -ForegroundColor Red
            return $false
        }
        
        $buildEnd = Get-Date
        $buildDuration = $buildEnd - $buildStart
        Write-Host "✅ Build başarılı! Süre: $($buildDuration.TotalSeconds.ToString('F2'))s" -ForegroundColor Green
        
        return $true
    } catch {
        Write-Host "❌ Build hatası: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Build analizi
function Invoke-BuildAnalysis {
    Write-Host "📊 Build analizi yapılıyor..." -ForegroundColor Blue
    
    if (-not (Test-Path "out")) {
        Write-Host "❌ Build output bulunamadı. Önce build'i çalıştırın." -ForegroundColor Red
        return
    }
    
    # Output directory size
    $outSize = (Get-ChildItem "out" -Recurse | Measure-Object -Property Length -Sum).Sum
    $outSizeMB = [math]::Round($outSize / 1MB, 2)
    
    Write-Host "📦 Build Analizi:" -ForegroundColor Yellow
    Write-Host "  📁 Output boyutu: $outSizeMB MB" -ForegroundColor White
    
    # HTML files count
    $htmlFiles = Get-ChildItem "out" -Recurse -Filter "*.html" | Measure-Object
    Write-Host "  📄 HTML dosya sayısı: $($htmlFiles.Count)" -ForegroundColor White
    
    # JS files analysis
    $jsFiles = Get-ChildItem "out" -Recurse -Filter "*.js"
    if ($jsFiles) {
        $jsTotalSize = ($jsFiles | Measure-Object -Property Length -Sum).Sum
        $jsSizeMB = [math]::Round($jsTotalSize / 1MB, 2)
        Write-Host "  🟨 JavaScript boyutu: $jsSizeMB MB ($($jsFiles.Count) dosya)" -ForegroundColor White
        
        # En büyük JS dosyalarını göster
        $largestJS = $jsFiles | Sort-Object Length -Descending | Select-Object -First 3
        Write-Host "    📈 En büyük JS dosyaları:" -ForegroundColor Gray
        foreach ($file in $largestJS) {
            $sizeMB = [math]::Round($file.Length / 1MB, 3)
            $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
            Write-Host "      - $relativePath ($sizeMB MB)" -ForegroundColor Gray
        }
    }
    
    # CSS files analysis
    $cssFiles = Get-ChildItem "out" -Recurse -Filter "*.css"
    if ($cssFiles) {
        $cssTotalSize = ($cssFiles | Measure-Object -Property Length -Sum).Sum
        $cssSizeMB = [math]::Round($cssTotalSize / 1MB, 2)
        Write-Host "  🎨 CSS boyutu: $cssSizeMB MB ($($cssFiles.Count) dosya)" -ForegroundColor White
    }
    
    # Image files analysis
    $imageFiles = Get-ChildItem "out" -Recurse | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|gif|webp|svg|ico)$' }
    if ($imageFiles) {
        $imageTotalSize = ($imageFiles | Measure-Object -Property Length -Sum).Sum
        $imageSizeMB = [math]::Round($imageTotalSize / 1MB, 2)
        Write-Host "  🖼️  Image boyutu: $imageSizeMB MB ($($imageFiles.Count) dosya)" -ForegroundColor White
    }
    
    # Performance recommendations
    Write-Host ""
    Write-Host "💡 Performance Önerileri:" -ForegroundColor Yellow
    
    if ($outSizeMB -gt 10) {
        Write-Host "  ⚠️  Total bundle size büyük ($outSizeMB MB). Code splitting kullanmayı düşünün." -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ Bundle size optimal ($outSizeMB MB)" -ForegroundColor Green
    }
    
    if ($jsSizeMB -gt 5) {
        Write-Host "  ⚠️  JavaScript bundle büyük ($jsSizeMB MB). Tree shaking ve lazy loading kullanın." -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ JavaScript bundle optimal ($jsSizeMB MB)" -ForegroundColor Green
    }
    
    if ($imageSizeMB -gt 2) {
        Write-Host "  ⚠️  Image assets büyük ($imageSizeMB MB). WebP format ve compression kullanın." -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ Image assets optimal ($imageSizeMB MB)" -ForegroundColor Green
    }
}

# Lighthouse audit simulation
function Invoke-LighthouseAudit {
    Write-Host "🔍 Lighthouse-style audit yapılıyor..." -ForegroundColor Blue
    
    # Package.json içeriğini oku
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        
        # Dependencies analysis
        $depCount = if ($packageJson.dependencies) { ($packageJson.dependencies | Get-Member -MemberType NoteProperty).Count } else { 0 }
        $devDepCount = if ($packageJson.devDependencies) { ($packageJson.devDependencies | Get-Member -MemberType NoteProperty).Count } else { 0 }
        
        Write-Host "📦 Dependencies Analizi:" -ForegroundColor Yellow
        Write-Host "  📚 Production dependencies: $depCount" -ForegroundColor White
        Write-Host "  🛠️  Development dependencies: $devDepCount" -ForegroundColor White
        
        # Heavy dependencies check
        $heavyDeps = @()
        if ($packageJson.dependencies) {
            $packageJson.dependencies | Get-Member -MemberType NoteProperty | ForEach-Object {
                $depName = $_.Name
                if ($depName -match "(lodash|moment|jquery|bootstrap)" -and $depName -notmatch "(lodash-es|dayjs)") {
                    $heavyDeps += $depName
                }
            }
        }
        
        if ($heavyDeps.Count -gt 0) {
            Write-Host "  ⚠️  Heavy dependencies detected: $($heavyDeps -join ', ')" -ForegroundColor Yellow
            Write-Host "     Consider lightweight alternatives" -ForegroundColor Gray
        } else {
            Write-Host "  ✅ No heavy dependencies detected" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "⚠️  Package.json analizi yapılamadı: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Main execution
try {
    # Prerequisites check
    if (-not (Test-Prerequisites)) {
        exit 1
    }
    
    # Optimized build
    if (-not (Invoke-OptimizedBuild)) {
        exit 1
    }
    
    # Build analysis
    Invoke-BuildAnalysis
    
    # Lighthouse audit
    Invoke-LighthouseAudit
    
    Write-Host ""
    Write-Host "🎉 Build optimization tamamlandı!" -ForegroundColor Green
    Write-Host ""
    
    if ($Analyze) {
        Write-Host "📊 Bundle analyzer açılacak..." -ForegroundColor Blue
        Write-Host "   Browser'da bundle analizi görüntülenecek." -ForegroundColor Gray
    }
    
    Write-Host "📁 Output dizini: $(Get-Location)\out" -ForegroundColor Blue
    Write-Host "🚀 Static files deploy için hazır!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Script çalışırken kritik hata oluştu:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}