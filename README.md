Hmmmm.....

# Flow for adding new Models, updating EF Core migrations folder, then update database:

To add new tables:

1. Add file to Models: (TableName.cs), define cols and types
2. Add to AppDbContext, Example: public DbSet<Exercise> Exercises => Set<Exercise>();
3. Run: `dotnet ef migrations add InitialWorkoutSetup` from the API directory
4. Apply to Database: `dotnet ef database update`, applies migration and creates the db tables + schema from the model

# Random:

To run API: `dotnet run`

api/Migrations folder: basically version control for our DB
