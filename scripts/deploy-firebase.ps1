#Requires -Version 5.1
<#
.SYNOPSIS
  Builds and deploys the ArchBuilder.AI Next.js website to Firebase Hosting.
.DESCRIPTION
  This script performs the following actions:
  1. Checks for Firebase CLI and installs if missing.
  2. Verifies Firebase authentication.
  3. Runs 'npm run build' to build the Next.js project.
  4. Runs 'npm run export' to create a static 'out' directory.
  5. Ensures a '.firebaserc' file exists, creating one for 'archbuilderai' if not.
  6. Deploys the 'out' directory to Firebase Hosting.
  7. Includes a commit hash in the deployment message.
.NOTES
  Author: GitHub Copilot
  Version: 1.3
#>

# Strict mode for better error handling
Set-StrictMode -Version Latest

# Function to check for a command's existence
function Test-CommandExists {
    param (
        [string]$command
    )
    return (Get-Command $command -ErrorAction SilentlyContinue) -ne $null
}

# --- Script Start ---
Write-Host "🔥 ArchBuilder.AI Firebase Deployment Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 1. Check for Firebase CLI
if (-not (Test-CommandExists "firebase")) {
    Write-Host "❌ Firebase CLI not found. Please install it globally:" -ForegroundColor Yellow
    Write-Host "   npm install -g firebase-tools" -ForegroundColor Gray
    exit 1
}
$firebaseVersion = firebase --version
Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green

# 2. Check Firebase Login Status
Write-Host "Verifying Firebase login status..."
firebase login:list 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔑 You are not logged into Firebase. Initiating login..." -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Firebase login failed. Please try again." -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Firebase login verified." -ForegroundColor Green

# 3. Build the project
Write-Host "🏗️ Building the project for production..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Project build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Project built successfully." -ForegroundColor Green

# 4. Export the static site
Write-Host "📦 Exporting the static site..." -ForegroundColor Blue
npm run export
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Static export failed." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path -Path "out" -PathType Container)) {
    Write-Host "❌ Build output directory 'out' not found after export!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Static site exported successfully to 'out' directory." -ForegroundColor Green

# 5. Ensure .firebaserc exists
if (-not (Test-Path -Path ".firebaserc")) {
    Write-Host "🔧 .firebaserc file not found. Creating it for project 'archbuilderai'..." -ForegroundColor Yellow
    try {
        Set-Content -Path ".firebaserc" -Value '{ "projects": { "default": "archbuilderai" } }' -Encoding utf8
        Write-Host "✅ .firebaserc created successfully." -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create .firebaserc file." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .firebaserc file found." -ForegroundColor Green
}

# 6. Deploy to Firebase Hosting
Write-Host "🚀 Deploying to Firebase Hosting..." -ForegroundColor Magenta

$commitHash = "unknown"
if (Test-CommandExists "git") {
    $commitHash = (git rev-parse --short HEAD 2>$null).Trim()
}
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$deployMessage = "Automated deploy at $timestamp (Commit: $commitHash)"

firebase deploy --only hosting --message "$deployMessage" --project archbuilderai

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your site is now live." -ForegroundColor Cyan
    
    try {
        $openSite = Read-Host "Do you want to open the deployed site in your browser? (y/n)"
        if ($openSite -eq 'y') {
            firebase open hosting:site --project archbuilderai
        }
    } catch {
        Write-Host "Could not automatically open the browser. Please open the site manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Deployment failed. Check the output from the Firebase CLI above." -ForegroundColor Red
    exit 1
}

Write-Host "✨ Script finished." -ForegroundColor Green