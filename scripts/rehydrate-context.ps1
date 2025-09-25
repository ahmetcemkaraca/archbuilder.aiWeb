# Context Rehydration Script
# Proje context bilgilerini günceller

param(
    [switch]$Verbose = $false
)

Write-Host "🔄 Context rehydration starting..." -ForegroundColor Blue

# Context dosyalarının varlığını kontrol et
$contextFiles = @(
    "docs/context/current-context.md",
    "docs/context/README.md"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

foreach ($file in $contextFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  $file missing, creating..." -ForegroundColor Yellow
        
        if ($file -eq "docs/context/current-context.md") {
            $contextContent = @"
# Current Context - ArchBuilder.AI Website

**Last Updated**: $timestamp
**Project**: ArchBuilder.AI Website (Next.js 15 + TypeScript)

## Current State
- Build: Next.js 15.5.3 with App Router
- Framework: React 19, TypeScript, Tailwind CSS 4
- Deployment: Static export capability
- i18n: 7 languages supported

## Recent Changes
- Dependency conflicts resolved (Framer Motion updated)
- CI/CD workflows optimized
- Registry validation implemented

## Next Actions
- Monitor build performance
- Complete internationalization
- Optimize deployment pipeline
"@
            Set-Content -Path $file -Value $contextContent -Encoding UTF8
        }
    }
}

Write-Host "✅ Context rehydration completed" -ForegroundColor Green
exit 0