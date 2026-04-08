# reload : reload local dev env
Write-Host "Starting API..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "$PWD\api"; dotnet run'

Write-Host "Starting Web..."
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "$PWD\web"; npm run dev'