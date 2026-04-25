using LiftLog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LiftLog.Api.Data;

/*
This class defines: 
    - What tables exist
    - What entities map to tables
    - How we connect to the DB
*/
public class AppDbContext : DbContext
{
    /*
        remember in Program.cs we have this line:
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

        so if we can't add options stuff then we have no idea where postgres is, what database to connect to, or how to even generate SQL
    */
    // This constructor is required for Dependency Injection (DI).
    // ASP.NET Core creates AppDbContext for us and injects DbContextOptions<AppDbContext>,
    // which contains the database provider (Postgres) and connection string configured
    // in Program.cs via AddDbContext(...).
    //
    // The ": base(options)" part passes those options up to the parent DbContext class,
    // which uses them to configure the actual database connection.
    //
    // Without this constructor, EF Core would not know how to connect to the database.
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSet<Exercise> - EF sees this and knows to create a table named Exercises, plus map the Exercise.cs class properties to cols
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<WorkoutSingleExercise> WorkoutSingleExercises => Set<WorkoutSingleExercise>();
}