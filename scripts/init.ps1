# init : spin up local dev env
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

while (-not (docker info 2>$null)) {
    Write-Host "Waiting for Docker..."
    Start-Sleep -Seconds 2
}

if (docker container inspect liftlog-postgres 2>$null) {
    docker start liftlog-postgres | Out-Null
} else {
    docker compose up -d
}

$devSettings = Join-Path $RepoRoot 'api/appsettings.Development.json'
if (-not (Test-Path $devSettings)) {
    Write-Host "Missing api/appsettings.Development.json"
    Write-Host "Copy the example file:"
    Write-Host "  cp api/appsettings.Development.example.json api/appsettings.Development.json"
    exit 1
}

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

Write-Host "Postgres is running (liftlog-postgres on localhost:5433). API and frontend terminals launched."
