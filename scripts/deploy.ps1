# One-click deploy: root site (mumumumuyi.github.io), subsite (ai-chronicle-2026 gh-pages), and source (main).
# Run from the repo root:  powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$root = Join-Path $env:TEMP 'root_gh_pages'
$sub  = Join-Path $env:TEMP 'subsite_gh_pages'
Set-Location $repo

function Sync($from, $to) {
  Get-ChildItem $to -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
  Copy-Item (Join-Path $from '*') $to -Recurse -Force
}

Write-Host '== 1/3 root site ==' -ForegroundColor Cyan
npm run build; if ($LASTEXITCODE) { throw 'root build failed' }
if (-not (Test-Path "$root\.git")) { git clone https://github.com/Mumumumuyi/mumumumuyi.github.io.git $root }
git -C $root pull --ff-only
Sync "$repo\dist" $root
git -C $root add -A
git -C $root commit -m "deploy: $(git log --oneline -1)"
git -C $root push origin HEAD

Write-Host '== 2/3 subsite (gh-pages) ==' -ForegroundColor Cyan
npm run build:subsite; if ($LASTEXITCODE) { throw 'subsite build failed' }
if (-not (Test-Path "$sub\.git")) { git worktree add $sub gh-pages }
git -C $sub pull --ff-only origin gh-pages
Sync "$repo\dist" $sub
git -C $sub add -A
git -C $sub commit -m "deploy: $(git log --oneline -1)"
git -C $sub push origin gh-pages

Write-Host '== 3/3 source main ==' -ForegroundColor Cyan
npm run build; if ($LASTEXITCODE) { throw 'rebuild failed' }   # restore root-base dist in the working tree
git push origin main

Write-Host 'Done. Check: https://mumumumuyi.github.io/  and  https://mumumumuyi.github.io/ai-chronicle-2026/' -ForegroundColor Green
