Goal: Track my progressive overload training, cardio, yoga, and nutrition all in one web app.

Goal platforms: All Browsers, IPhone, Android etc.

## Data model

LiftLog stores lifting data in three PostgreSQL tables:

| Table | Represents | Example |
|-------|------------|---------|
| **Workouts** | A workout template or plan | "Workout A", "Push Day" |
| **Exercises** | Global exercise catalog (reusable across workouts) | "Bench Press", "Hammer Curls" |
| **WorkoutSingleExercises** | One exercise inside one workout, with programming | "In Workout A, Bench Press is 3×8" |

**Relationships:**

- A **Workout** has many **WorkoutSingleExercises**
- An **Exercise** can appear in many workouts (via join rows)
- **WorkoutSingleExercises** links a workout and an exercise, and stores **Sets**, **Reps**, and **SortOrder**

**Key columns:**

- `Workouts`: `Id`, `Name`
- `Exercises`: `Id`, `Name`, `FormLink` (optional form video URL — not in the UI yet)
- `WorkoutSingleExercises`: `Id`, `WorkoutId`, `ExerciseId`, `Sets`, `Reps`, `SortOrder`

**Example:** Workout A contains DB Bench Press (3 sets × 8 reps) and Tricep Pushdown (3 sets × 12 reps).

---

# Flow for adding new Models, updating EF Core migrations folder, then update database:

To add new tables:

1. Add file to Models: (TableName.cs), define cols and types
2. Add to AppDbContext, Example: public DbSet<Exercise> Exercises => Set<Exercise>();
3. Run: `dotnet ef migrations add InitialWorkoutSetup` from the API directory
4. Apply to Database: `dotnet ef database update`, applies migration and creates the db tables + schema from the model

# Random:

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

You don't have to start Docker Desktop yourself — this script will do it for you if it isn't already running. If Docker is already open, it just continues.

Typical morning flow:

1. Turn on your computer
2. Open a terminal in the project root
3. Run `npm run dev`

That one command will:

- verify Docker is running (or launch Docker Desktop on macOS and wait until it's ready)
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

- start Docker Desktop if needed (you don't have to open it yourself)
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
