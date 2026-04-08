# init : spin up local dev env
docker desktop start

# if 'docker info' fails, wait 2 seconds and try again
while (!(docker info 2>$null)) {
    Start-Sleep -Seconds 2
}

docker start liftlog-postgres | Out-Null
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "$PWD\api"; dotnet run'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd "$PWD\web"; npm run dev'