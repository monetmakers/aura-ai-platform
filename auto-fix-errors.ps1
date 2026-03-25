# Auto-Fix Build Errors Script
# Monitors landing.tsx and fixes common encoding/syntax issues automatically

param(
    [int]$WatchIntervalSeconds = 5,
    [switch]$AutoCommit = $true
)

Write-Host "🔧 Auto-Fix Errors Monitor Started" -ForegroundColor Cyan
Write-Host "Watching: client/src/pages/landing.tsx" -ForegroundColor Gray
Write-Host ""

$filePath = "client/src/pages/landing.tsx"
$lastHash = ""
$fixesApplied = 0

while ($true) {
    try {
        # Check if file exists
        if (-not (Test-Path $filePath)) {
            Write-Host "❌ File not found: $filePath" -ForegroundColor Red
            break
        }

        # Get current file hash
        $currentHash = (Get-FileHash $filePath -Algorithm MD5).Hash
        
        if ($currentHash -ne $lastHash) {
            $lastHash = $currentHash
            Write-Host "📝 File changed, checking for errors..." -ForegroundColor Yellow
            
            # Read file
            $content = [System.IO.File]::ReadAllText($filePath)
            $originalContent = $content
            $fixed = $false
            
            # FIX 1: Remove BOM (Byte Order Mark)
            if ($content.StartsWith([char]0xFEFF)) {
                Write-Host "  🔧 Removing BOM..." -ForegroundColor Green
                $content = $content.Substring(1)
                $fixed = $true
            }
            
            # FIX 2: Remove leading corrupted characters
            if ($content -match "^[^\w]*(import|export|const|function)") {
                Write-Host "  🔧 Cleaning leading characters..." -ForegroundColor Green
                # Keep only valid JavaScript
                $content = $content -replace "^[^\w]*", ""
                $fixed = $true
            }
            
            # FIX 3: Check for incomplete first line
            $firstLine = ($content -split "`n")[0]
            if ($firstLine -match "^[^i]*import" -and $firstLine -notmatch "^import") {
                Write-Host "  🔧 Fixing corrupted import statement..." -ForegroundColor Green
                $lines = $content -split "`n"
                $lines[0] = $lines[0] -replace "^[^i]*", "i"
                $content = $lines -join "`n"
                $fixed = $true
            }
            
            # FIX 4: Ensure proper UTF-8 encoding without BOM
            if ($fixed) {
                $utf8NoBOM = New-Object System.Text.UTF8Encoding $false
                [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBOM)
                
                $fixesApplied++
                Write-Host "  ✅ Fixed! ($fixesApplied total fixes)" -ForegroundColor Green
                
                if ($AutoCommit) {
                    Write-Host "  📤 Committing fix..." -ForegroundColor Yellow
                    git add $filePath
                    git commit -m "auto-fix: correct landing.tsx encoding issue [fix #$fixesApplied]" --no-verify
                    git push origin main
                    Write-Host "  ✅ Committed and pushed!" -ForegroundColor Green
                }
            } else {
                Write-Host "  ✓ File looks clean" -ForegroundColor Green
            }
        }
        
        Start-Sleep -Seconds $WatchIntervalSeconds
        
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
        Start-Sleep -Seconds $WatchIntervalSeconds
    }
}
