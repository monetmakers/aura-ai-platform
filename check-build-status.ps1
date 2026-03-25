# Railway Build Status Checker
# Monitors deployment and auto-fixes common errors

Write-Host "🚀 Checking Railway Build Status..." -ForegroundColor Cyan
Write-Host ""

# Check git for recent changes
$lastCommit = git log -1 --format="%H"
$lastMessage = git log -1 --format="%s"

Write-Host "Last commit: $lastMessage" -ForegroundColor Yellow
Write-Host "Hash: $lastCommit" -ForegroundColor Gray
Write-Host ""

# Function to detect and fix common errors
function Test-And-FixFile {
    param([string]$FilePath)
    
    Write-Host "Checking $FilePath..." -ForegroundColor Cyan
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ File not found" -ForegroundColor Red
        return $false
    }
    
    $content = [System.IO.File]::ReadAllText($FilePath)
    $original = $content
    $needsFix = $false
    
    # Check for BOM
    if ($content.StartsWith([char]0xFEFF)) {
        Write-Host "  ⚠️  BOM detected - removing..." -ForegroundColor Yellow
        $content = $content.Substring(1)
        $needsFix = $true
    }
    
    # Check for corrupted first character
    if ($content -match "^[^\w]*import") {
        Write-Host "  ⚠️  Corrupted first character - fixing..." -ForegroundColor Yellow
        $content = $content -replace "^[^\w]*", ""
        $needsFix = $true
    }
    
    # Check file length
    if ($content.Length -eq 0) {
        Write-Host "  ❌ File is empty!" -ForegroundColor Red
        return $false
    }
    
    if ($needsFix) {
        $utf8NoBOM = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($FilePath, $content, $utf8NoBOM)
        
        Write-Host "  ✅ Fixed and saved!" -ForegroundColor Green
        
        # Commit the fix
        git add $FilePath
        git commit -m "auto-fix: $FilePath encoding issue"
        git push origin main
        
        Write-Host "  ✅ Committed and pushed!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  ✓ File looks good" -ForegroundColor Green
        return $false
    }
}

# Check critical files
$criticalFiles = @(
    "client/src/pages/landing.tsx",
    "client/src/pages/dashboard.tsx",
    "server/routes.ts"
)

Write-Host "Checking critical files..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Test-And-FixFile $file
        Write-Host ""
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "Status Check Complete" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Step:" -ForegroundColor Yellow
Write-Host "  Check Railway dashboard for build status" -ForegroundColor Gray
Write-Host "  https://railway.app" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 View Live App:" -ForegroundColor Yellow
Write-Host "  https://aura-ai-platform.up.railway.app" -ForegroundColor Gray
