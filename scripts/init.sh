#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Start Docker Desktop, then rerun this script."
  exit 1
fi

if docker container inspect liftlog-postgres >/dev/null 2>&1; then
  docker start liftlog-postgres
else
  docker compose up -d
fi

if [[ ! -f "$ROOT/api/appsettings.Development.json" ]]; then
  echo "Missing api/appsettings.Development.json"
  echo "Copy the example file:"
  echo "  cp api/appsettings.Development.example.json api/appsettings.Development.json"
  exit 1
fi

cat <<EOF

Postgres is running (liftlog-postgres on localhost:5433).

Start the API in one terminal:
  cd api && dotnet watch run

Start the frontend in another terminal:
  cd web && npm run dev

API:      http://localhost:5198
Frontend: http://localhost:5173
EOF
