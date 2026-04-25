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
  // This exercise can be in many WorkoutExercise records.
  // TODO: How does this scale? Does it scale? I mean what if we have 2 million in this list? 
  // Maybe each user would have its own DB like it's own WorkoutExercises list, cuz why would we want everyone elses,
  // Plus users who want tons of storage could pay for the extra, idk how that works RESEARCH ASAP
  public List<WorkoutSingleExercise> WorkoutExercises { get; set; } = new();
}