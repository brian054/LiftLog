# reload : start API and web only (Postgres should already be running)
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot
npm run dev:apps
