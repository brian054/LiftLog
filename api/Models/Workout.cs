/*
  Represents Workout A, B, C, etc.


*/
namespace LiftLog.Api.Models;

public class Workout
{
  public int Id { get; set; }

  public string Name { get; set; } = ""; // "Workout A", "Workout B"
                                         // This workout contains many WorkoutExercise entries, again research how this scales and how 
                                         // you're going to manage this, or if we need to redesign.
  public List<WorkoutSingleExercise> Exercises { get; set; } = new();
}