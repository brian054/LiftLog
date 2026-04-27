# We have hot reload for react and .NET API....cool, postgres stays running in docker....this is essentially defunct
# Init still needed? : I'll use it to spin up postgres and initially run when I log on for the day....

# TODO: delete this file in next next commit

# # reload : reload local dev env
# Write-Host "Starting API..."
# Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "$PWD\api"; dotnet run'

# Write-Host "Starting Web..."
# Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "$PWD\web"; npm run dev'
