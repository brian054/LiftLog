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
2. Add a startup shell script to automate docker postgre startup, etc.

Postgre:  
`docker start liftlog-postgres`
`docker stop liftlog-postgres`
`docker restart liftlog-postgres`
`docker ps` shows just running containers
`docker ps -a` shows all containers

To run webapp: `npm run dev`
To run API: `dotnet run`

To create new Controller classes quickly: `dotnet new class -n ExerciseController -o Controllers`

api/Migrations folder: basically version control for our DB

---

## Local Dev Scripts

This project includes PowerShell scripts to simplify local development.

### Available scripts (commands assume you run them from project root)

- `.\scripts\init.ps1`  
  Starts Docker (if needed), Postgres, API, and web.

- `.\scripts\reload.ps1`  
  Starts API and web only.

- `. .\load-dev-commands.ps1`
  Load helper commands so you can run 'init' and 'reload' rather than typing './scripts/reload.ps1'
  Note: working on a MacOS dev solution. There's probably an OS dependent way here that I'm not seeing yet.
