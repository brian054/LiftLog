using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LiftLog.Api.Data;
using LiftLog.Api.Models;

namespace LiftLog.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExerciseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExerciseController(AppDbContext context)
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
    public async Task<IActionResult> Create([FromBody] CreateExerciseRequest item)
    {
        var exercise = new Exercise
        {
            Name = item.Name
        };

        _context.Exercises.Add(exercise);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, exercise);
    }

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
public class CreateExerciseRequest
{
    public string Name { get; set; } = "";
}
