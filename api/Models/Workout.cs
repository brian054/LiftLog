/*
  Represents Workout A, B, C, etc.

  
*/
namespace LiftLog.Api.Models;

public class Workout
{
    public int Id { get; set; }

    public string Name { get; set; } = ""; // "Workout A", "Workout B"

    public List<WorkoutExercise> Exercises { get; set; } = new();
}