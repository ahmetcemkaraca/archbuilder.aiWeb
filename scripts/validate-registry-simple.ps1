# Registry Validation Script - Simple version
param([switch]$Verbose = $false)

Write-Host "Registry validation starting..." -ForegroundColor Green

$registryFiles = @(
    "docs/registry/identifiers.json",
    "docs/registry/endpoints.json", 
    "docs/registry/schemas.json"
)

$allFilesExist = $true

foreach ($file in $registryFiles) {
    if (Test-Path $file) {
        Write-Host "$file exists" -ForegroundColor Green
        try {
            $content = Get-Content $file -Raw | ConvertFrom-Json
            Write-Host "   Valid JSON format" -ForegroundColor Gray
        }
        catch {
            Write-Host "   Invalid JSON format in $file" -ForegroundColor Red
            $allFilesExist = $false
        }
    }
    else {
        Write-Host "$file missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host "Registry validation completed successfully" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "Registry validation failed" -ForegroundColor Red
    exit 1
}