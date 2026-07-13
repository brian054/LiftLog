using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LiftLog.Api.Data;
using LiftLog.Api.Models;

namespace LiftLog.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutExerciseController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkoutExerciseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.Exercises.ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.Exercises.FindAsync(id);

        if (item == null)
            return NotFound();

        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWorkoutExerciseRequest request)
    {
        var workoutExercise = new WorkoutSingleExercise
        {
            WorkoutId = request.WorkoutId,
            ExerciseId = request.ExerciseId,
            Sets = request.Sets,
            Reps = request.Reps
        };

        _context.WorkoutSingleExercises.Add(workoutExercise);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = workoutExercise.Id }, workoutExercise);
    }

    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Exercises.FindAsync(id);

        if (item == null)
            return NotFound();

        _context.Exercises.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTO - move out soon
public class CreateWorkoutExerciseRequest
{
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public int Sets { get; set; }
    public int Reps { get; set; }
}
