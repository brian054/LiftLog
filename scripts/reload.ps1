# reload : start API and web only (Postgres should already be running)
$RepoRoot = Split-Path -Parent $PSScriptRoot

$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { 'pwsh' } else { 'powershell' }
$apiPath = Join-Path $RepoRoot 'api'
$webPath = Join-Path $RepoRoot 'web'

Write-Host "Starting API..."
Start-Process $shell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$apiPath'; dotnet watch run"
)

Write-Host "Starting Web..."
Start-Process $shell -ArgumentList @(
    '-NoExit',
    '-Command',
    "Set-Location '$webPath'; npm run dev"
)
