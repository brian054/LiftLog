/*
  Represents DB Bench, DB Curl, etc.

  WorkoutExercises List : we need to know which WorkoutExercises it belongs to so we can retrieve the specific sets and reps 
  for that exercise
*/
namespace LiftLog.Api.Models;

public class Exercise
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? FormLink { get; set; }
    public List<WorkoutExercise> WorkoutExercises { get; set; } = new();
}