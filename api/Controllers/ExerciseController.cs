using LiftLog.Api.Data;
using LiftLog.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LiftLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ExercisesController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/exercises
    [HttpGet]
    public async Task<ActionResult<List<Exercise>>> GetAll()
    {
        var items = await _db.Exercises
            .OrderBy(e => e.Name)
            .ToListAsync();

        return Ok(items);
    }

    public record CreateExerciseRequest(string Name);

    // POST /api/exercises
    [HttpPost]
    public async Task<ActionResult<Exercise>> Create([FromBody] CreateExerciseRequest req)
    {
        var name = (req.Name ?? "").Trim();
        if (name.Length < 2)
            return BadRequest("Exercise name must be at least 2 characters.");

        var exists = await _db.Exercises.AnyAsync(e => e.Name.ToLower() == name.ToLower());
        if (exists)
            return Conflict("Exercise already exists.");

        var exercise = new Exercise { Name = name };

        _db.Exercises.Add(exercise);
        await _db.SaveChangesAsync();

        return Created($"/api/exercises/{exercise.Id}", exercise);
    }
}