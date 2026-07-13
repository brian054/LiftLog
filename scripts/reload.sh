#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
Start the API in one terminal:
  cd api && dotnet watch run

Start the frontend in another terminal:
  cd web && npm run dev

API:      http://localhost:5198
Frontend: http://localhost:5173
EOF
