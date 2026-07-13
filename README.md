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

To run webapp: `npm run dev`  
To run API: `dotnet watch run` (hot reload) or `dotnet run`

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
cd api && dotnet restore && dotnet ef database update
cd ../web && npm install
```

`api/appsettings.Development.json` is gitignored. Keep your real local connection string there.

### Daily development

**macOS / Linux**

```bash
./scripts/init.sh
```

Starts Postgres, then prints the manual API and frontend commands.

App only (Postgres already running):

```bash
./scripts/reload.sh
```

**Windows PowerShell**

```powershell
.\scripts\init.ps1
```

Starts Postgres and launches API and frontend in separate terminal windows.

App only:

```powershell
.\scripts\reload.ps1
```

Optional helper commands:

```powershell
. .\load-dev-commands.ps1
init
reload
api
web
```

### Manual fallback (always valid)

```bash
docker start liftlog-postgres
```

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
