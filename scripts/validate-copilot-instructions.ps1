#!/usr/bin/env pwsh
# Validate Copilot instructions consistency and completeness

param(
    [switch]$Verbose,
    [switch]$Fix
)

$ErrorActionPreference = "Stop"

# Colors for output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Red = "`e[31m"
$Reset = "`e[0m"

function Write-Success { param($Message) Write-Host "${Green}✅ $Message${Reset}" }
function Write-Warning { param($Message) Write-Host "${Yellow}⚠️  $Message${Reset}" }
function Write-Error { param($Message) Write-Host "${Red}❌ $Message${Reset}" }
function Write-Info { param($Message) if ($Verbose) { Write-Host "ℹ️  $Message" } }

Write-Host "${Green}🤖 Validating Copilot Instructions Configuration${Reset}"
Write-Host ""

$ValidationErrors = 0
$ValidationWarnings = 0

# Check main copilot-instructions.md file
$MainInstructionsPath = ".github/copilot-instructions.md"
if (Test-Path $MainInstructionsPath) {
    Write-Success "Main copilot-instructions.md exists"
    
    $content = Get-Content $MainInstructionsPath -Raw
    
    # Check for required sections
    $requiredSections = @(
        "Project Architecture Overview",
        "MANDATORY DEVELOPMENT WORKFLOW", 
        "Custom i18n System Usage",
        "Instruction Files Reference Guide",
        "Registry & Persistent Context"
    )
    
    foreach ($section in $requiredSections) {
        if ($content -like "*$section*") {
            Write-Info "Section found: $section"
        } else {
            Write-Warning "Missing section: $section"
            $ValidationWarnings++
        }
    }
} else {
    Write-Error "Main copilot-instructions.md not found"
    $ValidationErrors++
}

# Check instruction files directory
$InstructionsDir = ".github/instructions"
if (Test-Path $InstructionsDir) {
    Write-Success "Instructions directory exists"
    
    $instructionFiles = Get-ChildItem "$InstructionsDir/*.instructions.md"
    Write-Info "Found $($instructionFiles.Count) instruction files"
    
    # Expected instruction files based on project
    $expectedFiles = @(
        "web-typescript-react.instructions.md",
        "website-nextjs-patterns.instructions.md", 
        "i18n-patterns.instructions.md",
        "ux-ui-design.instructions.md",
        "performance-optimization.instructions.md",
        "code-style.instructions.md",
        "registry-governance.instructions.md"
    )
    
    foreach ($file in $expectedFiles) {
        $filePath = Join-Path $InstructionsDir $file
        if (Test-Path $filePath) {
            Write-Success "Essential instruction file exists: $file"
        } else {
            Write-Warning "Missing essential instruction file: $file"
            $ValidationWarnings++
        }
    }
} else {
    Write-Error "Instructions directory not found"
    $ValidationErrors++
}

# Check GitHub issue templates
$IssueTemplatesDir = ".github/ISSUE_TEMPLATE"
if (Test-Path $IssueTemplatesDir) {
    Write-Success "Issue templates directory exists"
    
    $expectedTemplates = @(
        "bug_report.yml",
        "copilot_task.yml"
    )
    
    foreach ($template in $expectedTemplates) {
        $templatePath = Join-Path $IssueTemplatesDir $template
        if (Test-Path $templatePath) {
            Write-Success "Issue template exists: $template"
        } else {
            Write-Warning "Missing issue template: $template"
            $ValidationWarnings++
        }
    }
} else {
    Write-Warning "Issue templates directory not found"
    $ValidationWarnings++
}

# Check PR template
$PRTemplatePath = ".github/pull_request_template.md"
if (Test-Path $PRTemplatePath) {
    Write-Success "PR template exists"
} else {
    Write-Warning "PR template not found"
    $ValidationWarnings++
}

# Check prompts directory
$PromptsDir = ".github/prompts"
if (Test-Path $PromptsDir) {
    Write-Success "Prompts directory exists"
    
    $promptFiles = Get-ChildItem "$PromptsDir/*.prompt.md"
    Write-Info "Found $($promptFiles.Count) prompt files"
} else {
    Write-Warning "Prompts directory not found"
    $ValidationWarnings++
}

# Validate registry files are referenced correctly
$RegistryDir = "docs/registry"
if (Test-Path $RegistryDir) {
    Write-Success "Registry directory exists"
    
    $expectedRegistryFiles = @(
        "identifiers.json",
        "endpoints.json",
        "schemas.json"
    )
    
    foreach ($file in $expectedRegistryFiles) {
        $filePath = Join-Path $RegistryDir $file
        if (Test-Path $filePath) {
            Write-Success "Registry file exists: $file"
        } else {
            Write-Warning "Missing registry file: $file"
            $ValidationWarnings++
        }
    }
} else {
    Write-Warning "Registry directory not found - this is required for proper Copilot workflow"
    $ValidationWarnings++
}

# Check package.json for required scripts
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    $requiredScripts = @("dev", "build", "lint", "test")
    foreach ($script in $requiredScripts) {
        if ($packageJson.scripts.$script) {
            Write-Success "Required script exists: $script"
        } else {
            Write-Warning "Missing required script: $script"
            $ValidationWarnings++
        }
    }
} else {
    Write-Error "package.json not found"
    $ValidationErrors++
}

# Summary
Write-Host ""
Write-Host "📊 Validation Summary:"
Write-Host "Errors: $ValidationErrors"
Write-Host "Warnings: $ValidationWarnings"

if ($ValidationErrors -eq 0 -and $ValidationWarnings -eq 0) {
    Write-Success "All Copilot instructions are properly configured! 🎉"
    exit 0
} elseif ($ValidationErrors -eq 0) {
    Write-Warning "Copilot instructions are functional but have $ValidationWarnings warnings"
    exit 0
} else {
    Write-Error "Copilot instructions have $ValidationErrors errors that need to be fixed"
    exit 1
}