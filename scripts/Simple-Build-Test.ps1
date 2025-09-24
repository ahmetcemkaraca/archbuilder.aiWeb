# ArchBuilder.AI Simple Build Test Script

Write-Host "ArchBuilder.AI Build Test" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Node.js version check
$nodeVersion = & node --version 2>$null
if ($nodeVersion) {
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js not found!" -ForegroundColor Red
    exit 1
}

# Build test
Write-Host "Running build..." -ForegroundColor Blue
$buildStart = Get-Date

& npm run build

if ($LASTEXITCODE -eq 0) {
    $buildEnd = Get-Date
    $buildDuration = $buildEnd - $buildStart
    Write-Host "Build successful in $($buildDuration.TotalSeconds.ToString('F2'))s" -ForegroundColor Green
    
    # Output analysis
    if (Test-Path "out") {
        $outSize = (Get-ChildItem "out" -Recurse | Measure-Object -Property Length -Sum).Sum
        $outSizeMB = [math]::Round($outSize / 1MB, 2)
        Write-Host "Output size: $outSizeMB MB" -ForegroundColor Yellow
        
        $htmlFiles = (Get-ChildItem "out" -Recurse -Filter "*.html").Count
        Write-Host "HTML files: $htmlFiles" -ForegroundColor Yellow
        
        Write-Host "Build analysis complete!" -ForegroundColor Green
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}