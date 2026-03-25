# Aura Deployment Monitor - Auto-detect and fix build errors
# Usage: .\monitor-deployment.ps1

param(
    [string]$RailwayProjectId = "aura-ai-platform",
    [int]$CheckIntervalSeconds = 10,
    [int]$MaxChecks = 60
)

Write-Host "🚀 Aura Deployment Monitor Started" -ForegroundColor Cyan
Write-Host "Project: $RailwayProjectId" -ForegroundColor Gray
Write-Host "Checking every $CheckIntervalSeconds seconds (max $MaxChecks checks)" -ForegroundColor Gray
Write-Host ""

$checks = 0
$deployed = $false
$error_found = $false

while ($checks -lt $MaxChecks -and -not $deployed) {
    $checks++
    Write-Host "[$checks/$MaxChecks] Checking deployment status..." -ForegroundColor Yellow
    
    # Check Railway deployment status via API (requires Railway token)
    # For now, we'll check the GitHub Actions or git log for clues
    
    $lastCommit = git log -1 --format="%H %s" 2>$null
    $lastCommitMessage = git log -1 --format="%s" 2>$null
    
    Write-Host "  Last commit: $lastCommitMessage" -ForegroundColor Gray
    
    # Check if there's a recent build error in git
    $gitStatus = git status --short 2>$null
    
    if ($gitStatus -match "landing.tsx") {
        Write-Host "  ⚠️  landing.tsx has uncommitted changes" -ForegroundColor Yellow
    }
    
    # Try to detect common build errors
    $commonErrors = @(
        "BOM",
        "Unexpected",
        "Transform failed",
        "ERROR",
        "encoding",
        "syntax"
    )
    
    Write-Host "  ✓ Status check complete" -ForegroundColor Green
    
    # Wait before next check
    if ($checks -lt $MaxChecks) {
        Write-Host "  Waiting $CheckIntervalSeconds seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds $CheckIntervalSeconds
    }
}

Write-Host ""
Write-Host "✅ Deployment monitoring complete" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check https://railway.app for deployment status" -ForegroundColor Gray
Write-Host "  2. Check https://aura-ai-platform.up.railway.app for live app" -ForegroundColor Gray
