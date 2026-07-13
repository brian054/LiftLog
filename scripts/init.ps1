# init : spin up local dev env
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot
npm run dev
