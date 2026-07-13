Goal: Track my progressive overload training, cardio, yoga, and nutrition all in one web app.

Goal platforms: All Browsers, IPhone, Android etc.

# Flow for adding new Models, updating EF Core migrations folder, then update database:

To add new tables:

1. Add file to Models: (TableName.cs), define cols and types
2. Add to AppDbContext, Example: public DbSet<Exercise> Exercises => Set<Exercise>();
3. Run: `dotnet ef migrations add InitialWorkoutSetup` from the API directory
4. Apply to Database: `dotnet ef database update`, applies migration and creates the db tables + schema from the model

# Random:

TODO:

1. Add Create Workout form + database and all

PostgreSQL container: `liftlog-postgres`  
Host port: `5433` (maps to container port `5432`)  
Named volume: `liftlog-postgres-data`

`docker start liftlog-postgres`  
`docker stop liftlog-postgres`  
`docker restart liftlog-postgres`  
`docker ps` shows just running containers  
`docker ps -a` shows all containers

To create new Controller classes quickly: `dotnet new class -n ExerciseController -o Controllers`

api/Migrations folder: basically version control for our DB

---

## Local development

### URLs

- API: `http://localhost:5198`
- Swagger UI: `http://localhost:5198/`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5433`

### First-time setup

From the project root:

```bash
cp api/appsettings.Development.example.json api/appsettings.Development.json
docker compose up -d
dotnet tool restore
cd api && dotnet restore && dotnet ef database update && cd ..
npm install
npm install --prefix web
```

`api/appsettings.Development.json` is gitignored. Keep your real local connection string there.

### Morning startup

After a reboot, you usually only need one command from the project root:

```bash
npm run dev
```

Typical morning flow:

1. Turn on your computer
2. Open Docker Desktop and wait until it is running
3. Open a terminal in the project root
4. Run `npm run dev`

That one command will:

- verify Docker is running
- start the existing `liftlog-postgres` container, or create it once if needed
- verify `api/appsettings.Development.json` exists
- start the API with `dotnet watch run`
- start the frontend with `npm run dev`
- stream prefixed logs from both processes in the same terminal

Open the app at `http://localhost:5173`.

To stop everything for the day, press `Ctrl+C` in that terminal. This stops the API and frontend only. Postgres keeps running in Docker, which is fine.

### Restart API and frontend during the day

If Postgres is already running and you only need to restart the app processes, use:

```bash
npm run dev:apps
```

Use this after:

- pressing `Ctrl+C`
- closing the dev terminal
- wanting a clean restart without touching Postgres

If you only need one process, you can still run them independently:

```bash
cd api && dotnet watch run
cd web && npm run dev
```

### Daily development

`npm run dev` is the main command. It runs `scripts/prepare-dev.mjs` first, then starts the API and frontend together.

To inspect only the startup checks without launching the apps:

```bash
node scripts/prepare-dev.mjs
```

macOS alternative for the full stack:

```bash
./scripts/dev.sh
```

This will:

- start the existing `liftlog-postgres` container, or create it once with `docker compose up -d`
- run the API with `dotnet watch run`
- run the frontend with `npm run dev`
- stream prefixed logs from both processes
- stop both processes when you press `Ctrl+C`

For app-only restarts, see [Restart API and frontend during the day](#restart-api-and-frontend-during-the-day).

Windows PowerShell equivalents:

```powershell
.\scripts\init.ps1
.\scripts\reload.ps1
```

`.\scripts\reload.ps1` runs `npm run dev:apps`.

Optional helper commands:

```powershell
. .\load-dev-commands.ps1
init
reload
api
web
```

### Run API or frontend independently

API:

```bash
cd api
dotnet watch run
```

Frontend:

```bash
cd web
npm run dev
```

### Database safety

Routine startup should only start the existing container or run `docker compose up -d`.

Do not use these during normal development unless you intentionally want to wipe local data:

```bash
docker compose down -v
docker rm -v liftlog-postgres
docker volume rm liftlog-postgres-data
```
