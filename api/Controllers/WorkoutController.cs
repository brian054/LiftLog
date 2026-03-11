using LiftLog.Api.Data;
using LiftLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LiftLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkoutController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/workout
    [HttpGet]
    public async Task<IActionResult> GetWorkouts()
    {
        var workouts = await _context.Workouts
            .Include(w => w.Exercises) // List<WorkoutExercise> Exercises in Workout A,B.....
                .ThenInclude(we => we.Exercise)
            .ToListAsync();

        return Ok(workouts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkout(int id)
    {
        var workout = await _context.Workouts
            .Include(w => w.Exercises)
                .ThenInclude(we => we.Exercise)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workout == null)
            return NotFound();

        return Ok(workout);
    }

    // The client (React or Swagger) sends JSON containing the workout name.
    // ASP.NET automatically converts that JSON into a CreateWorkoutRequest object (DTO).
    // We then create a Workout entity from that DTO, add it to EF Core's DbContext,
    // and call SaveChangesAsync() which inserts the row into the database.
    [HttpPost]
    public async Task<IActionResult> CreateWorkout([FromBody] CreateWorkoutRequest request)
    {
        var workout = new Workout
        {
            Name = request.Name
        };

        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
    }
}

// This is a DTO (Data Transfer Object).
// It represents the data the client sends to the API.
// So the client (React, Swagger, whoever) sends the JSON { "name": "Workout A"}, ASP.NET converts that JSON into this object
// It's a way for us to control what the client is allowed to send.
// Eventually you'll probably have more DTO's, so once that happens just separate them out into DTO folder.
public class CreateWorkoutRequest
{
    public string Name { get; set; } = "";
}